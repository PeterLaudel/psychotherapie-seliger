
import fs from "fs";
import { sqliteUrl } from "@/environment";

export function dbDrop() {
  const filePath = sqliteUrl();
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Deleted file: ${filePath}`);
  } else {
    console.log(`File does not exist: ${filePath}`);
  }
}

dbDrop()
