import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage from '../pages/DashboardPage'
import PortfolioPage from '../pages/PortfolioPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}
