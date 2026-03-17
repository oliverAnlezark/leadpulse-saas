import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Mail, Lock, ArrowRight, AlertCircle, Zap, Users, BarChart2 } from 'lucide-react';

const FEATURES = [
  { icon: Zap, label: 'AI-powered responses', desc: 'Instant replies to every enquiry' },
  { icon: Users, label: 'Lead management', desc: 'Track every lead through your pipeline' },
  { icon: BarChart2, label: 'Analytics & insights', desc: 'Know exactly what is working' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'system-ui, -apple-system, sans-serif', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>

      {/* Left panel — branding */}
      <div style={{
        width: window.innerWidth < 768 ? '100%' : '45%',
        minHeight: window.innerWidth < 768 ? 'auto' : '100vh',
        background: 'linear-gradient(145deg, #7c3aed 0%, #4f46e5 60%, #3730a3 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: window.innerWidth < 768 ? 'flex-start' : 'space-between',
        padding: window.innerWidth < 768 ? '32px 24px 24px' : '48px 52px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '260px', height: '260px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', top: '40%', left: '60%', width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

        {/* Logo + content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: window.innerWidth < 768 ? '32px' : '56px' }}>
            <svg width="40" height="36" viewBox="0 0 40 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
              <rect x="2" y="2" width="10" height="28" rx="2" fill="url(#lpurple)" />
              <rect x="2" y="26" width="18" height="6" rx="2" fill="url(#lpurple)" />
              <rect x="16" y="2" width="10" height="28" rx="2" fill="#1a1a2e" />
              <path d="M16 2 h12 a8 8 0 0 1 0 16 h-12 z" fill="#1a1a2e" />
              <path d="M16 2 h11 a7 7 0 0 1 0 14 h-11 z" fill="#2d2d44" />
              <polyline points="4,18 8,18 10,12 13,24 16,18 20,18 22,14 25,22 28,18 36,18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <defs>
                <linearGradient id="lpurple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </svg>
            <span style={{ color: 'white', fontWeight: '700', fontSize: '18px', letterSpacing: '-0.02em' }}><span style={{ color: '#a855f7' }}>Lead</span>Pulse</span>
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'white', margin: '0 0 16px 0', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Turn enquiries into clients — automatically.
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', margin: '0 0 48px 0', lineHeight: 1.6 }}>
            AI-powered lead automation built specifically for Australian real estate agents.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color="white" />
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: 'white', margin: '0 0 2px 0' }}>{label}</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div style={{ position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '20px' }}>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', margin: '0 0 10px 0', lineHeight: 1.6, fontStyle: 'italic' }}>
            "LeadPulse has completely changed how I handle enquiries. I never miss a lead now."
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'white' }}>SJ</span>
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: '700', color: 'white', margin: 0 }}>Sarah Johnson</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Principal Agent, Sydney</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, background: '#f9fafb', display: 'flex', alignItems: window.innerWidth < 768 ? 'flex-start' : 'center', justifyContent: 'center', padding: window.innerWidth < 768 ? '32px 24px 24px' : '48px 52px', overflowY: window.innerWidth < 768 ? 'auto' : 'visible' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>Welcome back</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 36px 0' }}>Sign in to your LeadPulse account</p>

          {error && (
            <div style={{ marginBottom: '20px', padding: '14px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '1px' }} />
              <p style={{ fontSize: '13px', color: '#dc2626', margin: 0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '7px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  style={{ width: '100%', padding: '11px 14px 11px 40px', border: '1px solid #e5e7eb', borderRadius: '9px', fontSize: '14px', color: '#111827', outline: 'none', background: 'white', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#7c3aed'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '7px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#9ca3af" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ width: '100%', padding: '11px 14px 11px 40px', border: '1px solid #e5e7eb', borderRadius: '9px', fontSize: '14px', color: '#111827', outline: 'none', background: 'white', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#7c3aed'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ marginTop: '6px', width: '100%', padding: '13px', border: 'none', borderRadius: '9px', background: loading ? '#9ca3af' : 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', color: 'white', fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: loading ? 'none' : '0 4px 16px rgba(124,58,237,0.3)' }}
            >
              {loading ? 'Signing in...' : <><span>Sign In</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <div style={{ margin: '28px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
            <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '500' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#6b7280', margin: 0 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#7c3aed', fontWeight: '700', textDecoration: 'none' }}>Create one free</Link>
          </p>
          <p style={{ textAlign: 'center', fontSize: '11px', color: '#9ca3af', margin: '24px 0 0 0' }}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
