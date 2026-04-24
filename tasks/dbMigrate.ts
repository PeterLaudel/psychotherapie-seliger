import { dbMigrate } from "@/database";

export { dbMigrate };

if (require.main === module) {
  dbMigrate().then(() => process.exit(0));
}
