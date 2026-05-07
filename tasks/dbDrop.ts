import { dbDrop } from "@/database";
export { dbDrop };


if (require.main === module) {
  dbDrop().then(() => process.exit(0));
}
