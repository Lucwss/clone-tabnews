const pg = require('pg')

async function query(queryObject) {

  const client = new pg.Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRE_DB,
    password: process.env.POSTGRES_PASSWORD
  })

  await client.connect()

  try {
    const result = await client.query(queryObject)
    return result
  } catch (error) {
    console.error(error)
  }
  finally {
    await client.end()
  }
}


module.exports = {
  query
}