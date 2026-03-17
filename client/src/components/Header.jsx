import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { BarChart3, Users, MessageSquare, Settings, CreditCard, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { agent, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show header on login/register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/leads', label: 'Leads', icon: Users },
    { path: '/sequences', label: 'Sequences', icon: MessageSquare },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/billing', label: 'Billing', icon: CreditCard },
    { path: '/settings', label: 'Settings', icon: Settings }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b-2 border-purple-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white font-bold text-lg">LP</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:inline">LeadPulse</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                    isActive(item.path)
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side - User menu and mobile toggle */}
          <div className="flex items-center space-x-4">
            {/* User info */}
            <div className="hidden sm:flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{agent?.fullName || 'Agent'}</p>
                <p className="text-xs text-gray-600">{agent?.companyName || 'Company'}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {agent?.fullName?.charAt(0) || 'A'}
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
              title="Logout"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2 border-t border-gray-200 pt-4">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                    isActive(item.path)
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-300 flex items-center space-x-2"
            >
              <LogOut size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
