import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth }                 from '@/contexts/AuthContext';
import LandingPage                 from '@/pages/LandingPage';
import LoginPage                   from '@/pages/LoginPage';
import SignUpPage                  from '@/pages/SignUpPage';
import ForgotPasswordPage          from '@/pages/ForgotPasswordPage';
import DashboardPage               from '@/pages/DashboardPage';

function Protected({ children }) {
  const { user, loading } = useAuth();
  // you might show a spinner here if loading is true
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/"                element={<LandingPage />} />
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/signup"          element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route
        path="/dashboard"
        element={
          <Protected>
            <DashboardPage />
          </Protected>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
