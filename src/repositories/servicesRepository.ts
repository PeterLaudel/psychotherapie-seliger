import { jsonArrayFrom } from "kysely/helpers/postgres";
import { db } from "@/initialize";
import { Service } from "@/models/service";

export default class ServicesRepository {
  constructor(private readonly database = db) {}

  public async all(): Promise<Service[]> {
    return await db
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
      .execute();
  }
}
