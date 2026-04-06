import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext.jsx"
import { UserProvider } from "./context/UserContext.jsx"
import { StaffProvider } from "./context/StaffContext.jsx"
import { ProgramProvider } from "./context/ProgramContext.jsx"
import { SubsidyProvider } from "./context/SubsidyContext.jsx"
import { FarmerProvider } from "./context/FarmerContext.jsx"
import { CropProvider } from "./context/CropContext.jsx"
import { LivestockProvider } from "./context/LivestockContext.jsx"
import { MonitoringProvider } from "./context/MonitoringContext.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <UserProvider>
        <StaffProvider>
          <ProgramProvider>
            <SubsidyProvider>
              <FarmerProvider>
                <CropProvider>
                  <LivestockProvider>
                    <MonitoringProvider>
        <App />
                    </MonitoringProvider>
                  </LivestockProvider>
                </CropProvider>
              </FarmerProvider>
            </SubsidyProvider>
          </ProgramProvider>
        </StaffProvider>
      </UserProvider>
    </AuthProvider>
  </StrictMode>,
)
