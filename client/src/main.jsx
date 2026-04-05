import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext.jsx"
import { UserProvider } from "./context/UserContext.jsx"
import { StaffProvider } from "./context/StaffContext.jsx"
import { FarmerProvider } from "./context/FarmerContext.jsx"


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <UserProvider>
        <StaffProvider>
          <FarmerProvider>
        <App />
          </FarmerProvider>
        </StaffProvider>
      </UserProvider>
    </AuthProvider>
  </StrictMode>,
)
