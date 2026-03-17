import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  BarChart3,
  Users,
  MessageSquare,
  Settings,
  CreditCard,
  LogOut,
  Menu,
  X,
  Home,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }) {
  const { agent, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: Home },
    { label: 'Leads', path: '/leads', icon: Users },
    { label: 'Sequences', path: '/sequences', icon: Zap },
    { label: 'Analytics', path: '/analytics', icon: TrendingUp },
    { label: 'Billing', path: '/billing', icon: CreditCard },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  const sidebarWidth = sidebarOpen ? '256px' : '72px';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      {/* Dark Sidebar - Desktop */}
      <aside
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          background: 'linear-gradient(180deg, #111827 0%, #1f2937 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          zIndex: 50,
          transition: 'width 0.3s ease',
          overflow: 'hidden',
        }}
        className="hidden md:flex"
      >
        {/* Logo */}
        <div style={{
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarOpen ? 'flex-start' : 'center',
          borderBottom: '1px solid #374151',
          padding: sidebarOpen ? '0 20px' : '0',
          flexShrink: 0,
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            {/* LP Logo SVG */}
            <svg width="40" height="36" viewBox="0 0 40 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
              {/* L letter - purple */}
              <rect x="2" y="2" width="10" height="28" rx="2" fill="url(#lpurple)" />
              <rect x="2" y="26" width="18" height="6" rx="2" fill="url(#lpurple)" />
              {/* P letter - dark */}
              <rect x="16" y="2" width="10" height="28" rx="2" fill="#1a1a2e" />
              <path d="M16 2 h12 a8 8 0 0 1 0 16 h-12 z" fill="#1a1a2e" />
              <path d="M16 2 h11 a7 7 0 0 1 0 14 h-11 z" fill="#2d2d44" />
              {/* Pulse line */}
              <polyline points="4,18 8,18 10,12 13,24 16,18 20,18 22,14 25,22 28,18 36,18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <defs>
                <linearGradient id="lpurple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </svg>
            {sidebarOpen && (
              <span style={{ color: 'white', fontWeight: '800', fontSize: '17px', whiteSpace: 'nowrap', letterSpacing: '-0.3px' }}>
                <span style={{ color: '#a855f7' }}>Lead</span>Pulse
              </span>
            )}
          </Link>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                title={!sidebarOpen ? item.label : ''}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  marginBottom: '4px',
                  textDecoration: 'none',
                  background: active ? '#7c3aed' : 'transparent',
                  color: active ? 'white' : '#d1d5db',
                  transition: 'all 0.2s ease',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = '#374151';
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#d1d5db';
                  }
                }}
              >
                <Icon size={20} style={{ flexShrink: 0 }} />
                {sidebarOpen && (
                  <span style={{ fontWeight: '500', fontSize: '14px', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ borderTop: '1px solid #374151', padding: '12px' }}>
          <button
            onClick={handleLogout}
            title={!sidebarOpen ? 'Logout' : ''}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'transparent',
              color: '#d1d5db',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.2s ease',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#374151';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#d1d5db';
            }}
          >
            <LogOut size={20} style={{ flexShrink: 0 }} />
            {sidebarOpen && <span style={{ fontWeight: '500', fontSize: '14px' }}>Logout</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <div style={{ borderTop: '1px solid #374151', padding: '12px' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              borderRadius: '8px',
              background: 'transparent',
              color: '#9ca3af',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#374151';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#9ca3af';
            }}
          >
            <Menu size={20} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        marginLeft: sidebarWidth,
        transition: 'margin-left 0.3s ease',
      }} className="md:block">
        {/* Top Header */}
        <header style={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <div style={{
            padding: '0 24px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                padding: '8px',
                color: '#6b7280',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '8px',
              }}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Search Bar */}
            <div style={{ flex: 1, maxWidth: '400px' }}>
              <input
                type="text"
                placeholder="Search leads, sequences..."
                style={{
                  width: '100%',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px',
                  outline: 'none',
                  color: '#374151',
                }}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* User Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '16px', borderLeft: '1px solid #e5e7eb' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>
                  {agent?.fullName || 'Agent'}
                </p>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                  {agent?.companyName || 'Company'}
                </p>
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px',
                boxShadow: '0 2px 8px rgba(124,58,237,0.3)',
              }}>
                {agent?.fullName?.charAt(0)?.toUpperCase() || 'A'}
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav style={{ borderTop: '1px solid #e5e7eb', background: 'white', padding: '12px 16px' }}>
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      marginBottom: '4px',
                      textDecoration: 'none',
                      background: isActive(item.path) ? '#f3e8ff' : 'transparent',
                      color: isActive(item.path) ? '#7c3aed' : '#374151',
                      fontWeight: '500',
                    }}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'transparent',
                  color: '#ef4444',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </nav>
          )}
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: 'auto', background: '#f9fafb' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
