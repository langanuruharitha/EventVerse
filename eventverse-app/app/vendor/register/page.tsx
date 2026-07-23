'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const VENDOR_CATEGORIES = [
  'Photography & Videography',
  'Catering & Food',
  'Decoration & Florals',
  'Music & Entertainment',
  'Venue & Hall',
  'Mehendi & Beauty',
  'Wedding Planning',
  'Transportation',
  'Cake & Desserts',
  'Lighting & Sound',
  'Invitation & Stationery',
  'Other',
];

export default function VendorRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [primaryCategory, setPrimaryCategory] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/vendor/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, ownerName, businessName, contactPhone, primaryCategory, city, state, country: 'India' }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      setSuccess('🎉 Account created! Please check your email to verify, then sign in.');
      setTimeout(() => router.push('/vendor/login'), 3000);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const inputStyle = {
    background: '#FFFDF8',
    border: '1.5px solid #DDD0BB',
    color: '#2C1810',
    fontFamily: 'Georgia, serif',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = '#C5A880';
    e.target.style.boxShadow = '0 0 0 3px rgba(197,168,128,0.15)';
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = '#DDD0BB';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FAF6F0 0%, #F5EDE0 50%, #EDE0CC 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #C5A880 0%, transparent 70%)', transform: 'translate(-40%, -40%)' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #9B7A4A 0%, transparent 70%)', transform: 'translate(40%, 40%)' }} />
        <svg className="absolute top-6 left-6 w-24 h-24 opacity-10" viewBox="0 0 100 100" fill="none">
          <path d="M5,5 Q50,5 95,5 M5,5 Q5,50 5,95" stroke="#9B7A4A" strokeWidth="1.5" fill="none" />
          <circle cx="5" cy="5" r="3" fill="#C5A880" />
        </svg>
        <svg className="absolute bottom-6 right-6 w-24 h-24 opacity-10 rotate-180" viewBox="0 0 100 100" fill="none">
          <path d="M5,5 Q50,5 95,5 M5,5 Q5,50 5,95" stroke="#9B7A4A" strokeWidth="1.5" fill="none" />
          <circle cx="5" cy="5" r="3" fill="#C5A880" />
        </svg>
      </div>

      <div className="w-full max-w-lg relative">
        <div className="h-1 w-full rounded-t-sm" style={{ background: 'linear-gradient(90deg, #9B7A4A, #C5A880, #9B7A4A)' }} />

        <div
          className="rounded-b-sm shadow-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #FFFDF8 0%, #FBF5EC 100%)',
            border: '1px solid #DDD0BB',
            borderTop: 'none',
            boxShadow: '0 25px 60px rgba(155,122,74,0.12), 0 8px 20px rgba(0,0,0,0.08)',
          }}
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-5 text-center" style={{ borderBottom: '1px solid #EAE0CE' }}>
            <div className="flex justify-center mb-3">
              <img src="/eventverse-logo.png" alt="EventVerse" className="h-12 object-contain"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(155,122,74,0.25))' }} />
            </div>
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, #C5A880)' }} />
              <span className="text-lg">🏪</span>
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, #C5A880, transparent)' }} />
            </div>
            <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Georgia, serif', color: '#2C1810' }}>
              Vendor Registration
            </h1>
            <p className="text-sm mb-4" style={{ color: '#7A6652', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Join EventVerse and grow your business
            </p>

            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                    style={{
                      background: step >= s ? 'linear-gradient(135deg, #9B7A4A, #C5A880)' : '#EAE0CE',
                      color: step >= s ? '#FFFDF8' : '#9B8B7A',
                      boxShadow: step >= s ? '0 2px 8px rgba(155,122,74,0.3)' : 'none',
                    }}
                  >
                    {step > s ? '✓' : s}
                  </div>
                  {s < 2 && <div className="w-8 h-0.5" style={{ background: step > s ? '#C5A880' : '#EAE0CE' }} />}
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-10 mt-1.5">
              <span className="text-xs" style={{ color: '#9B8B7A', fontFamily: 'Georgia, serif' }}>Account</span>
              <span className="text-xs" style={{ color: '#9B8B7A', fontFamily: 'Georgia, serif' }}>Business</span>
            </div>
          </div>

          {/* Form body */}
          <div className="px-8 py-6">
            {error && (
              <div className="mb-4 p-3 rounded text-sm"
                style={{ background: '#FFF0F0', border: '1px solid #F5BDBD', color: '#8A1C2C' }}>
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded text-sm text-center"
                style={{ background: '#F0FFF4', border: '1px solid #B5DCC5', color: '#1A5C35' }}>
                {success}
              </div>
            )}

            {/* Step 1 */}
            {step === 1 && (
              <form onSubmit={handleStep1} className="space-y-4">
                <h2 className="text-base font-bold uppercase tracking-widest mb-4"
                  style={{ color: '#7A6652', fontFamily: 'Georgia, serif' }}>
                  Account Details
                </h2>

                {[
                  { label: 'Full Name', value: ownerName, onChange: setOwnerName, type: 'text', placeholder: 'Your full name' },
                  { label: 'Email Address', value: email, onChange: setEmail, type: 'email', placeholder: 'business@example.com' },
                  { label: 'Password', value: password, onChange: setPassword, type: 'password', placeholder: 'Minimum 6 characters' },
                  { label: 'Confirm Password', value: confirmPassword, onChange: setConfirmPassword, type: 'password', placeholder: 'Re-enter password' },
                ].map(({ label, value, onChange, type, placeholder }) => (
                  <div key={label}>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: '#7A6652' }}>
                      {label}
                    </label>
                    <input
                      type={type}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      required
                      className="w-full px-4 py-3 text-sm rounded outline-none transition-all duration-200"
                      placeholder={placeholder}
                      style={inputStyle}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  className="w-full py-3 text-sm font-semibold tracking-widest uppercase rounded transition-all duration-200 mt-2"
                  style={{
                    background: 'linear-gradient(135deg, #9B7A4A 0%, #7A5C35 100%)',
                    color: '#FAF0E0',
                    fontFamily: 'Georgia, serif',
                    boxShadow: '0 4px 16px rgba(155,122,74,0.3)',
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, #B08C55 0%, #8A6C3F 100%)'; }}
                  onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, #9B7A4A 0%, #7A5C35 100%)'; }}
                >
                  Continue →
                </button>
              </form>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-base font-bold uppercase tracking-widest mb-4"
                  style={{ color: '#7A6652', fontFamily: 'Georgia, serif' }}>
                  Business Details
                </h2>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: '#7A6652' }}>
                    Business Name <span style={{ color: '#8A1C2C' }}>*</span>
                  </label>
                  <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required
                    className="w-full px-4 py-3 text-sm rounded outline-none transition-all duration-200"
                    placeholder="Your business / brand name" style={inputStyle}
                    onFocus={handleFocus} onBlur={handleBlur} />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: '#7A6652' }}>
                    Contact Phone <span style={{ color: '#8A1C2C' }}>*</span>
                  </label>
                  <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} required
                    className="w-full px-4 py-3 text-sm rounded outline-none transition-all duration-200"
                    placeholder="+91 9876543210" style={inputStyle}
                    onFocus={handleFocus} onBlur={handleBlur} />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: '#7A6652' }}>
                    Service Category <span style={{ color: '#8A1C2C' }}>*</span>
                  </label>
                  <select value={primaryCategory} onChange={(e) => setPrimaryCategory(e.target.value)} required
                    className="w-full px-4 py-3 text-sm rounded outline-none transition-all duration-200"
                    style={{ ...inputStyle, appearance: 'auto' }}
                    onFocus={handleFocus} onBlur={handleBlur}>
                    <option value="">Select your primary service...</option>
                    {VENDOR_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: '#7A6652' }}>City</label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 text-sm rounded outline-none transition-all duration-200"
                      placeholder="Hyderabad" style={inputStyle}
                      onFocus={handleFocus} onBlur={handleBlur} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest" style={{ color: '#7A6652' }}>State</label>
                    <input type="text" value={state} onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-3 text-sm rounded outline-none transition-all duration-200"
                      placeholder="Telangana" style={inputStyle}
                      onFocus={handleFocus} onBlur={handleBlur} />
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setStep(1)}
                    className="w-1/3 py-3 rounded text-sm font-semibold transition-all"
                    style={{ border: '1.5px solid #DDD0BB', color: '#7A6652', background: '#FFFDF8', fontFamily: 'Georgia, serif' }}>
                    ← Back
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 py-3 text-sm font-semibold tracking-widest uppercase rounded transition-all duration-200 disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, #9B7A4A 0%, #7A5C35 100%)',
                      color: '#FAF0E0',
                      fontFamily: 'Georgia, serif',
                      boxShadow: '0 4px 16px rgba(155,122,74,0.3)',
                    }}
                    onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, #B08C55 0%, #8A6C3F 100%)'; }}
                    onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, #9B7A4A 0%, #7A5C35 100%)'; }}>
                    {loading ? 'Creating Account...' : 'Create Vendor Account'}
                  </button>
                </div>
              </form>
            )}

            {/* Footer */}
            <div className="mt-5 pt-4 text-center space-y-2" style={{ borderTop: '1px solid #EAE0CE' }}>
              <p className="text-sm" style={{ color: '#7A6652', fontFamily: 'Georgia, serif' }}>
                Already have an account?{' '}
                <Link href="/vendor/login" className="font-semibold" style={{ color: '#9B7A4A' }}>Sign In</Link>
              </p>
              <p className="text-sm" style={{ color: '#7A6652', fontFamily: 'Georgia, serif' }}>
                Customer?{' '}
                <Link href="/auth/signup" className="font-semibold" style={{ color: '#8A1C2C' }}>Sign up as Customer →</Link>
              </p>
            </div>
          </div>
        </div>

        <div className="h-1 w-full rounded-b-sm" style={{ background: 'linear-gradient(90deg, #C5A880, #9B7A4A, #C5A880)' }} />
      </div>
    </div>
  );
}
