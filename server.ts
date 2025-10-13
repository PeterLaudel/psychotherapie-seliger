//load environment
import path from "path";
import fs from "fs";
import * as dotenv from "dotenv";

const homeDir = path.join(
  process.env.HOME || "",
  "Library",
  "Application Support",
  "psychotherapie-seliger"
);

// create directory if it doesn't exist
if (!fs.existsSync(homeDir)) {
  fs.mkdirSync(homeDir, { recursive: true });
}

dotenv.config({ path: path.join(homeDir, ".env"), quiet: true });

// mgiraate database
import { dbMigrate } from "./tasks/dbMigrate";

process.env.SQLITE_URL = path.join(homeDir, "psychotherapie_seliger.sqlite");
dbMigrate();

//start next.js server
import next from "next";
import * as http from "http";

const dev = false; // we always run production mode
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

// eslint-disable-next-line @typescript-eslint/no-floating-promises
app.prepare().then(() => {
  http
  .createServer((req, res) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      handle(req, res);
    })
    .listen(3000, () => {
      // eslint-disable-next-line no-console
      console.log("🚀 Next.js server running on http://localhost:3000");
    });
});
