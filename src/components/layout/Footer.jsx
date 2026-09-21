import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Eye, Building2, CheckCircle2, Lock } from 'lucide-react';
import { BRANDING } from '../../constants/navigation';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      {/* Top Banner Notice: AAROHAN Separation Notice */}
      <div className="bg-slate-950/80 border-b border-slate-800 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="p-1 rounded bg-blue-900/60 text-blue-400 border border-blue-700/50">
              <Shield className="w-3.5 h-3.5" />
            </span>
            <span>
              <strong>Platform Governance:</strong> {BRANDING.secondaryReference} — AI Integrated Project Monitoring Platform.
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Lock className="w-3 h-3 text-amber-400" />
            <span>AAROHAN is an internal government monitoring suite and remains strictly non-public.</span>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-blue-700 flex items-center justify-center text-white font-black text-sm">
                JN
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {BRANDING.name}
                </h3>
                <p className="text-xs text-slate-400">{BRANDING.subtitle}</p>
              </div>
            </div>

            <p className="text-sm font-medium text-amber-400 max-w-md">
              "{BRANDING.tagline}"
            </p>

            <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
              JanNirikshan empowers citizens with transparent access to public works data, enabling on-site ground observations, photographic evidence upload, and community auditing to hold public infrastructure projects accountable.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Public Portal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Portal Home
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-slate-400 hover:text-white transition-colors">
                  Browse Projects
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-slate-400 hover:text-white transition-colors">
                  Geospatial Map
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-slate-400 hover:text-white transition-colors">
                  Submit Ground Observation
                </Link>
              </li>
              <li>
                <Link to="/transparency" className="text-slate-400 hover:text-white transition-colors">
                  Transparency Metrics
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Principles & Framework */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Civic Framework
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open Public Infrastructure Data</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Citizen Evidence Corroboration</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Automated Anomaly Triage</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Authorized Officer Accountability</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} JanNirikshan Public Transparency Initiative.</p>
          <p className="text-[11px] text-slate-400">
            Civic-Tech Infrastructure Monitoring • Built for public transparency
          </p>
        </div>
      </div>
    </footer>
  );
}
