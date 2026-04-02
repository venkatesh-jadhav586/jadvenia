import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import { LISTINGS, AREAS } from '../data';
import styles from './SearchPage.module.css';

const DURATION_LABELS = { hourly: 'Hourly', daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly', yearly: 'Yearly' };

export default function SearchPage() {
  const [params] = useSearchParams();
  const [query, setQuery]       = useState(params.get('q') || '');
  const [duration, setDuration] = useState(params.get('duration') || 'monthly');
  const [vehicle, setVehicle]   = useState(params.get('vehicle') || '');
  const [typeF, setTypeF]       = useState(params.get('type') || '');
  const [filterF, setFilterF]   = useState(params.get('filter') || '');
  const [maxPrice, setMaxPrice] = useState(50000);
  const [sortBy, setSortBy]     = useState('rating');
  const [kycOnly, setKycOnly]   = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...LISTINGS];

    if (query) {
      const q = query.toLowerCase();
      list = list.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.area.toLowerCase().includes(q) ||
        (l.metroStation || '').toLowerCase().includes(q)
      );
    }

    if (filterF === 'metro')  list = list.filter(l => l.nearMetro);
    if (filterF === 'mall')   list = list.filter(l => l.nearMall);
    if (typeF)                list = list.filter(l => l.type === typeF);
    if (vehicle)              list = list.filter(l => l.vehicleTypes.includes(vehicle));
    if (kycOnly)              list = list.filter(l => l.kycVerified);

    list = list.filter(l => l.pricing[duration] <= maxPrice);

    if (sortBy === 'rating')      list.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'price-asc')   list.sort((a, b) => a.pricing[duration] - b.pricing[duration]);
    if (sortBy === 'price-desc')  list.sort((a, b) => b.pricing[duration] - a.pricing[duration]);
    if (sortBy === 'distance')    list.sort((a, b) => (a.metroDistance || '999m').localeCompare(b.metroDistance || '999m'));

    return list;
  }, [query, filterF, typeF, vehicle, kycOnly, maxPrice, sortBy, duration]);

  const activeFilters = [
    filterF && `Near ${filterF === 'metro' ? 'Metro' : 'Mall'}`,
    typeF && (typeF === 'apartment' ? 'Apt Slot' : typeF === 'openPlot' ? 'Open Plot' : 'Commercial'),
    vehicle && vehicle,
    kycOnly && 'KYC Verified',
  ].filter(Boolean);

  return (
    <div className={`${styles.page} page-enter`}>

      {/* Search bar */}
      <div className={styles.searchBar}>
        <div className={styles.searchInner}>
          <div className={styles.inputWrap}>
            <Search size={16} color="#888780" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search area, metro station, landmark..."
              className={styles.searchInput}
            />
          </div>
          <select value={duration} onChange={e => setDuration(e.target.value)} className={styles.select}>
            {Object.entries(DURATION_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select value={vehicle} onChange={e => setVehicle(e.target.value)} className={styles.select}>
            <option value="">All vehicles</option>
            <option value="2-wheeler">2-Wheeler</option>
            <option value="4-wheeler">4-Wheeler</option>
            <option value="suv">SUV / Van</option>
          </select>
          <button className={styles.filterToggle} onClick={() => setShowFilters(f => !f)}>
            <SlidersHorizontal size={15} />
            Filters {activeFilters.length > 0 && <span className={styles.filterCount}>{activeFilters.length}</span>}
          </button>
        </div>
      </div>

      <div className={styles.body}>

        {/* Sidebar filters */}
        <aside className={`${styles.sidebar} ${showFilters ? styles.sidebarOpen : ''}`}>
          <p className={styles.sidebarTitle}>Filters</p>

          <div className={styles.filterSection}>
            <p className={styles.filterLabel}>Spot category</p>
            <div className={styles.filterChips}>
              {[['', 'All'], ['apartment', 'Apartment Slot'], ['openPlot', 'Open Plot'], ['commercial', 'Commercial']].map(([v, l]) => (
                <button key={v} className={`${styles.chip} ${typeF === v ? styles.chipActive : ''}`} onClick={() => setTypeF(v)}>{l}</button>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <p className={styles.filterLabel}>Location type</p>
            <div className={styles.filterChips}>
              {[['', 'All'], ['metro', 'Near Metro'], ['mall', 'Near Mall']].map(([v, l]) => (
                <button key={v} className={`${styles.chip} ${filterF === v ? styles.chipActive : ''}`} onClick={() => setFilterF(v)}>{l}</button>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <p className={styles.filterLabel}>Max price ({DURATION_LABELS[duration]}): ₹{maxPrice.toLocaleString()}</p>
            <input
              type="range"
              min="100"
              max="50000"
              step="100"
              value={maxPrice}
              onChange={e => setMaxPrice(+e.target.value)}
              style={{ width: '100%' }}
            />
            <div className={styles.rangeLabels}><span>₹100</span><span>₹50,000</span></div>
          </div>

          <div className={styles.filterSection}>
            <label className={styles.checkRow}>
              <input type="checkbox" checked={kycOnly} onChange={e => setKycOnly(e.target.checked)} style={{ accentColor: '#1D9E75' }} />
              <span className={styles.checkLabel}>KYC verified hosts only</span>
            </label>
          </div>

          <button className={styles.clearBtn} onClick={() => { setTypeF(''); setFilterF(''); setVehicle(''); setKycOnly(false); setMaxPrice(50000); }}>
            Clear all filters
          </button>
        </aside>

        {/* Results */}
        <main className={styles.results}>
          <div className={styles.resultsHeader}>
            <div>
              <p className={styles.resultsCount}>{filtered.length} spots found</p>
              {activeFilters.length > 0 && (
                <div className={styles.activeTags}>
                  {activeFilters.map(f => (
                    <span key={f} className={styles.activeTag}>{f}</span>
                  ))}
                </div>
              )}
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={styles.sortSelect}>
              <option value="rating">Sort: Top rated</option>
              <option value="price-asc">Sort: Price low→high</option>
              <option value="price-desc">Sort: Price high→low</option>
              <option value="distance">Sort: Nearest metro</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <p>🔍</p>
              <p className={styles.emptyTitle}>No spots found</p>
              <p className={styles.emptySub}>Try adjusting your filters or search in a nearby area.</p>
              <button className={styles.clearBtn} onClick={() => { setQuery(''); setTypeF(''); setFilterF(''); setVehicle(''); setKycOnly(false); setMaxPrice(50000); }}>Clear filters</button>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map(l => <ListingCard key={l.id} listing={l} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
