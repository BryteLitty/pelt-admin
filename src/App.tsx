import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './core/store'
import { ThemeProvider } from './core/context/theme-context'
import { ErrorBoundary } from './core/components/ErrorBoundary'
import { ToastProvider } from './core/components/ui'
import { ProtectedRoute } from './core/components/ProtectedRoute'
import { AuthInitializer } from './core/components/AuthInitializer'
import { Login, ForgotPassword, ResetPassword, VerifyOTP } from './features/auth'
import { Dashboard, Settings, KYCVerification } from './features/dashboard'
import { TeamManagement } from './features/teams'



function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ToastProvider>
          <ErrorBoundary>
            <AuthInitializer>
              <Router>
                <div className="min-h-screen bg-background text-foreground">
                <Routes>
                {/* Auth routes - no nav/footer */}
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                
              {/* Protected dashboard routes - with sidebar */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/users" element={
                <ProtectedRoute>
                  <TeamManagement />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/kyc" element={
                <ProtectedRoute>
                  <KYCVerification />
                </ProtectedRoute>
              } />
                
                {/* Main app routes - with nav/footer */}
                <Route path="/" element={
                  <>
                   <Login />
                  </>
                } />
                
                {/* Redirect unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                </div>
              </Router>
            </AuthInitializer>
          </ErrorBoundary>
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default App
