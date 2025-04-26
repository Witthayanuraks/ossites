"use client"

import { SnackbarProvider } from 'notistack'

export default function App({ children }) {
  return <>
    <SnackbarProvider maxSnack={12}>
      {children}
    </SnackbarProvider>
  </>
}