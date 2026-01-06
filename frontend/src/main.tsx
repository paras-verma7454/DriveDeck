import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from './components/ui/sonner.tsx'
import { UserProvider } from './context/UserContext.tsx' // Import UserProvider


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <UserProvider> {/* Wrap App with UserProvider */}
        <App/>
      </UserProvider>
      <Toaster/>
    </ThemeProvider>
  </StrictMode>,
)
