import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {registerSW} from 'virtual:pwa-register'

registerSW({
    immediate: true,
    onNeedRefresh() {
        if (confirm("Nouvelle version disponible. Recharger ?")) {
            window.location.reload()
        }
    },
    onOfflineReady() {
        console.log("PWA prête pour le mode hors ligne ✅")
    }
})

if (!navigator.onLine) {
    console.log('Démarrage en mode hors ligne')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
