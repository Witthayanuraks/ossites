import Link from "next/link"

export default function HomePages() {
  return <div style={{width:"100%",height:"90vh",display:"flex",justifyContent:"center",alignItems:"center"}}>
    <div>
      <h3>INFORMASI !</h3>
      <p>Buka tab atau tautan pada testing</p>
      <Link href='/testing/siswa'>Buka Halaman Testing</Link>
    </div>
  </div>
}
