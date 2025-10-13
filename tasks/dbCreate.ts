import fs from "fs";
import path from "path";
import { sqliteUrl } from "../src/environment";


export function dbCreate() {
  const filePath = sqliteUrl();
  console.log(`Creating database file at: ${filePath}`);
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "");
    console.log(`Created file: ${filePath}`);
  } else {
    console.log(`File already exists: ${filePath}`);
  }
}

if (require.main === module) {
  dbCreate();
}