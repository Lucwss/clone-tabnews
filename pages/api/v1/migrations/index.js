// const { query } = require('../../../../infra/database.js')
import { query } from 'infra/database.js'
import migrationRunner from 'node-pg-migrate'
import { join } from 'node:path'

const migrationParams = {
  databaseUrl: process.env.DATABASE_URL,
  dir: join('infra', 'migrations'),
  direction: 'up',
  verbose: true,
  migrationsTable: 'pgmigrations'
}

async function _handleDryRunMigration() {
  migrationParams.dryRun = false
  const migrations = await migrationRunner(migrationParams)
  return migrations
}

async function _handleLiveRunMigration() {
  migrationParams.dryRun = true
  const migrations = await migrationRunner(migrationParams)
  return migrations
}

const migrationTypesByRequestMethod = {
  "GET": _handleDryRunMigration,
  "POST": _handleLiveRunMigration
}

async function status(request, response) {

  if (request.method !== "GET" && request.method !== "POST") {
    return response.status(405).json({ error: 'Method not allowed' })
  }

  const migrationMethod = migrationTypesByRequestMethod[request.method]
  const migrations = await migrationMethod()
  return response.status(200).json(migrations)
}

export default status