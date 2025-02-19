import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import PasswordChangeForm from './components/PasswordChangeForm'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {

  return (
    <>
        <PasswordChangeForm />
    </>
  )
}

export default App
