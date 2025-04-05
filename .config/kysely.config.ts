import { defineConfig } from "kysely-ctl";
import { db } from "../src/initialize";

export default defineConfig({
  kysely: db,
});
