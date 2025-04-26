const db = require("../connection.db")
const { GetAuthAdmin } = require("./admin")
const generateId = require("../../random-id")
const {
  validateCase,
  Valid_GetList_Siswa,
  Valid_GetView_Siswa,
} = require("./__structure")
const ObjectInsert = require("./__objectinsert")

async function GetList_Siswa({ auth, page = 0, limit = 30 } = {}) {
  // Validasi form
  if(validateCase(Valid_GetList_Siswa,{ limit, page })) {
    return validateCase(Valid_GetList_Siswa,{ limit, page })
  }
  // Perizinan Admin
  const authAdmin = await GetAuthAdmin({ auth })
  if(authAdmin.code) {
    return authAdmin
  }
  // Mengambil data siswa
  const getSiswa = await db.query(`SELECT
  siswa.id,
  siswa.nama,
  kelas.label AS kelas,
  siswa.nik,
  -- Kartu Pemilih / Vote Card
  kartupemilih.id AS kartupemilihid,
  kartupemilih.kodepemilih,
  kartupemilih.mulaivote,
  kartupemilih.berhentivote
FROM siswa
LEFT JOIN kelas ON siswa.kelas = kelas.id
LEFT JOIN kartupemilih ON siswa.id = kartupemilih.siswaid
LIMIT $1 OFFSET $2`,[limit, (page*limit)])
  if(getSiswa.error) {
    return { code: 500, message: "Internal server error" }
  }
  // Return data
  return {
    data: {
      list: getSiswa.data.data.map((data) => ({
        id: data.id,
        nama: data.nama,
        kelas: data.kelas,
        nik: data.nik,
        kartu_vote: !!data.kartupemilihid? {
          id: data.kartupemilihid,
          kodepemilih: data.kodepemilih,
          mulai: new Date(data.mulaivote),
          berhenti: new Date(data.berhentivote),
        } : {}
      }))
    }
  }
}
async function GetView_Siswa({ auth, id } = {}) {
  // Validasi form
  if(validateCase(Valid_GetView_Siswa,{ id })) {
    return validateCase(Valid_GetView_Siswa,{ id })
  }
  // Perizinan Admin
  const authAdmin = await GetAuthAdmin({ auth })
  if(authAdmin.code) {
    return authAdmin
  }
  // Mengambil data siswa
  const getSiswa = await db.query(`SELECT
  siswa.id,
  siswa.nama,
  kelas.label AS kelas,
  siswa.nik,
  siswa.nisn,
  siswa.email,
  siswa.nomerhp,
  -- Kartu Pemilih / Vote Card
  kartupemilih.id AS kartupemilihid,
  kartupemilih.kodepemilih,
  kartupemilih.mulaivote,
  kartupemilih.berhentivote
FROM siswa
LEFT JOIN kelas ON siswa.kelas = kelas.id
LEFT JOIN kartupemilih ON siswa.id = kartupemilih.siswaid
WHERE siswa.id = $1`,[id])
  if(getSiswa.error) {
    return { code: 500, message: "Internal server error" }
  }
  const getSiswaData = getSiswa?.data?.data[0]
  if(!getSiswaData) {
    return { code: 404, message: "Not founding" }
  }
  // Return data
  return {
    data: {
      profile: {
        nama: getSiswaData.nama,
        kelas: getSiswaData.kelas,
        siswa: getSiswaData.nik,
        nisn: getSiswaData.nisn,
        email: getSiswaData.email,
        nomerhp: getSiswaData.nomerhp,
      },
      kartu_vote: !!getSiswaData.kartupemilihid? {
        id: getSiswaData.kartupemilihid,
        kodepemilih: getSiswaData.kodepemilih,
        mulai: new Date(getSiswaData.mulaivote),
        berhenti: new Date(getSiswaData.berhentivote),
      } : {}
    }
  }
}

async function NewData_Siswa({ auth, data } = {}) {
  
}
GetView_Siswa({
  auth: "adminds.204a7db76923e2bfc1aa183686cdf06e.b6bbec092d4334521e635517df2fb1f7f3139f2182910ff51bea1767bcddcdac",
  id: 12
}).then(a => console.log(a))
async function EditData_Siswa({ auth, id, data } = {}) {
  
}
async function DeleteData_Siswa({ auth, id } = {}) {
  
}

module.exports = {
  GetList_Siswa, // List siswa
  GetView_Siswa, // Lihat siswa
  NewData_Siswa, // Tambah siswa
  EditData_Siswa, // Edit siswa
  DeleteData_Siswa // Hapus siswa
}