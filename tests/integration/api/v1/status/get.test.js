test('GET to /api/v1/status should return 200', async () => {

  const response = await fetch('http://0.0.0.0:3000/api/v1/status')
  expect(response.status).toBe(200)

  const responseBody = await response.json()
  expect(responseBody).toBeDefined()

  const updatedAt = responseBody.updated_at
  const dateParsedUpdatedAt = new Date(updatedAt).toISOString()
  expect(updatedAt).toEqual(dateParsedUpdatedAt)

  const dependencies = responseBody.dependencies
  const database = dependencies.database

  expect(database).toBeDefined()

  const version = database.version
  const status = database.status
  const maxConnections = database.max_connections
  const openedConnections = database.opened_connections

  expect(version).toBeDefined()
  expect(version).toEqual('16.4')

  expect(maxConnections).toBeDefined()
  expect(maxConnections).toEqual(100)

  expect(openedConnections).toBeDefined()
  expect(openedConnections).toEqual(1)


})