import { runner } from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";

const defaultMigrationOptions = {
  dir: resolve(process.cwd(), "infra", "migrations"),
  direction: "up",
  dryRun: true,
  log: () => { },
  migrationsTable: "pgmigrations",
};

async function listPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();
    const pendingMigrations = await runner({
      dbClient,
      ...defaultMigrationOptions,
    });

    return pendingMigrations;
  } catch (error) {
    console.error("Migration error:", error);
    throw error;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await runner({
      dbClient,
      ...defaultMigrationOptions,
      dryRun: false,
    });

    return migratedMigrations;
  } catch (error) {
    console.error("Migration error:", error);
    throw error;
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
