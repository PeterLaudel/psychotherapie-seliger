import { jsonArrayFrom } from "kysely/helpers/sqlite";
import { getDb } from "@/initialize";
import { Service } from "@/models/service";

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
}
