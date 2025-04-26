function AlphabetRandomString(l=16) {
  const alpabetStg = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_."
  let tx = ""
  for(let i = 0; i < l; i++) {
    tx += alpabetStg[Math.floor(Math.random() * alpabetStg.length)]
  }
  return tx
}

module.exports = AlphabetRandomString