import { execSync } from "child_process";

const argv = process.argv.slice(2);

if (argv.length === 0) {
  console.log("Usage: docker-entrypoint.js <command> [<args>]");
  process.exit(1);
}

if (argv[0] === "test") {
  console.log("Running tests...");
  execSync("npm run db:create");
  execSync("npm run db:migrate");
  const code = execSync("npm run test");
  process.exit(code);
}
