import "~/app/globals.css"
import AppRoot from "./App"

export const metadata = {
  title: "E.Pemilos",
  description: "Pemilihan Ketua Osis Menggunakan Sistem Elektronik",
}

export default function RootLayout({ children }) {
  return <html lang="id">
    <body>
      <AppRoot>
        {children}
      </AppRoot>
    </body>
  </html>
}
