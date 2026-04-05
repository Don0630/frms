import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext.jsx"
import { UserProvider } from "./context/UserContext.jsx"
import { StaffProvider } from "./context/StaffContext.jsx"
import { ProgramProvider } from "./context/ProgramContext.jsx"
import { FarmerProvider } from "./context/FarmerContext.jsx"
import { CropProvider } from "./context/CropContext.jsx"
import { LivestockProvider } from "./context/LivestockContext.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <UserProvider>
        <StaffProvider>
          <ProgramProvider>
            <FarmerProvider>
              <CropProvider>
                <LivestockProvider>
        <App />
                </LivestockProvider>
              </CropProvider>
            </FarmerProvider>
          </ProgramProvider>
        </StaffProvider>
      </UserProvider>
    </AuthProvider>
  </StrictMode>,
)
