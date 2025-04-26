function ObjectInsert(data, { startIndex = 0, renderMore = 0, tabelName = "default", whereData = "" } = {}) {
  if(Array.isArray(data) || typeof data !== "object") {
    return {}
  }
  const equipeFilter = Object.keys(data).map((key) => {
    const _data = data[key]
    if(typeof _data == "undefined" || _data == null) {
      return undefined
    }
    return [key, _data]
  }).filter(a => (!!a))
  const changeToJsonScheme = Object.fromEntries(equipeFilter)
  const getListKey = Object.keys(changeToJsonScheme)
  const getListColumn = getListKey.map((key, i) => (`${key} = $${parseInt(i)+1+startIndex}`))
  const getListColumn1 = getListColumn.map((a) => (a.split("=")[1].trim()))
  const getListRowData = getListKey.map((key, i) => (changeToJsonScheme[key]))
  const getListMoreData = [...Array(renderMore)].map((o, i) => (`$${i+getListKey.length+1+startIndex}`))

  return {
    column: getListColumn,
    column1: getListColumn1,
    row: getListRowData,
    more: getListMoreData,
    insert: `INSERT INTO ${tabelName} (${getListKey.join(", ")}) VALUES(${getListColumn1.join(", ")})`,
    update: `UPDATE ${tabelName} SET ${getListColumn.join(", ")}${whereData.length > 2? ` WHERE ${whereData}`:""}`
  }
}

module.exports = ObjectInsert