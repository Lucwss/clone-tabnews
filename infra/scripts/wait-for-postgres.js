const { exec } = require("node:child_process");

function checkPostgres() {
  exec(
    "docker exec postgres-dev pg_isready --host localhost",
    (error, stdout) => {
      if (stdout.search("accepting connections") === -1) {
        process.stdout.write(".");
        setTimeout(checkPostgres, 1000);
        return;
      }

      console.log("\n🟢 PostgreSQL is ready!\n");
    },
  );
}

console.log("\n\n🔴 Waiting for PostgreSQL to become available");
checkPostgres();
