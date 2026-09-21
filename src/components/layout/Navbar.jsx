import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Eye, Shield, ArrowRight, ExternalLink } from 'lucide-react';
import { NAV_LINKS, BRANDING } from '../../constants/navigation';
import Button from '../common/Button';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setMobileMenuOpen(false);

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
          <span className="text-slate-400 hidden md:inline">Internal Sync:</span>
          <span className="inline-flex items-center gap-1 bg-slate-800 text-blue-300 px-2 py-0.5 rounded border border-slate-700 font-mono text-[10px]">
            <Shield className="w-2.5 h-2.5 text-blue-400" />
            Connected with AAROHAN
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" onClick={closeMenu} className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-lg bg-slate-900 border border-blue-600 flex items-center justify-center shadow-sm group-hover:border-blue-500 transition-colors">
              {/* Logo symbol: pin + infrastructure bridge + eye */}
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
            {NAV_LINKS.map((item) => {
              if (item.highlight) {
                return (
                  <Link key={item.name} to={item.path} className="ml-2">
                    <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
                      {item.name}
                    </Button>
                  </Link>
                );
              }
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link to="/report" onClick={closeMenu}>
              <Button variant="primary" size="sm">
                Report
              </Button>
            </Link>
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
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg">
          <div className="mb-2 px-3 py-2 bg-slate-50 rounded text-xs text-slate-600 border border-slate-200 flex items-center justify-between">
            <span>Platform Integration</span>
            <span className="font-mono text-[11px] text-blue-700 font-semibold">
              Connected with AAROHAN
            </span>
          </div>

          {NAV_LINKS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={closeMenu}
                className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.name}
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
}
