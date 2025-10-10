import { getDb } from "@/initialize";
import { Therapeut } from "@/models/therapeut";

type SaveTherapeut = Omit<Therapeut, "id"> & { id?: number };

export class TherapeutRepository {
  constructor(private readonly database = getDb()) {}

  public async all(): Promise<Therapeut[]> {
    return await this.database.selectFrom("therapeuts").selectAll().execute();
  }

  public async save(therapeut: SaveTherapeut): Promise<Therapeut> {
    if (therapeut.id) {
      return await this.database
        .updateTable("therapeuts")
        .set({
          ...therapeut,
        })
        .where("id", "=", therapeut.id)
        .returningAll()
        .executeTakeFirstOrThrow();
    }
    return await this.database
      .insertInto("therapeuts")
      .values(therapeut)
      .returningAll()
      .executeTakeFirstOrThrow();
  }
}
