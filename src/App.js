import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home          from './pages/Home';
import Login         from './pages/Login';
import Signup        from './pages/Signup';
import SearchPage    from './pages/SearchPage';
import ListingDetail from './pages/ListingDetail';
import KYC           from './pages/KYC';
import Dashboard     from './pages/Dashboard';
import HostDashboard from './pages/HostDashboard';
import ListSpot      from './pages/ListSpot';

// Minimal placeholder for routes not yet built
function Placeholder({ title }) {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 1.5rem', minHeight: '60vh' }}>
      <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚧</p>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: '#1a1a18', marginBottom: '0.5rem' }}>{title}</h2>
      <p style={{ color: '#888780', fontSize: '0.875rem' }}>This page is coming soon.</p>
    </div>
  );
}

// Layout wrapper — pages that use full-width auth layout skip Navbar/Footer
function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function AuthLayout({ children }) {
  return <main>{children}</main>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth pages — no navbar/footer */}
          <Route path="/login"  element={<AuthLayout><Login /></AuthLayout>} />
          <Route path="/signup" element={<AuthLayout><Signup /></AuthLayout>} />

          {/* Main app pages */}
          <Route path="/" element={<AppLayout><Home /></AppLayout>} />
          <Route path="/search" element={<AppLayout><SearchPage /></AppLayout>} />
          <Route path="/listing/:id" element={<AppLayout><ListingDetail /></AppLayout>} />
          <Route path="/kyc" element={<AppLayout><KYC /></AppLayout>} />
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/host-dashboard" element={<AppLayout><HostDashboard /></AppLayout>} />
          <Route path="/list-spot" element={<AppLayout><ListSpot /></AppLayout>} />

          {/* Placeholder routes */}
          <Route path="/wallet"      element={<AppLayout><Placeholder title="Wallet & Payouts" /></AppLayout>} />
          <Route path="/profile"     element={<AppLayout><Placeholder title="Profile Settings" /></AppLayout>} />
          <Route path="/how-it-works" element={<AppLayout><Placeholder title="How It Works" /></AppLayout>} />
          <Route path="/about"       element={<AppLayout><Placeholder title="About Us" /></AppLayout>} />
          <Route path="/contact"     element={<AppLayout><Placeholder title="Contact Us" /></AppLayout>} />
          <Route path="/privacy"     element={<AppLayout><Placeholder title="Privacy Policy" /></AppLayout>} />
          <Route path="/terms"       element={<AppLayout><Placeholder title="Terms of Service" /></AppLayout>} />
          <Route path="/pricing"     element={<AppLayout><Placeholder title="Pricing & Fees" /></AppLayout>} />

          {/* 404 */}
          <Route path="*" element={<AppLayout><Placeholder title="Page Not Found" /></AppLayout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
