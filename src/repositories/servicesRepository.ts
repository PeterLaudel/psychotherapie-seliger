import { db } from "@/initialize";
import { Service } from "@/models/service";

export default class ServicesRepository {
  constructor(private readonly database = db) {}

  public async all(): Promise<Service[]> {
    return await db.selectFrom("services").selectAll().execute();
  }
}
