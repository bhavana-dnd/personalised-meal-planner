import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import LogMealPage from './pages/LogMealPage'
import FoodsPage from './pages/FoodsPage'
import HistoryPage from './pages/HistoryPage'
import ProgressPage from './pages/ProgressPage'
import ProfilePage from './pages/ProfilePage'
import RecommendationsPage from './pages/RecommendationsPage'
import ScanPage from './pages/ScanPage'
import PoshanPage from './pages/PoshanPage'
import PatternsPage from './pages/PatternsPage'

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#FAF7F0',
              color: '#353B33',
              border: '1px solid #EBE4D5',
              borderRadius: '1rem',
              boxShadow: '0 8px 24px -4px rgba(149, 171, 135, 0.2)',
              fontSize: '0.875rem',
              fontWeight: 600,
            },
            success: {
              iconTheme: {
                primary: '#95AB87',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#E8A590',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="log-meal" element={<LogMealPage />} />
            <Route path="foods" element={<FoodsPage />} />
            <Route path="recommendations" element={<RecommendationsPage />} />
            <Route path="scan" element={<ScanPage />} />
            <Route path="poshan" element={<PoshanPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="patterns" element={<PatternsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
