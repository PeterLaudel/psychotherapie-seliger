import { getDb } from "@/initialize";
import { Amount, Service } from "@/models/service";
import { serviceSelector } from "./selectors/service";

type SaveService = Omit<Service, "id"> & { id?: number };

export default class ServicesRepository {
  constructor(private readonly database = getDb()) {}

  public async all(): Promise<Service[]> {
    return await serviceSelector(this.database).$castTo<Service>().execute();
  }

  public async find(serviceId: number): Promise<Service> {
    return await serviceSelector(this.database)
      .where("id", "=", serviceId)
      .$castTo<Service>()
      .executeTakeFirstOrThrow();
  }

  public async save(service: SaveService): Promise<Service> {
    return await this.database.transaction().execute(async (trx) => {
      const { id } = await this.upsertService(service, trx);
      await this.upsertAmounts(id, service.amounts, trx);
      return serviceSelector(trx)
        .where("id", "=", id)
        .$castTo<Service>()
        .executeTakeFirstOrThrow();
    });
  }

  private async upsertService(service: SaveService, database = this.database) {
    const { id, amounts, ...rest } = service;
    if (id) {
      return await database
        .updateTable("services")
        .set(rest)
        .where("id", "=", id)
        .returningAll()
        .executeTakeFirstOrThrow();
    }

    return await database
      .insertInto("services")
      .values(rest)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  private async upsertAmounts(
    serviceId: number,
    amounts: Amount[],
    database = this.database
  ) {
    await database
      .deleteFrom("serviceAmounts")
      .where("serviceAmounts.serviceId", "=", serviceId)
      .execute();
    await Promise.all(
      amounts.map(async (amount) => {
        return await database
          .insertInto("serviceAmounts")
          .values({
            serviceId,
            factor: amount.factor,
            price: amount.price,
          })
          .executeTakeFirstOrThrow();
      })
    );
  }
}
