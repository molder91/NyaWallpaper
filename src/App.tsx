import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import { MainLayout } from './components/layout/main-layout'
import { Home } from './pages/home'
import { Settings } from './pages/settings'

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="nyawallpaper-theme">
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/favorites" element={<div>Favorites</div>} />
            <Route path="/recent" element={<div>Recent</div>} />
            <Route path="/downloads" element={<div>Downloads</div>} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App 