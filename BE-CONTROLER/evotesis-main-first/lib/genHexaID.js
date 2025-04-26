module.exports = (l = 12, t = "hex") => {
  return require("crypto").randomBytes(l).toString(t)
}