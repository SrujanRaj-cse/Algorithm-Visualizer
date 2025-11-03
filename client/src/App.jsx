import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Visualizer from './pages/Visualizer';
import CodeSubmission from './pages/CodeSubmission';
import AdminVerification from './pages/AdminVerification';
import { useAuth } from './context/AuthContext';

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen bg-slate-100">
      {!hideNavbar && <Navbar />}
      <main className={hideNavbar ? '' : 'max-w-6xl mx-auto p-6'}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/visualizer" element={<Visualizer />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
          <Route path="/submit-code" element={<CodeSubmission />} />
          <Route path="/admin/verification" element={<AdminVerification />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
