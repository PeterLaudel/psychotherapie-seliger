import { dbCreate } from "@/database";

export { dbCreate };

if (require.main === module) {
  dbCreate().then(() => process.exit(0));
}
