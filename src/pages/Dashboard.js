import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, Clock, Shield, ChevronRight } from 'lucide-react';
import styles from './Dashboard.module.css';

const MOCK_BOOKINGS = [
  { id: 'b_001', listingId: 'l_001', title: 'Indiranagar Apt Spot', location: '12th Main, Indiranagar', status: 'active', duration: 'monthly', price: 3500, startDate: '2025-01-01', endDate: '2025-01-31', vehicle: '4-Wheeler', type: 'apartment' },
  { id: 'b_002', listingId: 'l_004', title: 'HSR Layout Bike Spot', location: 'Sector 2, HSR Layout', status: 'upcoming', duration: 'weekly', price: 350, startDate: '2025-01-20', endDate: '2025-01-27', vehicle: '2-Wheeler', type: 'apartment' },
  { id: 'b_003', listingId: 'l_002', title: 'Whitefield Metro Plot', location: 'ITPL Road, Whitefield', status: 'completed', duration: 'monthly', price: 1800, startDate: '2024-12-01', endDate: '2024-12-31', vehicle: '4-Wheeler', type: 'openPlot' },
];

const STATUS_STYLES = {
  active:    { bg: '#E1F5EE', color: '#0F6E56', label: 'Active' },
  upcoming:  { bg: '#FAEEDA', color: '#854F0B', label: 'Upcoming' },
  completed: { bg: '#F1EFE8', color: '#5F5E5A', label: 'Completed' },
  cancelled: { bg: '#FCEBEB', color: '#A32D2D', label: 'Cancelled' },
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');

  if (!user) {
    return (
      <div className={styles.authWall}>
        <p>Please <Link to="/login" className={styles.authLink}>sign in</Link> to view your dashboard.</p>
      </div>
    );
  }

  const filtered = tab === 'all' ? MOCK_BOOKINGS : MOCK_BOOKINGS.filter(b => b.status === tab);

  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>My Bookings</h1>
            <p className={styles.pageSub}>Welcome back, {user.name.split(' ')[0]}</p>
          </div>
          <div className={styles.headerActions}>
            <div className={`${styles.kycStatus} ${user.kycStatus === 'verified' ? styles.kycVerified : styles.kycPending}`}>
              <Shield size={13} />
              KYC {user.kycStatus === 'verified' ? 'Verified' : 'Pending'}
            </div>
            <button className={styles.findBtn} onClick={() => navigate('/search')}>Find Parking →</button>
          </div>
        </div>

        {/* Summary cards */}
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <p className={styles.summaryNum}>{MOCK_BOOKINGS.filter(b => b.status === 'active').length}</p>
            <p className={styles.summaryLabel}>Active bookings</p>
          </div>
          <div className={styles.summaryCard}>
            <p className={styles.summaryNum}>₹{MOCK_BOOKINGS.reduce((s, b) => s + b.price, 0).toLocaleString()}</p>
            <p className={styles.summaryLabel}>Total spent</p>
          </div>
          <div className={styles.summaryCard}>
            <p className={styles.summaryNum}>{MOCK_BOOKINGS.length}</p>
            <p className={styles.summaryLabel}>Total bookings</p>
          </div>
          <div className={styles.summaryCard}>
            <p className={styles.summaryNum}>4.8★</p>
            <p className={styles.summaryLabel}>Your avg rating</p>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {[['all', 'All'], ['active', 'Active'], ['upcoming', 'Upcoming'], ['completed', 'Completed']].map(([v, l]) => (
            <button key={v} className={`${styles.tab} ${tab === v ? styles.tabActive : ''}`} onClick={() => setTab(v)}>{l}</button>
          ))}
        </div>

        {/* Bookings list */}
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <p>No bookings found.</p>
            <button className={styles.findBtn} onClick={() => navigate('/search')}>Find a spot →</button>
          </div>
        ) : (
          <div className={styles.bookingList}>
            {filtered.map(b => {
              const ss = STATUS_STYLES[b.status];
              return (
                <div key={b.id} className={styles.bookingCard}>
                  <div className={styles.bookingIcon} style={{ background: b.type === 'openPlot' ? '#FAEEDA' : '#E1F5EE' }}>
                    {b.type === 'apartment' && '🏢'}
                    {b.type === 'openPlot'  && '🏗️'}
                    {b.type === 'commercial' && '🏪'}
                  </div>
                  <div className={styles.bookingInfo}>
                    <div className={styles.bookingTop}>
                      <p className={styles.bookingTitle}>{b.title}</p>
                      <span className={styles.bookingStatus} style={{ background: ss.bg, color: ss.color }}>{ss.label}</span>
                    </div>
                    <div className={styles.bookingMeta}>
                      <span><MapPin size={11} /> {b.location}</span>
                      <span><Clock size={11} /> {b.startDate} → {b.endDate}</span>
                      <span>🚗 {b.vehicle}</span>
                    </div>
                  </div>
                  <div className={styles.bookingRight}>
                    <p className={styles.bookingPrice}>₹{b.price.toLocaleString()}</p>
                    <p className={styles.bookingDuration}>/{b.duration}</p>
                    <button className={styles.viewBtn} onClick={() => navigate(`/listing/${b.listingId}`)}>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick links */}
        <div className={styles.quickLinks}>
          <Link to="/host-dashboard" className={styles.quickCard}>
            <span className={styles.quickIcon}>🏠</span>
            <div>
              <p className={styles.quickTitle}>Host Dashboard</p>
              <p className={styles.quickSub}>Manage your listings & earnings</p>
            </div>
            <ChevronRight size={16} color="#888780" />
          </Link>
          <Link to="/wallet" className={styles.quickCard}>
            <span className={styles.quickIcon}>💳</span>
            <div>
              <p className={styles.quickTitle}>Wallet & Payouts</p>
              <p className={styles.quickSub}>View transactions & withdraw</p>
            </div>
            <ChevronRight size={16} color="#888780" />
          </Link>
          <Link to="/kyc" className={styles.quickCard}>
            <span className={styles.quickIcon}>🪪</span>
            <div>
              <p className={styles.quickTitle}>KYC Verification</p>
              <p className={styles.quickSub}>{user.kycStatus === 'verified' ? 'Fully verified ✅' : 'Complete to list spots'}</p>
            </div>
            <ChevronRight size={16} color="#888780" />
          </Link>
        </div>
      </div>
    </div>
  );
}
