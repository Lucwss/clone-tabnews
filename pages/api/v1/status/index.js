const { query } = require('../../../../infra/database.js')

async function status(request, response) {
  const updatedAt = new Date().toISOString()

  const databaseName = process.env.POSTGRE_DB
  const resultServerVersion = await query("SHOW server_version;")
  const resultMaxConnections = await query("SHOW max_connections;")
  const resultHealthy = await query("SELECT * FROM pg_stat_replication;")
  const resultOpenedConnections = await query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName]
  })

  const serverVersion = resultServerVersion.rows[0].server_version
  const maxConnections = resultMaxConnections.rows[0].max_connections
  const healthy = resultMaxConnections.rows[0].max_connections
  const openedConnections = resultOpenedConnections.rowCount

  return response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: serverVersion,
        max_connections: parseInt(maxConnections),
        opened_connections: openedConnections,
      }
    }
  })
}

export default status