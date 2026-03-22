import React from 'react';
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

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Onboarding */}
        <Route path="/onboarding" element={<OnboardingFlow />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<Navigate to="/dashboard/overview" replace />} />
        <Route path="/dashboard/overview" element={<DashboardLayout><DashboardOverview /></DashboardLayout>} />
        <Route path="/dashboard/website" element={<DashboardLayout><WebsiteCustomizer /></DashboardLayout>} />
        <Route path="/dashboard/services" element={<DashboardLayout><ServicesList /></DashboardLayout>} />
        <Route path="/dashboard/availability" element={<DashboardLayout><AvailabilityPage /></DashboardLayout>} />
        <Route path="/dashboard/bookings" element={<DashboardLayout><BookingsPage /></DashboardLayout>} />
        <Route path="/dashboard/analytics" element={<DashboardLayout><AnalyticsPage /></DashboardLayout>} />
        <Route path="/dashboard/settings" element={<DashboardLayout><SettingsPage /></DashboardLayout>} />
        
        {/* Public Site (Direct View) */}
        <Route path="/p/:businessId" element={<PublicLayout><PublicWebsite /></PublicLayout>} />
        
        {/* Redirects */}
        <Route path="/" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
