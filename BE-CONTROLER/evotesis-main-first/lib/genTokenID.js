function GenerateToken() {
  const ascData = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
  let tx = ""
  for(let i of [...Array(6)]) {
    tx += ascData[Math.floor(Math.random() * ascData.length)]
  }
  return tx
}

module.exports = GenerateToken