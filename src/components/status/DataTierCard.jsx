import React from 'react';
import {
  Building2,
  Users,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock,
  FileCheck,
  Sparkles,
} from 'lucide-react';
import ObservationStatusBadge from './ObservationStatusBadge';

export default function DataTierCard({ tier, data, className = '' }) {
  if (tier === 'OFFICIAL') {
    return (
      <div
        className={`rounded-lg border-2 border-slate-700/80 bg-white shadow-sm overflow-hidden ${className}`}
      >
        {/* Tier Header: Formal Civic Navy */}
        <div className="bg-slate-900 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-blue-600 text-white">
              <Building2 className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-blue-200 block">
                Tier 1 • Official Department Record
              </span>
              <h4 className="text-sm font-bold text-white leading-tight">
                {data.title || 'Officially Published Project Record'}
              </h4>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-blue-950 text-blue-200 border border-blue-800 px-2 py-0.5 rounded">
            <FileCheck className="w-3 h-3 text-blue-400" />
            Official State Record
          </span>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3.5">
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
            <span>
              Published By: <strong className="text-slate-800">{data.publishedBy}</strong>
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {data.timestamp}
            </span>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            {data.content}
          </p>

          {data.attributes && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              {data.attributes.map((attr, i) => (
                <div key={i} className="bg-slate-50 border border-slate-200 rounded p-2 text-xs">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                    {attr.label}
                  </span>
                  <span className="text-slate-800 font-medium">{attr.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Seal Footer */}
        <div className="px-5 py-2.5 bg-slate-50 text-[11px] text-slate-600 flex items-center justify-between border-t border-slate-200">
          <span>Official Public Gazetted Disclosure</span>
          <span className="font-mono text-[10px] text-slate-400">
            Ref: {data.referenceNo || 'PWD/OFFICIAL/REC'}
          </span>
        </div>
      </div>
    );
  }

  if (tier === 'CITIZEN') {
    return (
      <div
        className={`rounded-lg border-2 border-amber-300 bg-amber-50/20 shadow-sm overflow-hidden ${className}`}
      >
        {/* Tier Header: Citizen Warm Amber */}
        <div className="bg-amber-100/80 border-b border-amber-200 text-amber-950 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-500 text-white">
              <Users className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-amber-800 block">
                Tier 2 • Citizen Observation
              </span>
              <h4 className="text-sm font-bold text-amber-950 leading-tight">
                {data.title || 'Ground Reality Observation'}
              </h4>
            </div>
          </div>
          {data.observationStatus && (
            <ObservationStatusBadge status={data.observationStatus} size="sm" />
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pb-2 border-b border-amber-100">
            <span>
              Submitted By: <strong className="text-slate-800">{data.submittedBy}</strong>
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {data.timestamp}
            </span>
          </div>

          {data.location && (
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-900 bg-amber-100/60 border border-amber-200/80 px-2.5 py-1 rounded-md">
              <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>{data.location}</span>
            </div>
          )}

          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            {data.content}
          </p>

          {data.photoCaption && (
            <div className="p-2.5 bg-white border border-amber-200 rounded-md text-xs text-slate-600 flex items-start gap-2">
              <span className="text-amber-600 font-semibold text-[11px] shrink-0">Photo Attached:</span>
              <span>{data.photoCaption}</span>
            </div>
          )}
        </div>

        {/* Ground Reality Attribution Notice */}
        <div className="px-5 py-2 bg-amber-50 text-[11px] text-amber-800 flex items-center justify-between border-t border-amber-200">
          <span>Public Field Observation • Pending Human Audit</span>
          <span className="text-[10px] font-medium text-amber-700">Citizen Submission</span>
        </div>
      </div>
    );
  }

  if (tier === 'AI_ASSESSMENT') {
    return (
      <div
        className={`rounded-lg border-2 border-indigo-300 bg-indigo-50/30 shadow-sm overflow-hidden ${className}`}
      >
        {/* Tier Header: AI Machine Indigo */}
        <div className="bg-indigo-900 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-indigo-500 text-white">
              <Cpu className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-300 block flex items-center gap-1">
                Tier 3 • AI-Assisted Assessment
                <Sparkles className="w-3 h-3 text-indigo-300 inline" />
              </span>
              <h4 className="text-sm font-bold text-white leading-tight">
                {data.title || 'Computer Vision & Data Cross-Check'}
              </h4>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-indigo-950 text-indigo-200 border border-indigo-700 px-2 py-0.5 rounded font-mono">
            {data.confidenceScore || '89%'} Confidence
          </span>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pb-2 border-b border-indigo-100">
            <span>
              Engine: <strong className="text-indigo-900 font-mono">{data.modelEngine}</strong>
            </span>
            <span>{data.timestamp}</span>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-indigo-950 uppercase tracking-wide">
              Automated Analytical Detections:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {data.findings?.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-white/80 p-2 rounded border border-indigo-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-2.5 rounded bg-indigo-100/60 border border-indigo-200 text-[11px] text-indigo-900 leading-snug">
            <strong>Platform Notice:</strong> {data.disclaimer}
          </div>
        </div>

        {/* AI Disclaimer Footer */}
        <div className="px-5 py-2 bg-indigo-50 text-[11px] text-indigo-800 flex items-center justify-between border-t border-indigo-200">
          <span>Sent to AAROHAN Internal Monitoring Queue</span>
          <span className="font-mono text-[10px] text-indigo-600">Model Pipeline v2.4</span>
        </div>
      </div>
    );
  }

  if (tier === 'AUTHORIZED_VERIFICATION') {
    return (
      <div
        className={`rounded-lg border-2 border-emerald-500 bg-white shadow-sm overflow-hidden ${className}`}
      >
        {/* Tier Header: Authorized Green */}
        <div className="bg-emerald-700 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-white text-emerald-800">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-100 block">
                Tier 4 • Authorized Verification
              </span>
              <h4 className="text-sm font-bold text-white leading-tight">
                {data.title || 'Human Authorized Field Sign-off'}
              </h4>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-900 text-emerald-100 border border-emerald-600 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            Legally Certified
          </span>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pb-2 border-b border-emerald-100">
            <span>
              Inspecting Officer: <strong className="text-slate-900">{data.verifiedBy}</strong>
            </span>
            <span className="font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
              {data.badgeId}
            </span>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-200 rounded p-2.5 text-xs text-emerald-950 font-medium">
            Verdict: <span className="font-bold text-emerald-900">{data.verdict}</span>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            {data.auditNotes}
          </p>
        </div>

        {/* Signature Footer */}
        <div className="px-5 py-2.5 bg-emerald-50 text-[11px] text-emerald-900 flex items-center justify-between border-t border-emerald-200">
          <span>Municipal Engineer Verified Record</span>
          <span className="font-mono text-[10px] text-emerald-700">
            Sig: {data.signatureRef || 'DIGITAL-SIG-OFFICER'}
          </span>
        </div>
      </div>
    );
  }

  return null;
}
