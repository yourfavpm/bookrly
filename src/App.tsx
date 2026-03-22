
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
import { TemplateSelector } from './features/dashboard/TemplateSelector';
import { PortfolioPage } from './features/dashboard/PortfolioPage';
import { TestimonialsPage } from './features/dashboard/TestimonialsPage';
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
          
          {/* Dashboard Routes - Nested to prevent Layout remounting */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<DashboardOverview />} />
            <Route path="website" element={<WebsiteCustomizer />} />
            <Route path="templates" element={<TemplateSelector />} />
            <Route path="services" element={<ServicesList />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="testimonials" element={<TestimonialsPage />} />
            <Route path="availability" element={<AvailabilityPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          
          {/* Public Site (Direct View) */}
          <Route path="/p/:subdomain" element={<PublicLayout><PublicWebsite /></PublicLayout>} />
          
          {/* Dashboard Preview (Local State) */}
          <Route path="/preview" element={
            <ProtectedRoute>
              <PublicLayout><PublicWebsite isPreview={true} /></PublicLayout>
            </ProtectedRoute>
          } />
          
          {/* Redirects */}
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </AuthObserver>
    </Router>
  );
}

export default App;
