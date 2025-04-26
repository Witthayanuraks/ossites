const { Pool } = require("pg")
const debugConsoleLog = require("../debug")
const configDatabase = require("./config.db")

const cnsl = new debugConsoleLog({
  name: "PostgresSQL Pool"
})
const databasePg = new Pool(configDatabase)

cnsl.info("Config check:",configDatabase)

async function queryDatabase(query, values) {
  try {
    cnsl.log({ query, values })
    const dataSql = await databasePg.query(query, values)
    return {
      error: null,
      data: {
        data: dataSql.rows || [],
        count: dataSql.rowCount,
        field: dataSql.fields
      }
    }
  } catch(e) {
    cnsl.error(e.stack)
    return {
      error: e.stack,
      data: {}
    }
  }
}
async function multiQueryDatabase(paramsQuery) {
  const buildNewsArray = (paramsQuery || []).map((data) => ({
    query: Array.isArray(data)? data[0] : data,
    values: Array.isArray(data)? data[1] : undefined
  }))
  cnsl.log({ build: buildNewsArray })
  let results = []
  for(let dataBuild of buildNewsArray) {
    const requestsingle = await queryDatabase(dataBuild.query, dataBuild.values)
    results.push(requestsingle)
  }
  return results
}

module.exports = {
  db: databasePg,
  query: queryDatabase,
  multi: multiQueryDatabase
}