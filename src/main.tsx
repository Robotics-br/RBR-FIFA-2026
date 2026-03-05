import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

async function requestPersistentStorage() {
  if (navigator.storage?.persist) {
    const granted = await navigator.storage.persist();
    if (granted) {
      console.log('[Álbum 2026] Armazenamento persistente ativado — dados protegidos.');
    } else {
      console.log('[Álbum 2026] Armazenamento persistente não concedido pelo navegador.');
    }
  }
}

requestPersistentStorage();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
