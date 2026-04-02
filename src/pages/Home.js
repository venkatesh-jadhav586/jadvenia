import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Shield, TrendingUp, Clock, Star } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import { LISTINGS, METRO_STATIONS } from '../data';
import styles from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();
  const [searchQ, setSearchQ] = useState('');
  const [duration, setDuration] = useState('monthly');
  const [vehicle, setVehicle] = useState('4-wheeler');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchQ}&duration=${duration}&vehicle=${vehicle}`);
  };

  const featuredListings = LISTINGS.filter(l => l.kycVerified).slice(0, 4);

  return (
    <div className={`${styles.page} page-enter`}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>🚀 Now live in Bengaluru</div>
          <h1 className={styles.heroTitle}>
            Your neighbour's<br />
            parking spot.<br />
            <span>Your daily solution.</span>
          </h1>
          <p className={styles.heroSub}>
            Rent unused apartment slots, open plots near metro stations,
            and affordable alternatives to overpriced mall parking.
          </p>

          {/* Search bar */}
          <form className={styles.searchBox} onSubmit={handleSearch}>
            <div className={styles.searchInput}>
              <Search size={16} color="#888780" />
              <input
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Search area, metro station, landmark..."
                className={styles.searchField}
              />
            </div>
            <select
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className={styles.searchSelect}
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <select
              value={vehicle}
              onChange={e => setVehicle(e.target.value)}
              className={styles.searchSelect}
            >
              <option value="2-wheeler">2-Wheeler</option>
              <option value="4-wheeler">4-Wheeler</option>
              <option value="suv">SUV / Van</option>
            </select>
            <button type="submit" className={styles.searchBtn}>
              Find Parking
            </button>
          </form>

          {/* Quick metro links */}
          <div className={styles.metroLinks}>
            <span className={styles.metroLinkLabel}>Popular stations:</span>
            {METRO_STATIONS.slice(0, 5).map(s => (
              <button
                key={s}
                className={styles.metroChip}
                onClick={() => navigate(`/search?q=${s}&filter=metro`)}
              >
                🚇 {s}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className={styles.heroStats}>
          <div className={styles.stat}>
            <p className={styles.statNum}>2,840+</p>
            <p className={styles.statLabel}>Active spots</p>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <p className={styles.statNum}>127</p>
            <p className={styles.statLabel}>Areas covered</p>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <p className={styles.statNum}>₹4.2Cr</p>
            <p className={styles.statLabel}>Paid to hosts</p>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <p className={styles.statNum}>12,000+</p>
            <p className={styles.statLabel}>Happy parkers</p>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Find the right spot for you</h2>
          <div className={styles.categories}>
            <div className={styles.catCard} onClick={() => navigate('/search?filter=metro')}>
              <div className={styles.catIcon} style={{ background: '#E1F5EE' }}>🚇</div>
              <p className={styles.catTitle}>Near Metro</p>
              <p className={styles.catDesc}>Park & ride daily commuters. Leave your vehicle safely, take the metro.</p>
              <p className={styles.catFrom}>From ₹25/hr</p>
            </div>
            <div className={styles.catCard} onClick={() => navigate('/search?filter=mall')}>
              <div className={styles.catIcon} style={{ background: '#E6F1FB' }}>🏬</div>
              <p className={styles.catTitle}>Near Malls</p>
              <p className={styles.catDesc}>Beat mall pricing. Private spots within 300m of top malls.</p>
              <p className={styles.catFrom}>From ₹30/hr vs ₹80+</p>
            </div>
            <div className={styles.catCard} onClick={() => navigate('/search?type=apartment')}>
              <div className={styles.catIcon} style={{ background: '#FAEEDA' }}>🏢</div>
              <p className={styles.catTitle}>Apartment Slots</p>
              <p className={styles.catDesc}>Verified residents renting unused allotted parking in your area.</p>
              <p className={styles.catFrom}>From ₹800/month</p>
            </div>
            <div className={styles.catCard} onClick={() => navigate('/search?type=openPlot')}>
              <div className={styles.catIcon} style={{ background: '#FBEAF0' }}>🏗️</div>
              <p className={styles.catTitle}>Open Plots</p>
              <p className={styles.catDesc}>Vacant land converted to organised, affordable parking spaces.</p>
              <p className={styles.catFrom}>From ₹1,500/month</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured listings ── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured listings</h2>
            <button className={styles.viewAll} onClick={() => navigate('/search')}>View all →</button>
          </div>
          <div className={styles.listingsGrid}>
            {featuredListings.map(l => (
              <ListingCard key={l.id} listing={l} featured={l.id === 'l_003'} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className={styles.howSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle} style={{ textAlign: 'center' }}>How Jadvenia works</h2>
          <div className={styles.howTabs}>
            <HowTab icon="🔍" title="For Seekers" steps={[
              { icon: <Search size={16} />, title: 'Search by area or metro', desc: 'Find spots near you filtered by duration and vehicle type.' },
              { icon: <Shield size={16} />, title: 'Book KYC-verified spots', desc: 'Every host is verified. Pay securely via UPI, card, or wallet.' },
              { icon: <MapPin size={16} />, title: 'Navigate & park', desc: 'Get directions, access instructions, and 24x7 support.' },
            ]} />
            <HowTab icon="🏠" title="For Hosts" steps={[
              { icon: <Shield size={16} />, title: 'Complete KYC', desc: 'Aadhaar, PAN, and property document verification in minutes.' },
              { icon: <Clock size={16} />, title: 'List your spot', desc: 'Set pricing for hourly, daily, weekly, monthly, or yearly bookings.' },
              { icon: <TrendingUp size={16} />, title: 'Earn passively', desc: 'Get 88% of every booking directly to your bank. Zero effort.' },
            ]} />
          </div>
        </div>
      </section>

      {/* ── Earn section ── */}
      <section className={styles.earnSection}>
        <div className={styles.container}>
          <div className={styles.earnGrid}>
            <div className={styles.earnText}>
              <h2 className={styles.earnTitle}>
                Got a parking spot<br />you're not using?
              </h2>
              <p className={styles.earnDesc}>
                Whether it's an allotted apartment slot, vacant land near a metro, or an off-hours commercial basement —
                list it on Jadvenia and earn ₹2,000–₹20,000 every month without doing anything.
              </p>
              <div className={styles.earnPoints}>
                <div className={styles.earnPoint}>
                  <span className={styles.earnPointIcon}>✅</span>
                  <span>Keep 88% of every booking</span>
                </div>
                <div className={styles.earnPoint}>
                  <span className={styles.earnPointIcon}>✅</span>
                  <span>Weekly payouts to your bank</span>
                </div>
                <div className={styles.earnPoint}>
                  <span className={styles.earnPointIcon}>✅</span>
                  <span>You set pricing & availability</span>
                </div>
                <div className={styles.earnPoint}>
                  <span className={styles.earnPointIcon}>✅</span>
                  <span>₹10L insurance coverage per slot</span>
                </div>
              </div>
              <button className={styles.earnBtn} onClick={() => navigate('/list-spot')}>
                List My Spot — It's Free →
              </button>
            </div>

            <div className={styles.earnCalc}>
              <p className={styles.calcTitle}>Earning estimator</p>
              <EarningCalc />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust ── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.trustGrid}>
            <div className={styles.trustCard}>
              <Shield size={28} color="#1D9E75" />
              <p className={styles.trustTitle}>KYC Verified Hosts</p>
              <p className={styles.trustDesc}>Every host completes Aadhaar + PAN + property document verification before listing.</p>
            </div>
            <div className={styles.trustCard}>
              <Star size={28} color="#EF9F27" />
              <p className={styles.trustTitle}>Rated & Reviewed</p>
              <p className={styles.trustDesc}>Real ratings from real parkers. Sort by rating, distance, or price.</p>
            </div>
            <div className={styles.trustCard}>
              <TrendingUp size={28} color="#378ADD" />
              <p className={styles.trustTitle}>Secure Payments</p>
              <p className={styles.trustDesc}>Razorpay-powered. UPI, cards, wallets. Automatic splits. Instant refunds.</p>
            </div>
            <div className={styles.trustCard}>
              <Clock size={28} color="#D85A30" />
              <p className={styles.trustTitle}>24x7 Support</p>
              <p className={styles.trustDesc}>In-app chat, phone, and email support. Dispute resolution within 4 hours.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

function HowTab({ icon, title, steps }) {
  return (
    <div className={styles.howTab}>
      <p className={styles.howTabTitle}>{icon} {title}</p>
      {steps.map((s, i) => (
        <div key={i} className={styles.howStep}>
          <div className={styles.howStepNum}>{i + 1}</div>
          <div>
            <p className={styles.howStepTitle}>{s.title}</p>
            <p className={styles.howStepDesc}>{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function EarningCalc() {
  const [type, setType] = useState('apartment');
  const [slots, setSlots] = useState(1);

  const rates = {
    apartment:  { label: 'Apartment slot', monthly: 3500 },
    openPlot:   { label: 'Open plot',      monthly: 8000 },
    commercial: { label: 'Commercial',     monthly: 12000 },
  };

  const gross    = rates[type].monthly * slots;
  const hostEarn = Math.round(gross * 0.88);
  const yearly   = Math.round(hostEarn * 12);

  return (
    <div className={styles.calc}>
      <div className={styles.calcRow}>
        <label className={styles.calcLabel}>Spot type</label>
        <select value={type} onChange={e => setType(e.target.value)} className={styles.calcSelect}>
          <option value="apartment">Apartment slot</option>
          <option value="openPlot">Open plot / land</option>
          <option value="commercial">Commercial space</option>
        </select>
      </div>
      <div className={styles.calcRow}>
        <label className={styles.calcLabel}>No. of slots: <strong>{slots}</strong></label>
        <input type="range" min="1" max="20" value={slots} onChange={e => setSlots(+e.target.value)} step="1" />
      </div>
      <div className={styles.calcResult}>
        <div className={styles.calcResultItem}>
          <p className={styles.calcResultLabel}>Monthly earning</p>
          <p className={styles.calcResultNum}>₹{hostEarn.toLocaleString()}</p>
        </div>
        <div className={styles.calcResultItem}>
          <p className={styles.calcResultLabel}>Yearly earning</p>
          <p className={styles.calcResultNum}>₹{yearly.toLocaleString()}</p>
        </div>
      </div>
      <p className={styles.calcNote}>88% goes to you · 12% platform fee</p>
    </div>
  );
}
