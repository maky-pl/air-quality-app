import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import 'leaflet/dist/leaflet.css';
import './index.css';  // Tailwind CSS if you're using it
import 'tailwindcss/tailwind.css'; // Ensure Tailwind is imported


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
