require("dotenv").config()
const crypto = require("crypto")

const password = process.env.ENC_PASSWORD
const typehash = process.env.ENC_TYPEHASH

function encrypted(authid, packettype = "auth") {
  try {
    const hash = crypto.createHash(typehash).update(password).digest("hex")
    const key = crypto.scryptSync(hash, "salt", 32)
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv)
    const encryptedData = Buffer.concat([
      cipher.update(authid, "utf8"),
      cipher.final(),
    ])
    return `${packettype}.${iv.toString("hex")}.${encryptedData.toString("hex")}`
  } catch(e) {
    console.log("[Encrypted Data Error]:", e.stack)
    return ""
  }
}
function decrypted(dataauth, packettype = "auth") {
  try {
    const [nictag, ivHex, encrypteddata] = String(dataauth).split(".")
    if(!nictag || nictag !== packettype || !ivHex || ivHex.length < 4 || !encrypted) {
      return { error: "unsupportpacket" }
    }
    const hash = crypto.createHash(typehash).update(password).digest("hex")
    const key = crypto.scryptSync(hash, "salt", 32)
    const iv = Buffer.from(ivHex, "hex")
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv)
    const decryptedData = Buffer.concat([
      decipher.update(Buffer.from(encrypteddata, "hex")),
      decipher.final(),
    ])
    return { data: decryptedData.toString("utf8") }
  } catch(e) {
    console.log("[Decrypted Data Error]:", e.stack)
    return { error: "internal" }
  }
}

module.exports = {
  encrypted, // For Login
  decrypted // For Action
}