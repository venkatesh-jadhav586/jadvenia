import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <p className={styles.logo}>Jadve<span>nia</span></p>
          <p className={styles.tagline}>Bengaluru's peer-to-peer parking network.<br />Park smart. Earn effortlessly.</p>
        </div>

        <div className={styles.col}>
          <p className={styles.colTitle}>For Seekers</p>
          <Link to="/search" className={styles.colLink}>Find Parking</Link>
          <Link to="/search?filter=metro" className={styles.colLink}>Near Metro</Link>
          <Link to="/search?filter=mall" className={styles.colLink}>Near Malls</Link>
          <Link to="/how-it-works" className={styles.colLink}>How It Works</Link>
        </div>

        <div className={styles.col}>
          <p className={styles.colTitle}>For Hosts</p>
          <Link to="/list-spot" className={styles.colLink}>List Your Spot</Link>
          <Link to="/kyc" className={styles.colLink}>KYC Verification</Link>
          <Link to="/host-dashboard" className={styles.colLink}>Host Dashboard</Link>
          <Link to="/pricing" className={styles.colLink}>Pricing & Fees</Link>
        </div>

        <div className={styles.col}>
          <p className={styles.colTitle}>Company</p>
          <Link to="/about" className={styles.colLink}>About Us</Link>
          <Link to="/contact" className={styles.colLink}>Contact</Link>
          <Link to="/privacy" className={styles.colLink}>Privacy Policy</Link>
          <Link to="/terms" className={styles.colLink}>Terms of Service</Link>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© 2025 Jadvenia Technologies Pvt. Ltd. All rights reserved.</p>
        <p>Made with ♥ for Bengaluru</p>
      </div>
    </footer>
  );
}
