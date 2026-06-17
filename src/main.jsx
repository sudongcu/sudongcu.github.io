import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ClipRefine from './pages/privacy/ClipRefine.jsx'
import ScreenTimer from './pages/privacy/ScreenTimer.jsx'
import ClipRefineTerms from './pages/terms/ClipRefine.jsx'
import Lab from './pages/lab/index.jsx'
import PhoneFrame from './pages/lab/PhoneFrame.jsx'
import GeminiWatermarkRemover from './pages/lab/GeminiWatermarkRemover.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/privacy/cliprefine" element={<ClipRefine />} />
        <Route path="/privacy/screentimer" element={<ScreenTimer />} />
        <Route path="/terms/cliprefine" element={<ClipRefineTerms />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/lab/phoneframe" element={<PhoneFrame />} />
        <Route path="/lab/gemini-watermark-remover" element={<GeminiWatermarkRemover />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
