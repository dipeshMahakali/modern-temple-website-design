import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.tsx'
import { AuthProvider } from './admin/store/AuthContext.tsx'
import { LanguageProvider } from './context/LanguageContext.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <LanguageProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              border: '1px solid rgba(212,175,55,0.2)',
              color: '#2D2D2D',
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            },
            success: {
              iconTheme: { primary: '#D4AF37', secondary: '#FFFFFF' },
            },
            error: {
              iconTheme: { primary: '#6B1E1E', secondary: '#FFFFFF' },
            },
          }}
        />
      </LanguageProvider>
    </AuthProvider>
  </BrowserRouter>,
)
