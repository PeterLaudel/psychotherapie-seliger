import { defineConfig } from "kysely-ctl";
import { getDb } from "../src/initialize";

export default defineConfig({
  kysely: getDb(),
});
