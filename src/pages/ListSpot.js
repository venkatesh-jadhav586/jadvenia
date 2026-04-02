import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, CheckCircle } from 'lucide-react';
import styles from './ListSpot.module.css';

const STEPS = [
  { id: 1, title: 'Spot Details',   icon: '📍' },
  { id: 2, title: 'Pricing',        icon: '💰' },
  { id: 3, title: 'Availability',   icon: '📅' },
  { id: 4, title: 'Photos & Notes', icon: '📸' },
];

export default function ListSpot() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    title: '', address: '', area: '', type: 'apartment',
    nearMetro: false, metroStation: '', metroDistance: '',
    nearMall: false, mallName: '',
    vehicles: [], features: [],
    hourly: '', daily: '', weekly: '', monthly: '', yearly: '',
    availFrom: '', availTo: '', is24x7: true,
    description: '',
  });

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const toggle = (k, v) => setForm(f => ({ ...f, [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v] }));

  const next = () => setStep(s => Math.min(s + 1, 4));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  if (!user) {
    return (
      <div className={styles.page}>
        <div className={styles.authWall}>
          <p>Please sign in to list your spot.</p>
          <button className={styles.signInBtn} onClick={() => navigate('/login')}>Sign In →</button>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className={styles.page}>
        <div className={styles.successCard}>
          <div className={styles.successEmoji}>🎉</div>
          <h2 className={styles.successTitle}>Listing submitted!</h2>
          <p className={styles.successDesc}>Your spot is under review. Once our team approves it (usually within 24 hours), it'll be live on Jadvenia.</p>
          <div className={styles.successActions}>
            <button className={styles.dashBtn} onClick={() => navigate('/host-dashboard')}>Go to Host Dashboard</button>
            <button className={styles.anotherBtn} onClick={() => { setDone(false); setStep(1); }}>List another spot</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.container}>

        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>List your parking spot</h1>
          <p className={styles.pageSub}>Earn ₹2,000–₹20,000 per month. Setup takes under 5 minutes.</p>
        </div>

        {user.kycStatus !== 'verified' && (
          <div className={styles.kycBanner}>
            <Shield size={16} color="#854F0B" />
            <span>Complete KYC verification to publish your listing and receive payouts.</span>
            <button className={styles.kycBannerBtn} onClick={() => navigate('/kyc')}>Complete KYC →</button>
          </div>
        )}

        {/* Steps */}
        <div className={styles.stepper}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`${styles.stepItem} ${step === s.id ? styles.stepActive : ''} ${step > s.id ? styles.stepDone : ''}`}>
                <div className={styles.stepCircle}>
                  {step > s.id ? <CheckCircle size={13} color="#fff" /> : s.icon}
                </div>
                <span className={styles.stepLabel}>{s.title}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${step > s.id ? styles.stepLineDone : ''}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className={styles.formCard}>

          {/* Step 1 */}
          {step === 1 && (
            <div className={styles.fields}>
              <h2 className={styles.stepHeading}>Tell us about your spot</h2>
              <Field label="Listing title" value={form.title} onChange={set('title')} placeholder='e.g. "Covered Parking — Brigade Millenium, HSR"' />
              <Field label="Full address" value={form.address} onChange={set('address')} placeholder="Building name, street, area" />

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Spot type</label>
                <div className={styles.typeGrid}>
                  {[['apartment','🏢','Apartment Slot','Allotted slot in housing society'],
                    ['openPlot','🏗️','Open Plot','Vacant land or open ground'],
                    ['commercial','🏪','Commercial','Office/shop basement or compound']
                  ].map(([v, icon, title, desc]) => (
                    <label key={v} className={`${styles.typeCard} ${form.type === v ? styles.typeCardActive : ''}`}>
                      <input type="radio" name="type" value={v} checked={form.type === v} onChange={set('type')} style={{ display: 'none' }} />
                      <span style={{ fontSize: '1.5rem' }}>{icon}</span>
                      <span className={styles.typeTitle}>{title}</span>
                      <span className={styles.typeDesc}>{desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Vehicles accepted</label>
                <div className={styles.checkGrid}>
                  {['2-wheeler', '4-wheeler', 'suv'].map(v => (
                    <label key={v} className={`${styles.checkChip} ${form.vehicles.includes(v) ? styles.checkChipActive : ''}`}>
                      <input type="checkbox" checked={form.vehicles.includes(v)} onChange={() => toggle('vehicles', v)} style={{ display: 'none' }} />
                      {v === '2-wheeler' && '🛵'} {v === '4-wheeler' && '🚗'} {v === 'suv' && '🚙'} {v}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Amenities</label>
                <div className={styles.checkGrid}>
                  {['Covered', 'CCTV', 'Gated', '24x7', 'Security Guard', 'EV Charging'].map(f => (
                    <label key={f} className={`${styles.checkChip} ${form.features.includes(f) ? styles.checkChipActive : ''}`}>
                      <input type="checkbox" checked={form.features.includes(f)} onChange={() => toggle('features', f)} style={{ display: 'none' }} />
                      {f}
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.toggleRow}>
                <label className={styles.toggleLabel}>
                  <input type="checkbox" checked={form.nearMetro} onChange={e => setForm(f => ({ ...f, nearMetro: e.target.checked }))} />
                  Near a metro station?
                </label>
              </div>
              {form.nearMetro && (
                <div className={styles.inlineGrid}>
                  <Field label="Metro station name" value={form.metroStation} onChange={set('metroStation')} placeholder="Indiranagar Metro" />
                  <Field label="Walking distance" value={form.metroDistance} onChange={set('metroDistance')} placeholder="e.g. 200m" />
                </div>
              )}
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className={styles.fields}>
              <h2 className={styles.stepHeading}>Set your pricing</h2>
              <p className={styles.stepNote}>You can enable any combination of durations. Leave blank to disable that option.</p>
              <div className={styles.pricingGrid}>
                {[['hourly','Hourly','₹20–₹100'],['daily','Daily','₹100–₹400'],['weekly','Weekly','₹500–₹2,000'],['monthly','Monthly','₹800–₹8,000'],['yearly','Yearly','₹8,000–₹80,000']].map(([k, l, hint]) => (
                  <div key={k} className={styles.priceRow}>
                    <div>
                      <p className={styles.priceLabel}>{l}</p>
                      <p className={styles.priceHint}>Suggested: {hint}</p>
                    </div>
                    <div className={styles.priceInput}>
                      <span className={styles.rupee}>₹</span>
                      <input type="number" value={form[k]} onChange={set(k)} placeholder="0" className={styles.priceField} />
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.feeNote}>
                <Shield size={13} color="#1D9E75" />
                Jadvenia charges 12%. You keep 88% of every booking. Payouts every Monday.
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className={styles.fields}>
              <h2 className={styles.stepHeading}>Availability</h2>
              <label className={styles.toggleLabel}>
                <input type="checkbox" checked={form.is24x7} onChange={e => setForm(f => ({ ...f, is24x7: e.target.checked }))} />
                Available 24x7 (recommended)
              </label>
              {!form.is24x7 && (
                <div className={styles.inlineGrid}>
                  <Field label="Available from" type="time" value={form.availFrom} onChange={set('availFrom')} />
                  <Field label="Available until" type="time" value={form.availTo} onChange={set('availTo')} />
                </div>
              )}
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Days available</label>
                <div className={styles.checkGrid}>
                  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                    <label key={d} className={`${styles.checkChip} ${form.vehicles.includes(d) ? styles.checkChipActive : ''}`}>
                      <input type="checkbox" onChange={() => toggle('vehicles', d)} style={{ display: 'none' }} />
                      {d}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div className={styles.fields}>
              <h2 className={styles.stepHeading}>Photos & description</h2>
              <div className={styles.uploadBox}>
                <span style={{ fontSize: '2rem' }}>📸</span>
                <p className={styles.uploadText}>Upload photos of your spot</p>
                <p className={styles.uploadSub}>Clear photos get 3× more bookings. Add 2–5 images.</p>
                <input type="file" multiple accept="image/*" style={{ display: 'none' }} />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Description (optional)</label>
                <textarea
                  value={form.description}
                  onChange={set('description')}
                  rows={4}
                  placeholder="Describe your spot, access instructions, any special notes..."
                  className={styles.textarea}
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className={styles.navBtns}>
            {step > 1 && <button className={styles.prevBtn} onClick={prev}>← Previous</button>}
            <div style={{ flex: 1 }} />
            {step < 4
              ? <button className={styles.nextBtn} onClick={next}>Next →</button>
              : <button className={styles.submitBtn} onClick={() => setDone(true)}>Submit Listing →</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.fieldLabel}>{label}</label>
      <input type={type} value={value || ''} onChange={onChange} placeholder={placeholder} className={styles.input} />
    </div>
  );
}
