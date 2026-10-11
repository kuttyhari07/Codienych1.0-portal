import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BgmProvider } from './context/BgmContext';

// Dynamic code-split lazy routes for ultra-fast initial page loads
const HomePage = lazy(() => import('./pages/HomePage'));
const EventPortalPage = lazy(() => import('./pages/EventPortalPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const StatusPage = lazy(() => import('./pages/StatusPage'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminRegistrationsPage = lazy(() => import('./pages/admin/AdminRegistrationsPage'));
const AdminTeamDetailPage = lazy(() => import('./pages/admin/AdminTeamDetailPage'));
const AdminPaymentsPage = lazy(() => import('./pages/admin/AdminPaymentsPage'));
const AdminParticipantsPage = lazy(() => import('./pages/admin/AdminParticipantsPage'));
const AdminReviewsPage = lazy(() => import('./pages/admin/AdminReviewsPage'));

// Sleek lightweight loading fallback
const PageLoader = () => (
  <div className="min-h-screen bg-[#020508] flex flex-col items-center justify-center text-[#ffd700] select-none">
    <div className="relative w-14 h-14 flex items-center justify-center mb-4">
      <div className="absolute inset-0 border-2 border-[#ffd700]/30 rounded-full animate-ping" />
      <div className="w-10 h-10 border-2 border-t-[#ffd700] border-r-[#ffd700] border-b-transparent border-l-transparent rounded-full animate-spin" />
    </div>
    <span className="font-cinzel text-xs tracking-widest uppercase font-bold text-gray-300">
      PREPARING THE FLEET...
    </span>
  </div>
);

function App() {
  return (
    <BgmProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/portal" element={<EventPortalPage />} />
            <Route path="/event" element={<EventPortalPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/registrations" element={<AdminRegistrationsPage />} />
            <Route path="/admin/registrations/:id" element={<AdminTeamDetailPage />} />
            <Route path="/admin/payments" element={<AdminPaymentsPage />} />
            <Route path="/admin/participants" element={<AdminParticipantsPage />} />
            <Route path="/admin/reviews" element={<AdminReviewsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </BgmProvider>
  );
}

export default App;
