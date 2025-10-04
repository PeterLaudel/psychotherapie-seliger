import next from 'next';
import * as http from 'http';

process.env.SQLITE_URL = process.env.HOME + '/psychotherapie_seliger.sqlite'
import { dbMigrate } from './tasks/dbMigrate';

dbMigrate();

const dev = false; // we always run production mode
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http
    .createServer((req, res) => {
      handle(req, res);
    })
    .listen(3000, () => {
      console.log("🚀 Next.js server running on http://localhost:3000");
    });
});
