import React, { useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Eye,
  Shield,
  ArrowRight,
  User,
  LogOut,
  MapPin,
  Compass,
  FileText,
  Lock,
  LayoutDashboard,
} from 'lucide-react';
import { NAV_LINKS, BRANDING } from '../../constants/navigation';
import Button from '../common/Button';
import { useCivilianAuth } from '../../context/CivilianAuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useCivilianAuth();

  const closeMenu = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      {/* Top Civic Authority Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-medium text-slate-200">Public Infrastructure Transparency Portal</span>
          <span className="hidden sm:inline text-slate-400">• Citizen Ground Reality Network</span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          {isAuthenticated && user?.district ? (
            <span className="inline-flex items-center gap-1 bg-slate-800 text-amber-300 px-2 py-0.5 rounded border border-slate-700 font-medium">
              <MapPin className="w-2.5 h-2.5 text-amber-400" />
              {user.district}, {user.state} (25 km Zone)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-slate-800 text-blue-300 px-2 py-0.5 rounded border border-slate-700 font-mono text-[10px]">
              <Shield className="w-2.5 h-2.5 text-blue-400" />
              Connected with DRISHTI AI
            </span>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" onClick={closeMenu} className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-lg bg-slate-900 border border-blue-600 flex items-center justify-center shadow-sm group-hover:border-blue-500 transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 48 48" fill="none">
                <path d="M24 4C14 4 7 11 7 21C7 32 24 43 24 43C24 43 41 32 41 21C41 11 34 4 24 4Z" fill="#0B192C" />
                <path d="M14 20H34" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                <rect x="18" y="20" width="3.5" height="11" fill="#FFFFFF" rx="1" />
                <rect x="26.5" y="20" width="3.5" height="11" fill="#FFFFFF" rx="1" />
                <circle cx="24" cy="13.5" r="4.5" fill="#F59E0B" />
                <circle cx="24" cy="13.5" r="2" fill="#0B192C" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  {BRANDING.name}
                </span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 bg-blue-50 text-blue-700 border border-blue-200 rounded">
                  Civic Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight hidden sm:block">
                {BRANDING.subtitle}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink
              to="/"
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                location.pathname === '/'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </NavLink>

            {isAuthenticated && (
              <NavLink
                to="/dashboard"
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  location.pathname === '/dashboard'
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
                Civilian Dashboard
              </NavLink>
            )}

            <NavLink
              to="/projects"
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                location.pathname === '/projects'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Projects
            </NavLink>

            <NavLink
              to="/map"
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                location.pathname === '/map'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Map
            </NavLink>

            <NavLink
              to="/how-it-works"
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                location.pathname === '/how-it-works'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              How It Works
            </NavLink>
          </nav>

          {/* User Auth Buttons / Profile Strip */}
          <div className="hidden lg:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/profile">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-800 transition-colors border border-slate-200">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>{user?.firstName || user?.username}</span>
                  </div>
                </Link>

                <Link to="/report">
                  <Button variant="accent" size="sm" icon={ArrowRight} iconPosition="right">
                    Submit Report
                  </Button>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm" icon={Lock}>
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {isAuthenticated ? (
              <Link to="/dashboard" onClick={closeMenu}>
                <Button variant="accent" size="sm">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login" onClick={closeMenu}>
                <Button variant="primary" size="sm">
                  Login
                </Button>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {isAuthenticated ? (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs space-y-1 mb-3">
              <div className="flex items-center justify-between font-bold text-blue-900">
                <span>{user?.fullName}</span>
                <span className="font-mono text-[10px] text-blue-700 bg-white px-2 py-0.5 rounded">
                  {user?.maskedAadhaar}
                </span>
              </div>
              <p className="text-slate-600">{user?.district}, {user?.state}</p>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-3">
              <Link to="/login" onClick={closeMenu} className="flex-1">
                <Button variant="outline" size="sm" className="w-full justify-center">
                  Login
                </Button>
              </Link>
              <Link to="/register" onClick={closeMenu} className="flex-1">
                <Button variant="primary" size="sm" className="w-full justify-center">
                  Register
                </Button>
              </Link>
            </div>
          )}

          <NavLink
            to="/"
            onClick={closeMenu}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Home
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink
                to="/dashboard"
                onClick={closeMenu}
                className="block px-3 py-2 rounded-md text-sm font-semibold text-blue-700 hover:bg-blue-50"
              >
                Civilian Dashboard
              </NavLink>
              <NavLink
                to="/profile"
                onClick={closeMenu}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                My Profile & Location
              </NavLink>
            </>
          )}

          <NavLink
            to="/projects"
            onClick={closeMenu}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Public Projects
          </NavLink>

          <NavLink
            to="/map"
            onClick={closeMenu}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Geospatial Map
          </NavLink>

          <NavLink
            to="/report"
            onClick={closeMenu}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Submit Ground Report
          </NavLink>

          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-md"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </header>
  );
}
