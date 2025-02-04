const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function main() {
  const command = process.argv[2];
  if (command === "test") {
    console.log("Current working directory:", process.cwd());

    console.log(
      "Contents of node_modules/.bin:",
      fs.readdirSync("./node_modules/.bin")
    );

    const npmPath = path.resolve("./node_modules/.bin/npm");
    console.log("Using npm at:", npmPath);

    const result1 = spawnSync("/nodejs/bin/node", [npmPath, "config", "list"], {
      stdio: "inherit",
    });

    const result = spawnSync("/nodejs/bin/node", [npmPath, "run", "lint"], {
      stdio: "inherit",
    });
    if (result.error) {
      console.error("Error executing npm run lint:", result.error);
      process.exit(1);
    }
  }
}

main();
