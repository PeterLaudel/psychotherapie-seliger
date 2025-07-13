import * as dotenv from "dotenv";

dotenv.config({ path: [`.env.${process.env.NODE_ENV}`] });

export function sqliteUrl(): string {
  return process.env.SQLITE_URL || "";
}


export function environment(): string {
  return process.env.NODE_ENV || "";
}