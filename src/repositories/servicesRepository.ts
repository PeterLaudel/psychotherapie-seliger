import { jsonArrayFrom } from "kysely/helpers/sqlite";
import { getDb } from "@/initialize";
import { Service } from "@/models/service";

type SaveService = Omit<Service, "id"> & { id?: number };

export default class ServicesRepository {
  constructor(private readonly database = getDb()) {}

  public async all(): Promise<Service[]> {
    return await this.database
      .selectFrom("services")
      .selectAll()
      .select((eb) => [
        jsonArrayFrom(
          eb
            .selectFrom("serviceAmounts")
            .select(["factor", "price"])
            .whereRef("services.id", "=", "serviceId")
        ).as("amounts"),
      ])
      .$castTo<Service>()
      .execute();
  }

  public async find(serviceId: number): Promise<Service> {
    return await this.database
      .selectFrom("services")
      .selectAll()
      .select((eb) => [
        jsonArrayFrom(
          eb
            .selectFrom("serviceAmounts")
            .select(["factor", "price"])
            .whereRef("services.id", "=", "serviceId")
        ).as("amounts"),
      ])
      .where("id", "=", serviceId)
      .$castTo<Service>()
      .executeTakeFirstOrThrow();
  }

  public async save(service: SaveService): Promise<Service> {
    const { amounts, id, ...rest} = service;
    if (id) {
      return await this.database
        .updateTable("services")
        .set(rest)
        .where("id", "=", id)
        .returningAll()
        .returning((eb) => [
          jsonArrayFrom(
            eb
              .selectFrom("serviceAmounts")
              .select(["factor", "price"])
              .whereRef("services.id", "=", "serviceId")
          ).as("amounts"),
        ])
        .$castTo<Service>()
        .executeTakeFirstOrThrow();
    } else {
      return this.database.transaction().execute(async (trx) => {
        const createdService = await trx
          .insertInto("services")
          .values(rest)
          .returningAll()
          .executeTakeFirstOrThrow();

        const serviceAmounts = await Promise.all(
          amounts.map(async (amount) => {
            return await trx
              .insertInto("serviceAmounts")
              .values({
                serviceId: createdService.id,
                factor: amount.factor,
                price: amount.price,
              })
              .returning(["factor", "price"])
              .executeTakeFirstOrThrow();
          })
        );

        return { ...createdService, amounts: serviceAmounts };
      });
    }
  }
}
