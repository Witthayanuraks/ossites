require("dotenv").config() // (optional for dev) Remove if you running on production

function toNumberInt(num) {
  const isNaIT = String(num)
  const numbers = isNaN(isNaIT)? 1 : parseInt(isNaIT.replace(/[^\d.-]+/g, '') || "0")
  return typeof numbers == "number"? numbers : parseInt(numbers)
}

// # Config Database For Pool Connection
// Docs: https://node-postgres.com/apis/pool
const configDatabase = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
  port: !!process.env.DB_PORT? toNumberInt(process.env.DB_PORT):undefined,
  database: process.env.DB_DATABASE || "pemilos",
  max: !!process.env.DB_CLIENT_MAX?toNumberInt(process.env.DB_CLIENT_MAX):undefined,
}

module.exports = configDatabase