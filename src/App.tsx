
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignUp } from './features/auth/SignUp';
import { Login } from './features/auth/Login';
import { ForgotPassword } from './features/auth/ForgotPassword';
import { OnboardingFlow } from './features/onboarding/OnboardingFlow';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { WebsiteCustomizer } from './features/dashboard/WebsiteCustomizer';
import { ServicesList } from './features/dashboard/ServicesList';
import { AvailabilityPage } from './features/dashboard/AvailabilityPage';
import { BookingsPage } from './features/dashboard/BookingsPage';
import { AnalyticsPage } from './features/dashboard/AnalyticsPage';
import { DashboardOverview } from './features/dashboard/DashboardOverview';
import { SettingsPage } from './features/dashboard/SettingsPage';
import { PublicWebsite } from './features/public/PublicWebsite';
import { PublicLayout } from './components/layout/PublicLayout';
import { AuthObserver } from './components/auth/AuthObserver';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LandingPage } from './features/landing/LandingPage';

function App() {
  return (
    <Router>
      <AuthObserver>
        <Routes>
          {/* Auth Routes */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Onboarding */}
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <OnboardingFlow />
            </ProtectedRoute>
          } />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<Navigate to="/dashboard/overview" replace />} />
          
          <Route path="/dashboard/overview" element={
            <ProtectedRoute>
              <DashboardLayout><DashboardOverview /></DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/website" element={
            <ProtectedRoute>
              <DashboardLayout><WebsiteCustomizer /></DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/services" element={
            <ProtectedRoute>
              <DashboardLayout><ServicesList /></DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/availability" element={
            <ProtectedRoute>
              <DashboardLayout><AvailabilityPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/bookings" element={
            <ProtectedRoute>
              <DashboardLayout><BookingsPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/analytics" element={
            <ProtectedRoute>
              <DashboardLayout><AnalyticsPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/settings" element={
            <ProtectedRoute>
              <DashboardLayout><SettingsPage /></DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Public Site (Direct View) */}
          <Route path="/p/:subdomain" element={<PublicLayout><PublicWebsite /></PublicLayout>} />
          
          {/* Redirects */}
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </AuthObserver>
    </Router>
  );
}

export default App;
