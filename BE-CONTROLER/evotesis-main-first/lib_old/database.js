require('dotenv').config()
const { initializeApp } = require("firebase/app")
const { getFirestore, query, collection, setDoc, getDoc, getDocs, updateDoc, deleteDoc, doc } = require("firebase/firestore/lite")
const { ValidateOf_Candidate, ValidateOf_Student } = require("./datavalidate")

const initialize = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
  appId: process.env.FIREBASE_APPID,
  measurementId: process.FB_MEANSUREMENTID
}
Object.keys(initialize).forEach(a => {
  if(typeof a != 'string') {
    throw new Error(`Missing environment variable ${a}, please follow the database.md !`)
  }
})

const initals = initializeApp(initialize)
const db = getFirestore(initals)

const time_sosialtic = () => {
  const start = new Date(process.env.START_VOTE)
  const endVote = new Date(start.getTime() + Number(process.env.TIME_VOTE))
  const rightNow = new Date()

  const data = {
    start: rightNow.getTime() > start.getTime(),
    end: rightNow.getTime() > endVote.getTime(),
    rightnow: rightNow
  }
  return data
}

async function Get_Students() {
  try {
    let student = []
    let candidate = []
    const timeSystem = time_sosialtic()
    if(!timeSystem.end && timeSystem.start) {
      console.log("[Vote Time]: Check with candidate...")
      const candidateList = await getDocs(query(collection(db, "student_candidate")))
      candidateList.forEach(data => {
        const candit = data.data()
        if(!ValidateOf_Candidate(candit)) return;
        candidate.push({
          id: data.id,
          nomer: candit.labelindex,
          name: candit.name,
          profile: candit.profile,
          aboutvideo: candit.aboutvideo || null,
          visi: candit.visi.replaceAll('[et]', "\n").replaceAll('[br]', "\n"),
          misi: candit.misi.replaceAll('[et]', "\n").replaceAll('[br]', "\n")
        })
      })
      if(candidate.length < 2) {
        candidate = []
      }
      candidate = candidate.sort((a, b) => a.nomer - b.nomer)
    }
    const studentList = await getDocs(query(collection(db, "student_school")))
    studentList.forEach(data => {
      const stud = data.data()
      if(!ValidateOf_Student(stud, data.id)) return;
      const getCandidate = candidate[candidate.map(a => a.id).indexOf(stud.select_candidate)] || null
      student.push({
        id: data.id,
        name: stud.name,
        nik: stud.nik,
        kelas: data.id.split("-")[0],
        absen: data.id.split("-")[1],
        select_candidate: stud.select_candidate,
        get_candidate: !!stud.token? getCandidate : null,
        token: stud.token
      })
    })
    return {
      code: 200,
      data: student
    }
  } catch(err) {
    console.log(err)
    return {
      code: 500,
      message: "Internal Server Error !",
    }
  }
}
async function Get_Candidates({ returnwithtotal } = {}) {
  try {
    let candidate = []
    const candidateList = await getDocs(query(collection(db, "student_candidate")))
    candidateList.forEach(data => {
      const candit = data.data()
      if(!ValidateOf_Candidate(candit)) return;
      candidate.push({
        id: data.id,
        nomer: candit.labelindex,
        name: candit.name,
        profile: candit.profile,
        aboutvideo: candit.aboutvideo || null,
        visi: candit.visi.replaceAll('[et]', "\n").replaceAll('[br]', "\n"),
        misi: candit.misi.replaceAll('[et]', "\n").replaceAll('[br]', "\n"),
        totalvote: 0,
      })
    })
    if(candidate.length < 2) {
      return {
        code: 401,
        message: 'Limit, Add more your candidate to show perform !',
      }
    }
    candidate = candidate.sort((a, b) => a.nomer - b.nomer)
    if(returnwithtotal) {
      const studentList = await getDocs(query(collection(db, "student_school")))
      studentList.forEach(data => {
        const stud = data.data()
        if(!ValidateOf_Student(stud, data.id)) return;
        const indexselectcandidate = candidate.map(a => a.id).indexOf(stud.select_candidate||"")
        if(indexselectcandidate === -1) return;
        candidate[indexselectcandidate] = {
          ...candidate[indexselectcandidate],
          totalvote: candidate[indexselectcandidate]?.totalvote + 1
        }
      })
      candidate = candidate.sort((a, b) => b.totalvote - a.totalvote)
    }
    return {
      code: 200,
      data: candidate
    }
  } catch(err) {
    console.log(err)
    return {
      code: 500,
      message: "Internal Server Error !",
    }
  }
}
async function Get_TokenHasInvitate({ token } = {}) {
  try {
    const timeSystem = time_sosialtic()
    if(!timeSystem.start) {
      return {
        code: 401,
        message: "Belum saatnya melakukan voteing, coba saat waktunya !"
      }
    }
    if(timeSystem.end) {
      return {
        code: 401,
        message: "Waktu voteing telah berakhir, kamu tidak dapat masuk kembali !"
      }
    }
    let student = []
    const studentList = await getDocs(query(collection(db, "student_school")))
    studentList.forEach(data => {
      const stud = data.data()
      if(!ValidateOf_Student(stud, data.id)) return;
      student.push({
        id: data.id,
        name: stud.name,
        nik: stud.nik,
        kelas: data.id.split("-")[0],
        absen: data.id.split("-")[1],
        select_candidate: stud.select_candidate || null,
        token: stud.token
      })
    })
    const indexUser = student.map(a => a.token).indexOf(token)
    if(indexUser === -1) {
      return {
        code: 401,
        message: "Token tidak valid, coba lagi !"
      }
    }
    if(student[indexUser]?.select_candidate || student[indexUser]?.select_candidate?.length > 2) {
      return {
        code: 401,
        message: "Token sudah tidak dapat digunakan, kamu sudah voteing !"
      }
    }
    let candidate = []
    const candidateList = await getDocs(query(collection(db, "student_candidate")))
    candidateList.forEach(data => {
      const candit = data.data()
      if(!ValidateOf_Candidate(candit)) return;
      candidate.push({
        id: data.id,
        nomer: candit.labelindex,
        name: candit.name,
        profile: candit.profile,
        aboutvideo: candit.aboutvideo || null,
        visi: candit.visi.replaceAll('[et]', "\n").replaceAll('[br]', "\n"),
        misi: candit.misi.replaceAll('[et]', "\n").replaceAll('[br]', "\n"),
        totalvote: 0,
      })
    })
    return {
      code: 200,
      data: {
        page: "selectvote",
        token: token,
        candidate: candidate,
        user: {
          name: student[indexUser].name,
          kelas: student[indexUser].kelas,
          absen: student[indexUser].absen
        }
      }
    }
  } catch(err) {
    console.log(err)
    return {
      code: 500,
      message: "Internal Server Error !",
    }
  }
}
async function Set_VoteingCandidate({ token, candidate } = {}) {
  try {
    const timeSystem = time_sosialtic()
    if(!timeSystem.start) {
      return {
        code: 401,
        message: "Belum saatnya melakukan voteing, coba saat waktunya !"
      }
    }
    if(timeSystem.end) {
      return {
        code: 401,
        message: "Waktu voteing telah berakhir, kamu tidak dapat masuk kembali !"
      }
    }
    if(!candidate) {
      return {
        code: 400,
        message: 'Masukan kandidat yang ingin kamu pilih !'
      }
    }
    let student = []
    const studentList = await getDocs(query(collection(db, "student_school")))
    studentList.forEach(data => {
      const stud = data.data()
      if(!ValidateOf_Student(stud, data.id)) return;
      student.push({
        id: data.id,
        name: stud.name,
        nik: stud.nik,
        kelas: data.id.split("-")[0],
        absen: data.id.split("-")[1],
        select_candidate: stud.select_candidate || null,
        token: stud.token
      })
    })
    const indexUser = student.map(a => a.token).indexOf(token)
    if(indexUser === -1) {
      return {
        code: 401,
        message: "Token tidak valid, coba lagi !"
      }
    }
    if(student[indexUser]?.select_candidate || student[indexUser]?.select_candidate?.length > 2) {
      return {
        code: 401,
        message: "Token sudah tidak dapat digunakan, kamu sudah voteing !"
      }
    }
    const listAtabled = []
    const candidateList = await getDocs(query(collection(db, "student_candidate")))
    candidateList.forEach(data => {
      const candit = data.data()
      if(!ValidateOf_Candidate(candit)) return;
      listAtabled.push({
        id: data.id,
        name: candit.name,
        profile: candit.profile
      })
    })
    const getCandidateIndex = listAtabled.map(a => a.id).indexOf(candidate)
    if(getCandidateIndex === -1) {
      return {
        code: 400,
        message: "Kandidat yang kamu pilih, tidak ditemukan !"
      }
    }
    const idDocument = doc(db, "student_school", student[indexUser].id)
    const data = student[indexUser]
    await updateDoc(idDocument, {
      name: data.name,
      nik: data.nik,
      select_candidate: candidate,
      token: data.token
    })
    return {
      code: 200,
      message: "Berhasil memvoting kandidat, terimakasih !",
      data: {
        page: "loginpage"
      }
    }
  } catch(err) {
    console.log(err)
    return {
      code: 500,
      message: "Internal Server Error !",
    }
  }
}
async function Add_DataStudent({ nik, name, classselect, numberstudent } = {}) {
  try {
    if(typeof (nik && name && classselect && numberstudent) != 'string') {
      return {
        code: 400,
        message: 'Please, sign all input'
      }
    }
    if(classselect.length > 7) {
      return {
        code: 400,
        message: "Kesalahan, itu bukan format kelas !"
      }
    }
    if(isNaN(nik)) {
      return {
        code: 400,
        message: "Kesalahan, itu bukan format NIK !"
      }
    }
    if(isNaN(numberstudent)) {
      return {
        code: 400,
        message: "Kesalahan, itu bukan format nomer absen !"
      }
    }
    const dataDocs = {
      name: name,
      nik: nik,
      select_candidate: "",
      token: ""
    }
    const idDocs = `${classselect.toUpperCase()}-${String(numberstudent)}`
    await setDoc(doc(db, "student_school", idDocs), dataDocs)
    return {
      code: 200,
      message: "Berhasil menambahkan",
      data: {
        type: "adddocs",
        docs: {
          id: idDocs,
          name: name,
          nik: String(nik),
          kelas: classselect.toUpperCase(),
          absen: String(numberstudent),
          select_candidate: null,
          token: null
        }
      }
    }
  } catch(err) {
    console.log(err)
    return {
      code: 500,
      message: "Internal Server Error !",
    }
  }
}
async function Remove_DataStudent({ nik } = {}) {
  try {
    if(typeof nik != 'string') {
      return {
        code: 400,
        message: "Pilih NIK siswa untuk dihapus"
      }
    }
    let students = []
    const studentList = await getDocs(query(collection(db, "student_school")))
    studentList.forEach(data => {
      const stud = data.data()
      if(!ValidateOf_Student(stud, data.id)) return;
      students.push({
        id: data.id,
        nik: String(stud.nik)
      })
    })
    const i_user = students.map(a => a.nik).indexOf(nik)
    if(i_user === -1) {
      return {
        code: 404,
        message: "Siswa tidak ditemukan",
      }
    }
    const docsStudent = doc(db, "student_school", students[i_user].id)
    await deleteDoc(docsStudent)

    return {
      code: 200,
      message: "Berhasil menghapus",
      data: {
        type: "removedocs",
        docs: {
          id: students[i_user].id,
        }
      }
    }
  } catch(err) {
    console.log(err)
    return {
      code: 500,
      message: "Internal Server Error !",
    }
  }
}
async function Reset_DataStudent({ nik } = {}) {
  try {
    if(typeof nik != 'string') {
      return {
        code: 400,
        message: "Pilih NIK siswa untuk diganti"
      }
    }
    let students = []
    const studentList = await getDocs(query(collection(db, "student_school")))
    studentList.forEach(data => {
      const stud = data.data()
      if(!ValidateOf_Student(stud, data.id)) return;
      students.push({
        id: data.id,
        nik: String(stud.nik)
      })
    })
    const i_user = students.map(a => a.nik).indexOf(nik)
    if(i_user === -1) {
      return {
        code: 404,
        message: "Siswa tidak ditemukan",
      }
    }
    const docsStudent = doc(db, "student_school", students[i_user].id)
    const dataStudent = await getDoc(docsStudent)
    if(!dataStudent.exists()) {
      return {
        code: 404,
        message: "Siswa tidak ditemukan",
      }
    }
    const dataView = dataStudent.data()
    const dataDocs = {
      name: dataView.name,
      nik: dataView.nik,
      select_candidate: "",
      token: ""
    }
    await updateDoc(docsStudent, dataDocs)
    return {
      code: 200,
      message: "Berhasil mengubah",
      data: {
        type: "editdocs",
        docs: {
          id: students[i_user].id,
          name: dataView.name,
          nik: dataView.nik,
          kelas: dataStudent.id.split("-")[0],
          absen: dataStudent.id.split("-")[1],
          select_candidate: null,
          token: null
        }
      }
    }
  } catch(err) {
    console.log(err)
    return {
      code: 500,
      message: "Internal Server Error !",
    }
  }
}
module.exports = {
  Get_Candidates,
  Get_Students,
  Get_TokenHasInvitate,
  Set_VoteingCandidate,
  Add_DataStudent,
  Remove_DataStudent,
  Reset_DataStudent,
}