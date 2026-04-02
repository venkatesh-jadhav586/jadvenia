import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Shield, Clock } from 'lucide-react';
import styles from './ListingCard.module.css';

const TYPE_COLORS = {
  apartment:  { bg: '#E1F5EE', label: 'Apt Slot',    text: '#0F6E56' },
  openPlot:   { bg: '#FAEEDA', label: 'Open Plot',   text: '#854F0B' },
  commercial: { bg: '#E6F1FB', label: 'Commercial',  text: '#185FA5' },
};

const VEHICLE_ICONS = {
  '2-wheeler': '🛵',
  '4-wheeler': '🚗',
  'suv': '🚙',
};

export default function ListingCard({ listing, featured = false }) {
  const navigate = useNavigate();
  const typeInfo = TYPE_COLORS[listing.type] || TYPE_COLORS.apartment;

  return (
    <div
      className={`${styles.card} ${featured ? styles.featured : ''}`}
      onClick={() => navigate(`/listing/${listing.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/listing/${listing.id}`)}
    >
      {/* Image area */}
      <div className={styles.imgArea} style={{ background: typeInfo.bg }}>
        <span className={styles.imgIcon}>
          {listing.type === 'apartment'  && '🏢'}
          {listing.type === 'openPlot'   && '🏗️'}
          {listing.type === 'commercial' && '🏪'}
        </span>

        <span className={styles.typeBadge} style={{ background: typeInfo.bg, color: typeInfo.text }}>
          {typeInfo.label}
        </span>

        {listing.kycVerified && (
          <span className={styles.kycBadge}>
            <Shield size={9} /> KYC ✓
          </span>
        )}

        {listing.nearMetro && listing.metroDistance && (
          <span className={styles.distBadge}>
            🚇 {listing.metroDistance}
          </span>
        )}
        {listing.nearMall && listing.mallDistance && (
          <span className={styles.distBadge}>
            🏬 {listing.mallDistance}
          </span>
        )}
      </div>

      {/* Body */}
      <div className={styles.body}>
        <p className={styles.title}>{listing.title}</p>

        <div className={styles.loc}>
          <MapPin size={11} color="#888780" />
          <span>{listing.location}</span>
        </div>

        {/* Vehicle types */}
        <div className={styles.vehicles}>
          {listing.vehicleTypes.map(v => (
            <span key={v} className={styles.vehicleChip}>
              {VEHICLE_ICONS[v]} {v}
            </span>
          ))}
        </div>

        {/* Features */}
        <div className={styles.features}>
          {listing.features.slice(0, 3).map(f => (
            <span key={f} className={styles.featureChip}>{f}</span>
          ))}
        </div>

        {/* Price + rating */}
        <div className={styles.footer}>
          <div>
            <p className={styles.priceMain}>
              ₹{listing.pricing.monthly.toLocaleString()}
              <span className={styles.pricePer}>/mo</span>
            </p>
            <p className={styles.priceSub}>
              ₹{listing.pricing.hourly}/hr · ₹{listing.pricing.daily}/day
            </p>
          </div>
          <div className={styles.rating}>
            <Star size={12} fill="#EF9F27" color="#EF9F27" />
            <span>{listing.rating}</span>
            <span className={styles.ratingCount}>({listing.reviews})</span>
          </div>
        </div>

        <button className={styles.bookBtn}>
          Book Now →
        </button>
      </div>
    </div>
  );
}
