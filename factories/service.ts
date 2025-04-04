import { Factory } from "fishery";
import { db } from "../src/initialize";
import type { Service } from "@/models/service";

export const serviceFactory = Factory.define<
  Omit<Service, "id">,
  unknown,
  Service
>(({ sequence }) => ({
  short: `Short ${sequence}`,
  originalGopNr: `OriginalGopNr ${sequence}`,
  description: `Description ${sequence}`,
  note: `Note ${sequence}`,
  points: sequence,
  amounts: {
    "1.0": sequence,
    "1.8": sequence + 1,
    "2.3": sequence + 2,
  },
})).onCreate(async (service) => {
  return await db
    .insertInto("services")
    .values(service)
    .returningAll()
    .executeTakeFirstOrThrow();
});
