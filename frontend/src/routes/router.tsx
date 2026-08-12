
import { LoginPage } from '../pages/Auth/LoginPage';
import { LoginSuccess } from '../pages/Auth/LoginSuccess';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { ResetPassword } from '../pages/Auth/ForgotPassword';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MonacoEditorPage } from '../pages/codeEditor/MonacoEditorPage';
import { SubmissionResultPage } from '../pages/codeEditor/SubmissionResultPage';
import { ChangePassword } from '../pages/Auth/ChangePassword';
import { SignUp } from '../pages/Auth/SignUp';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path="/login-success" element={<LoginSuccess />} />
        <Route path='/changePassword' element = { <ProtectedRoute><ChangePassword/></ProtectedRoute>}/>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor"
          element={
            <ProtectedRoute>
              <MonacoEditorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submissions/:id"
          element={
            <ProtectedRoute>
              <SubmissionResultPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router