import * as dotenv from "dotenv";

dotenv.config({ path: [`.env.${process.env.NODE_ENV}`] });

export function postgresUrl(): string {
  return process.env.POSTGRES_URL || "";
}
