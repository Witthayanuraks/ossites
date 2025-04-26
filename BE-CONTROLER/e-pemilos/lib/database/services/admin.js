const db = require("../connection.db")
const packet = require("../../auth-packet")
const generateId = require("../../random-id")
const { validateCase, Valid_Login_Dashboard, Valid_SignInAdmin_Dashboard, Valid_GetAuthAdmin } = require("./__structure")
const ObjectInsert = require("./__objectinsert")

async function Login_Dashboard({ username, password } = {}) {
  // Validate Form Json
  if(validateCase(Valid_Login_Dashboard, { username, password })) {
    return validateCase(Valid_Login_Dashboard, { username, password })
  }
  // Getting Data
  const dataView = await db.query(`SELECT id,username,password,authid FROM admin WHERE username = $1`, [username])
  if(dataView.error) {
    return { code: 500, message: "Internal server error" }
  }
  const getUser = dataView.data?.data[0]
  // User not found
  if(!getUser) {
    return { code: 400, message: "Username or password unvalid" }
  }
  // Password not matched!
  if(packet.decrypted(getUser.password, "pwadmin").data !== password) {
    return { code: 400, message: "Username or password unvalid" }
  }
  // Match all
  const idforauth = generateId(15)
  const _a = await db.query(`UPDATE admin SET authid = $1 WHERE id = $2`,[idforauth, getUser.id])
  if(_a.error) {
    return { code: 500, message: "Internal server error" }
  }
  // Return Data Auth
  return { auth: packet.encrypted(`authcheckup-${idforauth}`, "adminds") }
}

// -----------------------------------------------------------------------------------------
// | FUNGSI INI TIDAK DIPERGUNAKAN SECARA GLOBAL, HANYA TERTUTUP BAGIAN BACKEND ATAU ADMIN |
// -----------------------------------------------------------------------------------------
async function SignInAdmin_Dashboard({ name, username, password } = {}) {
  // Validate Form Json
  if(validateCase(Valid_SignInAdmin_Dashboard, { name, username, password })) {
    return validateCase(Valid_SignInAdmin_Dashboard, { name, username, password })
  }
  // Createing Data
  const generateAuthFirst = generateId(15)
  const dataInsertNew = {
    name: name,
    username: username,
    password: packet.encrypted(password, "pwadmin"),
    authid: generateAuthFirst,
  }
  const structInsert = ObjectInsert(dataInsertNew, { tabelName: "admin" })
  const _a = await db.query(structInsert.insert, structInsert.row)
  if(_a.error) {
    return { code: 500, message: "Internal server error" }
  }
  return {
    data: {
      success: true,
      register: {
        name: name,
        username: username,
      }
    }
  }
}

async function GetAuthAdmin({ auth } = {}) {
  // Extract Packet Data
  if(validateCase(Valid_GetAuthAdmin, { auth })) {
    return {
      code: 401,
      message: validateCase(Valid_GetAuthAdmin, { auth }).message,
      action: "TryLoginAgain"
    }
  }
  const extPacket = packet.decrypted(auth, "adminds")
  if(extPacket.error) {
    return { code: 415, message: "Authentikasi bermasalah, format tidak didukung", action: "TryLoginAgain" }
  }
  // Search Admin Authentication ID
  const getAdmin = await db.query('SELECT * FROM admin WHERE authid = $1', [extPacket.data.split("authcheckup-")[1]])
  if(!getAdmin.data.data[0]) {
    return { code: 403, message: "Authentikasi sudah kadaluarsa atau tidak tersedia lagi" }
  }
  // All Data
  return {
    data: getAdmin.data.data[0]
  }
}

module.exports = {
  Login_Dashboard,
  SignInAdmin_Dashboard,
  GetAuthAdmin
}