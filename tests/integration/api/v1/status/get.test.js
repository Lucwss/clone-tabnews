const { query } = require('../../../../../infra/database.js')

test('GET to /api/v1/status should return 200', async () => {

  const result = await query("SELECT 1 + 1 as sum;")

  console.log(result.rows)


  const { status } = await fetch('http://0.0.0.0:3000/api/v1/status')
  expect(status).toBe(200)
})