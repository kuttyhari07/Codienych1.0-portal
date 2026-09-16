import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EventPortalPage from './pages/EventPortalPage';
import RegisterPage from './pages/RegisterPage';
import StatusPage from './pages/StatusPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminRegistrationsPage from './pages/admin/AdminRegistrationsPage';
import AdminTeamDetailPage from './pages/admin/AdminTeamDetailPage';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminParticipantsPage from './pages/admin/AdminParticipantsPage';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
      </Routes>
    </Router>
  );
}

export default App;
