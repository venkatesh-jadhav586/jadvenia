import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import styles from './Auth.module.css';

export default function Signup() {
  const { loginWithGoogle, signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'seeker' });
  const [showPass, setShowPass] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleGoogle = () => { loginWithGoogle(); navigate('/'); };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) { setError('Please fill all required fields.'); return; }
    if (!agree) { setError('Please accept the terms to continue.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    setTimeout(() => {
      signup(form.name, form.email, form.password);
      setLoading(false);
      navigate('/kyc');
    }, 900);
  };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.leftContent}>
          <Link to="/" className={styles.logo}>Jadve<span>nia</span></Link>
          <h2 className={styles.leftTitle}>Join 12,000+<br />smart parkers.</h2>
          <p className={styles.leftSub}>
            Find affordable spots or list yours to earn. Bengaluru's largest peer-to-peer parking network.
          </p>
          <div className={styles.benefitList}>
            {[
              'Free to join — no hidden charges',
              'Book hourly, daily, monthly or yearly',
              'KYC-verified hosts only',
              'Earn ₹2K–₹20K/month as a host',
              'Secure Razorpay payments',
            ].map(b => (
              <div key={b} className={styles.benefit}>
                <CheckCircle size={15} color="#1D9E75" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <h1 className={styles.title}>Create your account</h1>
          <p className={styles.subtitle}>It's free and takes 60 seconds</p>

          <button className={styles.googleBtn} onClick={handleGoogle}>
            <GoogleIcon />
            Sign up with Google
          </button>

          <div className={styles.divider}><span>or sign up with email</span></div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.field}>
              <label className={styles.label}>Full name <span className={styles.req}>*</span></label>
              <input type="text" value={form.name} onChange={set('name')} placeholder="Arjun Sharma" className={styles.input} />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Email address <span className={styles.req}>*</span></label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="you@gmail.com" className={styles.input} autoComplete="email" />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Mobile number</label>
              <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" className={styles.input} />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password <span className={styles.req}>*</span></label>
              <div className={styles.inputWrap}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Min 8 characters"
                  className={styles.input}
                  autoComplete="new-password"
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(p => !p)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>I want to</label>
              <div className={styles.roleGrid}>
                {[
                  { value: 'seeker', label: '🔍 Find Parking', desc: 'Book spots near me' },
                  { value: 'host',   label: '🏠 List & Earn',   desc: 'Rent out my spot' },
                  { value: 'both',   label: '⚡ Both',           desc: 'Seek + host' },
                ].map(r => (
                  <label key={r.value} className={`${styles.roleCard} ${form.role === r.value ? styles.roleCardActive : ''}`}>
                    <input type="radio" name="role" value={r.value} checked={form.role === r.value} onChange={set('role')} style={{ display: 'none' }} />
                    <span className={styles.roleLabel}>{r.label}</span>
                    <span className={styles.roleDesc}>{r.desc}</span>
                  </label>
                ))}
              </div>
            </div>

            <label className={styles.checkRow}>
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className={styles.checkbox} />
              <span className={styles.checkLabel}>
                I agree to the <Link to="/terms" className={styles.switchLink}>Terms of Service</Link> and <Link to="/privacy" className={styles.switchLink}>Privacy Policy</Link>
              </span>
            </label>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>
          </form>

          <p className={styles.switchText}>
            Already have an account? <Link to="/login" className={styles.switchLink}>Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
