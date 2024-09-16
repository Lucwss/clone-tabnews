const pg = require('pg')

const client = new pg.Client({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRE_DATABASE,
  password: process.env.POSTGRES_PASSWORD
})


async function connect() {
  await client.connect()
  return client
}

async function closeConnection() {
  await client.end()
}


async function query(queryObject) {
  const connectedClient = await connect()
  const result = await connectedClient.query(queryObject)
  await closeConnection()
  return result
}


module.exports = {
  query
}