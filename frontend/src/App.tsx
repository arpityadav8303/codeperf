import './App.css'
import { SignUp } from './pages/Auth/SignUp';
import { LoginPage } from './pages/Auth/LoginPage';
import { LoginSuccess } from './pages/Auth/LoginSuccess';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ResetPassword } from './pages/Auth/ForgotPassword';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/ResetPassword" element={<ResetPassword/>}/>
        <Route path="/login-success" element={<LoginSuccess />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App