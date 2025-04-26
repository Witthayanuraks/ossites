const { object, string, number, date, InferType } = require("yup")

const Valid_Login_Dashboard = object({
  username: string() // Username - Admin
    .min(6, "Minimal masukan username adalah 6 huruf")
    .max(65, "Maksimal masukan username adalah 65 huruf")
    .required("Username dibutuhkan!"),
  password: string() // Password - Admin
    .min(6, "Minimal masukan password adalah 6 huruf")
    .max(65, "Maksimal masukan password adalah 65 huruf")
    .required("Password dibutuhkan!"),
})
const Valid_SignInAdmin_Dashboard = object({
  name: string() // Nama - Admin
    .min(4, "Minimal masukan nama adalah 4 huruf")
    .max(65, "Maksimal masukan nama adalah 65 huruf")
    .required("Nama dibutuhkan"),
  username: string() // Username - Admin
    .min(6, "Minimal masukan username adalah 6 huruf")
    .max(65, "Maksimal masukan username adalah 65 huruf")
    .required("Username dibutuhkan!"),
  password: string() // Password - Admin
    .min(6, "Minimal masukan password adalah 6 huruf")
    .max(65, "Maksimal masukan password adalah 65 huruf")
    .required("Password dibutuhkan!"),
})

const Valid_GetAuthAdmin = object({
  auth: string("Authentikasi harus bertipe string")
    .required("Authentikasi harus ada untuk mengakses ini")
})

const Valid_GetList_Siswa = object({
  limit: number()
    .positive("Tidak dapat mengaturnya ke negatif")
    .integer("Selalu dengan angka biasa (interger!)")
    .lessThan(121, "Tidak dapat memberikan data lebih dari 120")
    .moreThan(9, "Tidak dapat memberikan data kurang dari 10"),
  page: number()
    .positive("Tidak dapat mengaturnya ke negatif")
    .integer("Selalu dengan angka biasa (interger!)")
})

const Valid_GetView_Siswa = object({
  id: number()
    .positive("Tidak ada id yang negatif pada format ini")
    .integer("Tidak ada id yang diluar interger jika berformat angka")
})

const Valid_NewData_Siswa = object({
  data: object({
    nama: string(),
    kelas: string(),
    nik: string(),
    nisn: string(),
    email: string(),
    nomerhp: string(),
  })
})

function validateCase(type, value) {
  try {
    type.validateSync(value)
    return undefined
  } catch(e) {
    if(!e?.errors[0]) {
      console.error('[ValidationError]:',e.stack)
      return {
        code: 500,
        message: "Internal server error"
      }
    }
    return {
      code: 422,
      message: e?.errors[0]
    }
  }
}

module.exports = {
  validateCase,
  Valid_Login_Dashboard,
  Valid_SignInAdmin_Dashboard,
  Valid_GetAuthAdmin,
  Valid_GetList_Siswa,
  Valid_GetView_Siswa,
  Valid_NewData_Siswa,
}