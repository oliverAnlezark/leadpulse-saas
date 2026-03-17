import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LeadsPage from './pages/LeadsPage';
import SequencesPage from './pages/SequencesPage';
import SettingsPage from './pages/SettingsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import BillingPage from './pages/BillingPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';

function App() {
  const { token, getProfile } = useAuthStore();

  useEffect(() => {
    if (token) {
      getProfile();
    }
  }, [token]);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <DashboardPage />
                </div>
              </div>
            }
          />
          <Route
            path="/leads"
            element={
              <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <LeadsPage />
                </div>
              </div>
            }
          />
          <Route
            path="/sequences"
            element={
              <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <SequencesPage />
                </div>
              </div>
            }
          />
          <Route
            path="/analytics"
            element={
              <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <AnalyticsPage />
                </div>
              </div>
            }
          />
          <Route
            path="/billing"
            element={
              <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <BillingPage />
                </div>
              </div>
            }
          />
          <Route
            path="/settings"
            element={
              <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <SettingsPage />
                </div>
              </div>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
