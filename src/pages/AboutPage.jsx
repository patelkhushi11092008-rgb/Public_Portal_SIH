import React from 'react';
import PageHeader from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import Alert from '../components/common/Alert';
import { Shield, Eye, Lock, CheckCircle2, Users, Building2 } from 'lucide-react';
import { BRANDING } from '../constants/navigation';

export default function AboutPage() {
  return (
    <div className="pb-16">
      <PageHeader
        title={`About ${BRANDING.name}`}
        subtitle={BRANDING.subtitle}
        breadcrumbs={[{ label: 'About' }]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="border-l-4 border-amber-500 pl-4">
            <h2 className="text-xl font-bold text-slate-900">
              "{BRANDING.tagline}"
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              The Guiding Principle of JanNirikshan
            </p>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            <strong>JanNirikshan</strong> is an open civic-tech initiative established to bring radical transparency to public infrastructure and civil construction projects. Roads, bridges, flood mitigation channels, schools, and hospitals are funded by public resources — and every citizen deserves accurate, verifiable knowledge of whether scheduled milestones match reality on the ground.
          </p>

          {/* Separation Notice Alert */}
          <Alert variant="warning" title="Platform Governance & Separation Architecture">
            <strong>Important distinction:</strong> JanNirikshan is connected with <strong>AAROHAN — AI Integrated Project Monitoring Platform</strong>. AAROHAN is an internal government monitoring suite used by authorized municipal agencies and is strictly <em>not</em> a public-facing feature. JanNirikshan serves exclusively as the public-facing transparency layer.
          </Alert>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-4">Core Principles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3">
                <Users className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Public Participation</h4>
                  <p className="text-slate-500 mt-1">Direct ground-level reporting by local residents and commuters.</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3">
                <Building2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Institutional Integrity</h4>
                  <p className="text-slate-500 mt-1">Official tender data and contractor milestone disclosures are preserved.</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3">
                <Eye className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Strict Tier Isolation</h4>
                  <p className="text-slate-500 mt-1">Official records, crowd reports, and AI predictions are never conflated.</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3">
                <Lock className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Evidence Accountability</h4>
                  <p className="text-slate-500 mt-1">EXIF metadata verification with audited officer sign-offs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
