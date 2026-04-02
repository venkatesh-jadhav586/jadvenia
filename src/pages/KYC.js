import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Upload, CheckCircle, Clock } from 'lucide-react';
import styles from './KYC.module.css';

const STEPS = [
  { id: 1, title: 'Personal Info',       icon: '👤', desc: 'Basic details & Aadhaar number' },
  { id: 2, title: 'PAN Verification',    icon: '🪪', desc: 'PAN card for tax compliance' },
  { id: 3, title: 'Property Document',   icon: '🏠', desc: 'Proof of ownership or permission' },
  { id: 4, title: 'Bank Account',        icon: '🏦', desc: 'For receiving payouts' },
  { id: 5, title: 'Review & Submit',     icon: '✅', desc: 'Final check before submission' },
];

export default function KYC() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    aadhaar: '', panNumber: '', panName: '',
    docType: 'sale-deed', docFile: null,
    bankAccNo: '', ifsc: '', bankName: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (step === 1 && form.aadhaar.replace(/\s/g, '').length !== 12) errs.aadhaar = 'Enter valid 12-digit Aadhaar';
    if (step === 2 && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.panNumber)) errs.panNumber = 'Enter valid PAN (e.g. ABCDE1234F)';
    if (step === 4 && form.bankAccNo.length < 9) errs.bankAccNo = 'Enter valid account number';
    if (step === 4 && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc)) errs.ifsc = 'Enter valid IFSC code';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => { if (validate()) setStep(s => Math.min(s + 1, 5)); };
  const prev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = () => {
    updateUser && updateUser({ kycStatus: 'pending' });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={styles.page}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>🎉</div>
          <h2 className={styles.successTitle}>KYC submitted!</h2>
          <p className={styles.successDesc}>
            Your documents are under review. Our team will verify within 24–48 hours.
            You'll receive an SMS and email once approved.
          </p>
          <div className={styles.successSteps}>
            <div className={styles.ssRow}><CheckCircle size={16} color="#1D9E75" /><span>Documents received</span></div>
            <div className={styles.ssRow}><Clock size={16} color="#EF9F27" /><span>Admin verification — 24-48 hrs</span></div>
            <div className={styles.ssRow}><Shield size={16} color="#888780" /><span>Listing goes live on approval</span></div>
          </div>
          <button className={styles.doneBtn} onClick={() => navigate('/dashboard')}>
            Go to Dashboard →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.page} page-enter`}>
      <div className={styles.container}>

        <div className={styles.pageHeader}>
          <Shield size={28} color="#1D9E75" />
          <div>
            <h1 className={styles.pageTitle}>KYC Verification</h1>
            <p className={styles.pageSub}>Complete verification to list your parking spot and receive payouts.</p>
          </div>
        </div>

        {/* Progress */}
        <div className={styles.stepper}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`${styles.stepItem} ${step === s.id ? styles.stepActive : ''} ${step > s.id ? styles.stepDone : ''}`}>
                <div className={styles.stepCircle}>
                  {step > s.id ? <CheckCircle size={14} color="#fff" /> : s.id}
                </div>
                <span className={styles.stepLabel}>{s.title}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${step > s.id ? styles.stepLineDone : ''}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <span className={styles.stepIcon}>{STEPS[step - 1].icon}</span>
            <div>
              <p className={styles.formTitle}>{STEPS[step - 1].title}</p>
              <p className={styles.formDesc}>{STEPS[step - 1].desc}</p>
            </div>
          </div>

          {/* Step 1 — Personal Info */}
          {step === 1 && (
            <div className={styles.fields}>
              <Field label="Full name (as per Aadhaar)" value={user?.name || ''} disabled />
              <Field label="Aadhaar number" value={form.aadhaar} onChange={set('aadhaar')} placeholder="XXXX XXXX XXXX" error={errors.aadhaar} maxLength={14} />
              <Field label="Date of birth" type="date" value={form.dob} onChange={set('dob')} />
              <Field label="Address" value={form.address} onChange={set('address')} placeholder="Your current address" />
              <div className={styles.kycNote}>
                <Shield size={14} color="#1D9E75" />
                Your Aadhaar data is encrypted and never stored in plaintext. We use DigiLocker API for verification.
              </div>
            </div>
          )}

          {/* Step 2 — PAN */}
          {step === 2 && (
            <div className={styles.fields}>
              <Field label="PAN number" value={form.panNumber} onChange={e => setForm(f => ({ ...f, panNumber: e.target.value.toUpperCase() }))} placeholder="ABCDE1234F" error={errors.panNumber} maxLength={10} />
              <Field label="Name on PAN" value={form.panName} onChange={set('panName')} placeholder="Arjun Sharma" />
              <UploadField label="Upload PAN card image" />
              <div className={styles.kycNote}><Shield size={14} color="#1D9E75" /> PAN is required for GST compliance and payments above ₹50,000/year.</div>
            </div>
          )}

          {/* Step 3 — Property Doc */}
          {step === 3 && (
            <div className={styles.fields}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Document type</label>
                <select value={form.docType} onChange={set('docType')} className={styles.select}>
                  <option value="sale-deed">Sale deed / Property registration</option>
                  <option value="allotment">Apartment allotment letter</option>
                  <option value="lease">Lease agreement</option>
                  <option value="noc">NOC from building society</option>
                  <option value="electricity">Electricity bill (property proof)</option>
                </select>
              </div>
              <UploadField label="Upload document (PDF or image)" />
              <UploadField label="Selfie with property / spot (optional)" />
              <div className={styles.kycNote}><Shield size={14} color="#1D9E75" /> Documents are reviewed by our team within 24 hours. Original documents are not required.</div>
            </div>
          )}

          {/* Step 4 — Bank */}
          {step === 4 && (
            <div className={styles.fields}>
              <Field label="Bank account number" value={form.bankAccNo} onChange={set('bankAccNo')} placeholder="Account number" error={errors.bankAccNo} />
              <Field label="IFSC code" value={form.ifsc} onChange={e => setForm(f => ({ ...f, ifsc: e.target.value.toUpperCase() }))} placeholder="SBIN0001234" error={errors.ifsc} maxLength={11} />
              <Field label="Bank name" value={form.bankName} onChange={set('bankName')} placeholder="State Bank of India" />
              <Field label="Account holder name" value={form.accHolder} onChange={set('accHolder')} placeholder="As per bank records" />
              <div className={styles.kycNote}><Shield size={14} color="#1D9E75" /> Payouts are processed every Monday via NEFT/IMPS. Minimum payout: ₹500.</div>
            </div>
          )}

          {/* Step 5 — Review */}
          {step === 5 && (
            <div className={styles.review}>
              <p className={styles.reviewTitle}>Review your information</p>
              {[
                { label: 'Aadhaar', val: form.aadhaar || '—' },
                { label: 'PAN', val: form.panNumber || '—' },
                { label: 'Document type', val: form.docType },
                { label: 'Bank account', val: form.bankAccNo ? `****${form.bankAccNo.slice(-4)}` : '—' },
                { label: 'IFSC', val: form.ifsc || '—' },
              ].map(r => (
                <div key={r.label} className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>{r.label}</span>
                  <span className={styles.reviewVal}>{r.val}</span>
                </div>
              ))}
              <div className={styles.kycNote} style={{ marginTop: '1rem' }}>
                <CheckCircle size={14} color="#1D9E75" />
                By submitting, you confirm all information is accurate. False information may result in account suspension.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className={styles.navBtns}>
            {step > 1 && <button className={styles.prevBtn} onClick={prev}>← Previous</button>}
            <div style={{ flex: 1 }} />
            {step < 5
              ? <button className={styles.nextBtn} onClick={next}>Next →</button>
              : <button className={styles.submitBtn} onClick={handleSubmit}>Submit for Verification →</button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, error, type = 'text', disabled, maxLength }) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.fieldLabel}>{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={`${styles.input} ${error ? styles.inputError : ''} ${disabled ? styles.inputDisabled : ''}`}
      />
      {error && <p className={styles.fieldError}>{error}</p>}
    </div>
  );
}

function UploadField({ label }) {
  const [file, setFile] = useState(null);
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.fieldLabel}>{label}</label>
      <label className={styles.uploadBox}>
        <Upload size={20} color="#888780" />
        <span className={styles.uploadText}>{file ? file.name : 'Click to upload or drag & drop'}</span>
        <span className={styles.uploadSub}>PDF, JPG, PNG up to 5MB</span>
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
      </label>
    </div>
  );
}
