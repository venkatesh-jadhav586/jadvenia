import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Star, Shield, Clock, ChevronLeft, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LISTINGS } from '../data';
import styles from './ListingDetail.module.css';

const DURATION_LABELS = {
  hourly: 'Hourly', daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly', yearly: 'Yearly'
};

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const listing = LISTINGS.find(l => l.id === id);
  const [duration, setDuration] = useState('monthly');
  const [qty, setQty] = useState(1);
  const [booked, setBooked] = useState(false);

  if (!listing) {
    return (
      <div className={styles.notFound}>
        <p>Listing not found.</p>
        <Link to="/search">← Back to search</Link>
      </div>
    );
  }

  const price = listing.pricing[duration];
  const platformFee = Math.round(price * qty * 0.12);
  const total = price * qty + platformFee;

  const handleBook = () => {
    if (!user) { navigate('/login'); return; }
    setBooked(true);
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  const TYPE_COLOR = {
    apartment:  '#E1F5EE',
    openPlot:   '#FAEEDA',
    commercial: '#E6F1FB',
  };

  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.container}>

        {/* Back */}
        <button className={styles.back} onClick={() => navigate(-1)}>
          <ChevronLeft size={16} /> Back to results
        </button>

        <div className={styles.grid}>
          {/* Left — listing info */}
          <div className={styles.left}>

            {/* Image */}
            <div className={styles.imgBox} style={{ background: TYPE_COLOR[listing.type] }}>
              <span className={styles.imgIcon}>
                {listing.type === 'apartment'  && '🏢'}
                {listing.type === 'openPlot'   && '🏗️'}
                {listing.type === 'commercial' && '🏪'}
              </span>
              {listing.kycVerified && (
                <span className={styles.kycBadge}><Shield size={11} /> KYC Verified</span>
              )}
            </div>

            {/* Header */}
            <div className={styles.header}>
              <div>
                <h1 className={styles.title}>{listing.title}</h1>
                <div className={styles.locRow}>
                  <MapPin size={14} color="#888780" />
                  <span>{listing.location}</span>
                </div>
                {listing.nearMetro && (
                  <div className={styles.metroRow}>
                    🚇 {listing.metroStation} — {listing.metroDistance} away
                  </div>
                )}
                {listing.nearMall && (
                  <div className={styles.metroRow}>
                    🏬 {listing.mallName} — {listing.mallDistance} away
                  </div>
                )}
              </div>
              <div className={styles.ratingBox}>
                <Star size={16} fill="#EF9F27" color="#EF9F27" />
                <span className={styles.ratingNum}>{listing.rating}</span>
                <span className={styles.ratingCount}>({listing.reviews} reviews)</span>
              </div>
            </div>

            {/* Details grid */}
            <div className={styles.detailsGrid}>
              <div className={styles.detailCard}>
                <p className={styles.detailLabel}>Vehicles accepted</p>
                <div className={styles.vehiclePills}>
                  {listing.vehicleTypes.map(v => (
                    <span key={v} className={styles.vehiclePill}>{v}</span>
                  ))}
                </div>
              </div>
              <div className={styles.detailCard}>
                <p className={styles.detailLabel}>Amenities</p>
                <div className={styles.featurePills}>
                  {listing.features.map(f => (
                    <span key={f} className={styles.featurePill}>
                      <Check size={10} /> {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing table */}
            <div className={styles.pricingTable}>
              <p className={styles.sectionTitle}>Pricing</p>
              <div className={styles.priceGrid}>
                {Object.entries(DURATION_LABELS).map(([key, label]) => (
                  <div
                    key={key}
                    className={`${styles.priceCell} ${duration === key ? styles.priceCellActive : ''}`}
                    onClick={() => setDuration(key)}
                  >
                    <p className={styles.priceCellLabel}>{label}</p>
                    <p className={styles.priceCellAmt}>₹{listing.pricing[key].toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Host */}
            <div className={styles.hostCard}>
              <div className={styles.hostAvatar}>{listing.hostAvatar}</div>
              <div className={styles.hostInfo}>
                <p className={styles.hostName}>Hosted by {listing.hostName}</p>
                <p className={styles.hostSub}>
                  {listing.kycVerified ? '✅ KYC Verified host' : '⏳ KYC in progress'}
                </p>
              </div>
              <button className={styles.contactBtn}>Contact Host</button>
            </div>

            {/* Location placeholder */}
            <div className={styles.mapPlaceholder}>
              <MapPin size={24} color="#1D9E75" />
              <p>Map view — integrate Google Maps API</p>
              <p className={styles.mapSub}>{listing.location}</p>
            </div>

          </div>

          {/* Right — booking widget */}
          <div className={styles.right}>
            <div className={styles.bookingCard}>
              {booked ? (
                <div className={styles.bookedState}>
                  <div className={styles.bookedIcon}>✅</div>
                  <p className={styles.bookedTitle}>Booking confirmed!</p>
                  <p className={styles.bookedSub}>Redirecting to your dashboard…</p>
                </div>
              ) : (
                <>
                  <p className={styles.bookingTitle}>Book this spot</p>

                  <div className={styles.bookingField}>
                    <label className={styles.bookingLabel}>Duration</label>
                    <select
                      value={duration}
                      onChange={e => setDuration(e.target.value)}
                      className={styles.bookingSelect}
                    >
                      {Object.entries(DURATION_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.bookingField}>
                    <label className={styles.bookingLabel}>No. of slots: <strong>{qty}</strong></label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={qty}
                      onChange={e => setQty(+e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div className={styles.bookingBreakdown}>
                    <div className={styles.breakdownRow}>
                      <span>₹{price.toLocaleString()} × {qty} slot{qty > 1 ? 's' : ''}</span>
                      <span>₹{(price * qty).toLocaleString()}</span>
                    </div>
                    <div className={styles.breakdownRow}>
                      <span>Platform fee (12%)</span>
                      <span>₹{platformFee.toLocaleString()}</span>
                    </div>
                    <div className={`${styles.breakdownRow} ${styles.breakdownTotal}`}>
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <button className={styles.bookBtn} onClick={handleBook}>
                    {user ? 'Book Now — Pay Securely →' : 'Sign In to Book →'}
                  </button>

                  <p className={styles.bookNote}>
                    <Shield size={11} color="#1D9E75" /> Secure payment via Razorpay · Free cancellation within 24h
                  </p>
                </>
              )}
            </div>

            {/* Similar listings */}
            <div className={styles.similarBox}>
              <p className={styles.similarTitle}>Similar spots nearby</p>
              {LISTINGS.filter(l => l.id !== listing.id && l.area === listing.area).slice(0, 2).map(l => (
                <div key={l.id} className={styles.similarCard} onClick={() => navigate(`/listing/${l.id}`)}>
                  <div className={styles.similarIcon} style={{ background: TYPE_COLOR[l.type] }}>
                    {l.type === 'apartment' && '🏢'}
                    {l.type === 'openPlot'  && '🏗️'}
                    {l.type === 'commercial' && '🏪'}
                  </div>
                  <div className={styles.similarInfo}>
                    <p className={styles.similarName}>{l.title}</p>
                    <p className={styles.similarPrice}>₹{l.pricing.monthly.toLocaleString()}/mo</p>
                  </div>
                  <span className={styles.similarRating}>★ {l.rating}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
