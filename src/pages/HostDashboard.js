import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Star, ChevronRight, Plus } from 'lucide-react';
import styles from './HostDashboard.module.css';

const MOCK_LISTINGS = [
  { id: 'l_001', title: 'Indiranagar Apt Spot', area: 'Indiranagar', status: 'active', bookings: 18, rating: 4.8, monthlyEarning: 3080, type: 'apartment' },
  { id: 'l_004', title: 'HSR Layout Bike Spot', area: 'HSR Layout', status: 'active', bookings: 9, rating: 4.7, monthlyEarning: 704, type: 'apartment' },
];

const MOCK_PAYOUTS = [
  { id: 'p_001', date: '2025-01-13', amount: 3080, status: 'paid', listing: 'Indiranagar Apt Spot' },
  { id: 'p_002', date: '2025-01-06', amount: 704,  status: 'paid', listing: 'HSR Layout Bike Spot' },
  { id: 'p_003', date: '2024-12-30', amount: 3080, status: 'paid', listing: 'Indiranagar Apt Spot' },
];

export default function HostDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('listings');

  if (!user) {
    return (
      <div className={styles.authWall}>
        <p>Please <Link to="/login" className={styles.authLink}>sign in</Link> to access your host dashboard.</p>
      </div>
    );
  }

  const totalMonthly = MOCK_LISTINGS.reduce((s, l) => s + l.monthlyEarning, 0);
  const totalBookings = MOCK_LISTINGS.reduce((s, l) => s + l.bookings, 0);

  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.container}>

        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Host Dashboard</h1>
            <p className={styles.pageSub}>Manage your listings and track earnings</p>
          </div>
          <button className={styles.addBtn} onClick={() => navigate('/list-spot')}>
            <Plus size={15} /> Add Listing
          </button>
        </div>

        {/* Summary */}
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <TrendingUp size={20} color="#1D9E75" />
            <p className={styles.summaryNum}>₹{totalMonthly.toLocaleString()}</p>
            <p className={styles.summaryLabel}>This month's earnings</p>
          </div>
          <div className={styles.summaryCard}>
            <p className={styles.summaryNum}>{MOCK_LISTINGS.length}</p>
            <p className={styles.summaryLabel}>Active listings</p>
          </div>
          <div className={styles.summaryCard}>
            <p className={styles.summaryNum}>{totalBookings}</p>
            <p className={styles.summaryLabel}>Total bookings</p>
          </div>
          <div className={styles.summaryCard}>
            <Star size={16} fill="#EF9F27" color="#EF9F27" style={{ display: 'inline' }} />
            <p className={styles.summaryNum}>4.75</p>
            <p className={styles.summaryLabel}>Avg rating</p>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {[['listings', 'My Listings'], ['payouts', 'Payouts']].map(([v, l]) => (
            <button key={v} className={`${styles.tab} ${tab === v ? styles.tabActive : ''}`} onClick={() => setTab(v)}>{l}</button>
          ))}
        </div>

        {tab === 'listings' && (
          <div className={styles.listingsList}>
            {MOCK_LISTINGS.map(l => (
              <div key={l.id} className={styles.listingRow}>
                <div className={styles.listingIcon} style={{ background: '#E1F5EE' }}>🏢</div>
                <div className={styles.listingInfo}>
                  <p className={styles.listingTitle}>{l.title}</p>
                  <p className={styles.listingArea}>{l.area} · {l.bookings} bookings</p>
                </div>
                <div className={styles.listingStats}>
                  <p className={styles.listingEarning}>₹{l.monthlyEarning.toLocaleString()}/mo</p>
                  <p className={styles.listingRating}>★ {l.rating}</p>
                </div>
                <span className={styles.statusBadge}>{l.status}</span>
                <button className={styles.editBtn} onClick={() => navigate(`/listing/${l.id}`)}>
                  <ChevronRight size={14} />
                </button>
              </div>
            ))}
            <div className={styles.addCard} onClick={() => navigate('/list-spot')}>
              <Plus size={20} color="#888780" />
              <p className={styles.addCardText}>List another spot</p>
            </div>
          </div>
        )}

        {tab === 'payouts' && (
          <div className={styles.payoutList}>
            <div className={styles.payoutSummary}>
              <div className={styles.payoutStat}>
                <p className={styles.payoutStatNum}>₹{MOCK_PAYOUTS.reduce((s, p) => s + p.amount, 0).toLocaleString()}</p>
                <p className={styles.payoutStatLabel}>Total received</p>
              </div>
              <div className={styles.payoutStat}>
                <p className={styles.payoutStatNum}>₹{MOCK_PAYOUTS[0].amount.toLocaleString()}</p>
                <p className={styles.payoutStatLabel}>Last payout</p>
              </div>
              <button className={styles.withdrawBtn}>Request Withdrawal</button>
            </div>
            {MOCK_PAYOUTS.map(p => (
              <div key={p.id} className={styles.payoutRow}>
                <div className={styles.payoutIcon}>💳</div>
                <div className={styles.payoutInfo}>
                  <p className={styles.payoutTitle}>{p.listing}</p>
                  <p className={styles.payoutDate}>{p.date}</p>
                </div>
                <div className={styles.payoutRight}>
                  <p className={styles.payoutAmt}>₹{p.amount.toLocaleString()}</p>
                  <span className={styles.payoutStatus}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
