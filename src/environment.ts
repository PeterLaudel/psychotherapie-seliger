import * as dotenv from "dotenv";

dotenv.config({ path: [`.env.${process.env.NODE_ENV}`] });

function getOrCrash(key: string) {
  const result = process.env[key];
  if (!result) throw new Error(`${key} environment variable missing`);
  return result;
}

export function postgresUrl(): string {
  return getOrCrash("POSTGRES_URL");
}
