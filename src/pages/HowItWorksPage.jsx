import React from 'react';
import PageHeader from '../components/layout/PageHeader';
import { Card, CardContent } from '../components/common/Card';
import { Search, Camera, Cpu, ShieldCheck, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';

export default function HowItWorksPage() {
  const steps = [
    {
      step: '01',
      icon: Search,
      title: 'Find Infrastructure Near You',
      desc: 'Look up ongoing roads, bridges, drains, and schools sanctioned in your municipal ward.',
      tier: 'Public Directory',
    },
    {
      step: '02',
      icon: Camera,
      title: 'Record Ground Reality',
      desc: 'Take photographs and submit factual observations: Is the road blocked? Is work active? Are workers present?',
      tier: 'Citizen Observation',
    },
    {
      step: '03',
      icon: Cpu,
      title: 'AI Ingestion & Analysis',
      desc: 'Submitted evidence is processed by our computer vision pipeline and cross-checked against project timelines.',
      tier: 'AI-Assisted Assessment',
    },
    {
      step: '04',
      icon: ShieldCheck,
      title: 'AAROHAN Sync & Human Audit',
      desc: 'Validated reports are routed to AAROHAN, triggering designated municipal field officers to conduct authorized inspections.',
      tier: 'Authorized Verification',
    },
  ];

  return (
    <div className="pb-16">
      <PageHeader
        title="How JanNirikshan Works"
        subtitle="The civic lifecycle of an infrastructure observation: from citizen camera to official engineer verification."
        breadcrumbs={[{ label: 'How It Works' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.step} className="p-6 relative">
                <span className="font-mono text-3xl font-black text-slate-200 block mb-2">
                  {item.step}
                </span>
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block mb-2">
                  {item.tier}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </Card>
            );
          })}
        </div>

        <div className="bg-slate-900 text-white rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">Ready to Inspect Your Neighborhood?</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Anyone can contribute. Help make your city's public works transparent, timely, and accountable.
            </p>
          </div>
          <Link to="/report">
            <Button variant="accent" size="lg" icon={ArrowRight} iconPosition="right">
              Submit Your First Observation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
