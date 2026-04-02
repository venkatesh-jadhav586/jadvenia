import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, MapPin } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const navLinks = [
    { label: 'Find Parking', to: '/search' },
    { label: 'List Your Spot', to: '/list-spot' },
    { label: 'Near Metro', to: '/search?filter=metro' },
    { label: 'Near Malls', to: '/search?filter=mall' },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          Jadve<span>nia</span>
        </Link>

        <div className={styles.links}>
          {navLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`${styles.link} ${location.pathname === l.to.split('?')[0] ? styles.active : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className={styles.actions}>
          {user ? (
            <div className={styles.userMenu}>
              <button
                className={styles.avatar}
                onClick={() => setDropOpen(o => !o)}
              >
                {user.avatar}
              </button>
              {dropOpen && (
                <div className={styles.drop}>
                  <div className={styles.dropHeader}>
                    <p className={styles.dropName}>{user.name}</p>
                    <p className={styles.dropEmail}>{user.email}</p>
                  </div>
                  <Link to="/dashboard" className={styles.dropItem} onClick={() => setDropOpen(false)}>My Bookings</Link>
                  <Link to="/host-dashboard" className={styles.dropItem} onClick={() => setDropOpen(false)}>Host Dashboard</Link>
                  <Link to="/wallet" className={styles.dropItem} onClick={() => setDropOpen(false)}>Wallet</Link>
                  <Link to="/kyc" className={styles.dropItem} onClick={() => setDropOpen(false)}>
                    KYC Status
                    {user.kycStatus === 'pending' && <span className={styles.kycBadge}>Pending</span>}
                    {user.kycStatus === 'verified' && <span className={styles.kycBadgeOk}>Verified</span>}
                  </Link>
                  <Link to="/profile" className={styles.dropItem} onClick={() => setDropOpen(false)}>Profile</Link>
                  <button
                    className={styles.dropLogout}
                    onClick={() => { logout(); setDropOpen(false); navigate('/'); }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className={styles.loginBtn}>Sign in</Link>
              <Link to="/signup" className={styles.signupBtn}>Get Started</Link>
            </>
          )}

          <button className={styles.burger} onClick={() => setOpen(o => !o)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className={styles.mobile}>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} className={styles.mobileLink} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          {!user && (
            <>
              <Link to="/login" className={styles.mobileLink} onClick={() => setOpen(false)}>Sign in</Link>
              <Link to="/signup" className={styles.mobileLinkPrimary} onClick={() => setOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
