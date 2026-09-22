import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  Cpu,
  ShieldCheck,
  Search,
  MapPin,
  ArrowRight,
  Eye,
  FileText,
  Camera,
  CheckCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import { BRANDING } from '../constants/navigation';
import { PROJECT_STATUSES, OBSERVATION_STATUSES } from '../constants/statuses';
import { MOCK_PROJECTS, MOCK_FOUR_TIER_SAMPLE } from '../constants/mockData';

// Component Library Imports
import Button from '../components/common/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/common/Card';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Select from '../components/common/Select';
import Modal from '../components/common/Modal';
import Alert from '../components/common/Alert';
import LoadingState, { LoadingCard } from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import ImageContainer from '../components/common/ImageContainer';

import ProjectStatusBadge from '../components/status/ProjectStatusBadge';
import ObservationStatusBadge from '../components/status/ObservationStatusBadge';
import DataTierCard from '../components/status/DataTierCard';
import SectionHeader from '../components/layout/SectionHeader';
import { useObservations } from '../context/ObservationContext';

export default function HomePage() {
  const { observations } = useObservations();

  // Modal demo state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form interactive demo state
  const [sampleInput, setSampleInput] = useState('');
  const [sampleSelect, setSampleSelect] = useState('');
  const [sampleTextarea, setSampleTextarea] = useState('');
  const [showFormError, setShowFormError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active tier tab for testing the 4-tier visual distinction
  const [activeTierTab, setActiveTierTab] = useState('ALL');

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO SECTION */}
      <section className="bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
        {/* Subtle geometric grid background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          <div className="max-w-3xl space-y-6">
            {/* Top Civic pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-700/60 text-blue-200 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Civic-Tech Infrastructure Accountability</span>
              <span className="text-slate-400">|</span>
              <span className="font-mono text-amber-300 text-[11px] font-semibold">
                Connected with AAROHAN
              </span>
            </div>

            {/* Main Branding Header */}
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {BRANDING.name}
              </h1>
              <p className="text-lg sm:text-xl font-medium text-blue-300 mt-1">
                {BRANDING.subtitle}
              </p>
            </div>

            {/* Tagline */}
            <div className="border-l-4 border-amber-500 pl-4 py-1">
              <p className="text-lg sm:text-xl font-semibold text-slate-100 italic">
                "{BRANDING.tagline}"
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              A public digital platform bridging the gap between official government project records
              and real-world citizen observations. Ground reports are analyzed in collaboration with
              our internal <strong>AAROHAN</strong> project monitoring engine for transparent auditing.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/projects">
                <Button variant="primary" size="lg" icon={Search}>
                  Browse Public Projects
                </Button>
              </Link>
              <Link to="/report">
                <Button variant="accent" size="lg" icon={Camera}>
                  Submit Ground Observation
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
                onClick={() => setIsModalOpen(true)}
              >
                Inspect Design System Modal
              </Button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-4">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
                Tracked Projects
              </span>
              <span className="text-2xl font-bold text-white mt-1 block">1,284</span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                • 89 Wards Active
              </span>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-4">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
                Citizen Observations
              </span>
              <span className="text-2xl font-bold text-amber-400 mt-1 block">
                {(9420 + observations.length).toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                {observations.length} active in staging
              </span>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-4">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
                Milestones Corroborated
              </span>
              <span className="text-2xl font-bold text-blue-400 mt-1 block">4,115</span>
              <span className="text-[11px] text-blue-300 mt-0.5 block">Cross-referenced</span>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-4">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
                Internal Audit Sync
              </span>
              <span className="text-base font-bold text-emerald-300 mt-2 block flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                AAROHAN Synced
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Non-public backend</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CRITICAL SECTION: FOUR-TIER VISUAL DISTINCTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <SectionHeader
            tag="Core Architectural Standard"
            title="Four-Tier Information Distinction System"
            subtitle="To prevent public misinformation and ensure strict civic integrity, four distinct data tiers are permanently isolated visually."
          />

          <Alert variant="info" className="mb-6">
            <strong>Mandatory Design Rule:</strong> Official data, citizen crowd observations, AI algorithm assessments, and authorized human verification each have unique visual languages and must never look identical.
          </Alert>

          {/* Tier Selection Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: 'ALL', label: 'View All 4 Tiers Combined' },
              { id: 'OFFICIAL', label: 'Tier 1: Official Department Record' },
              { id: 'CITIZEN', label: 'Tier 2: Citizen Observation' },
              { id: 'AI_ASSESSMENT', label: 'Tier 3: AI-Assisted Assessment' },
              { id: 'AUTHORIZED_VERIFICATION', label: 'Tier 4: Human Authorized Sign-off' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTierTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                  activeTierTab === tab.id
                    ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(activeTierTab === 'ALL' || activeTierTab === 'OFFICIAL') && (
              <div>
                <span className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                  <Building2 className="w-3.5 h-3.5 text-slate-900" />
                  Tier 1: Officially Published Department Record
                </span>
                <DataTierCard tier="OFFICIAL" data={MOCK_FOUR_TIER_SAMPLE.official} />
              </div>
            )}

            {(activeTierTab === 'ALL' || activeTierTab === 'CITIZEN') && (
              <div>
                <span className="text-xs font-bold text-amber-800 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  Tier 2: Citizen Ground Observation
                </span>
                <DataTierCard tier="CITIZEN" data={MOCK_FOUR_TIER_SAMPLE.citizen} />
              </div>
            )}

            {(activeTierTab === 'ALL' || activeTierTab === 'AI_ASSESSMENT') && (
              <div>
                <span className="text-xs font-bold text-indigo-900 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                  <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                  Tier 3: AI Automated Assessment (AAROHAN Engine)
                </span>
                <DataTierCard tier="AI_ASSESSMENT" data={MOCK_FOUR_TIER_SAMPLE.aiAssessment} />
              </div>
            )}

            {(activeTierTab === 'ALL' || activeTierTab === 'AUTHORIZED_VERIFICATION') && (
              <div>
                <span className="text-xs font-bold text-emerald-800 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Tier 4: Authorized Municipal Officer Verification
                </span>
                <DataTierCard tier="AUTHORIZED_VERIFICATION" data={MOCK_FOUR_TIER_SAMPLE.authorizedVerification} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. STATUS SYSTEM SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
          <SectionHeader
            tag="Status Standardization"
            title="Standard Status Architecture"
            subtitle="Clear, color-coded, and accessible badges for project milestones and citizen observation lifecycle."
          />

          {/* Project Statuses */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-700" />
              Public Project Execution Statuses
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.keys(PROJECT_STATUSES).map((key) => {
                const status = PROJECT_STATUSES[key];
                return (
                  <div
                    key={key}
                    className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 flex flex-col justify-between gap-2"
                  >
                    <div>
                      <ProjectStatusBadge status={key} size="md" />
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        {status.description}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                      Color: {status.color}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Citizen Observation Lifecycle */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-600" />
              Citizen Ground Observation Lifecycle
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.keys(OBSERVATION_STATUSES).map((key) => {
                const status = OBSERVATION_STATUSES[key];
                return (
                  <div
                    key={key}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 flex flex-col justify-between gap-2"
                  >
                    <div>
                      <ObservationStatusBadge status={key} size="sm" />
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                        {status.description}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {status.color}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. DESIGN SYSTEM COMPONENT LIBRARY SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-12">
          <SectionHeader
            tag="Design System"
            title="Reusable Component Library"
            subtitle="High-fidelity, accessible, civic-tech UI primitives ready for ongoing feature expansion."
          />

          {/* Buttons & Badges */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              1. Buttons & Badges
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="accent">Amber Accent</Button>
              <Button variant="navy">Navy Authority</Button>
              <Button variant="danger">Warning / Danger</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="primary" isLoading={true}>
                Loading State
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Badge variant="blue" dot={true}>Official Notice</Badge>
              <Badge variant="green" dot={true}>Work Verified</Badge>
              <Badge variant="amber" dot={true}>Milestone Delayed</Badge>
              <Badge variant="red" dot={true}>Site Halted</Badge>
              <Badge variant="indigo" dot={true}>AI Processed</Badge>
              <Badge variant="navy">Civic Council</Badge>
              <Badge variant="neutral">Ward 14-B</Badge>
            </div>
          </div>

          {/* Form Controls */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                2. Form Controls (Inputs, Selects, Textareas)
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFormError(!showFormError)}
              >
                Toggle Form Validation States
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Project Identifier or Keyword"
                placeholder="e.g. Sector 62 Underpass"
                icon={Search}
                value={sampleInput}
                onChange={(e) => setSampleInput(e.target.value)}
                helperText="Search by tender ID, ward, or contractor name"
                error={showFormError ? 'Project identifier not found in registry' : undefined}
              />

              <Select
                label="Municipal Ward / Jurisdiction"
                value={sampleSelect}
                onChange={(e) => setSampleSelect(e.target.value)}
                placeholder="Select Municipal Ward"
                options={[
                  { value: 'w14', label: 'Ward 14-B (Central Transit Zone)' },
                  { value: 'w08', label: 'Ward 08-C (South Drainage Zone)' },
                  { value: 'w19', label: 'Ward 19-A (Civil Lines Health)' },
                  { value: 'w01', label: 'Ward 01-E (East Educational Hub)' },
                ]}
                helperText="Jurisdictional sorting for field officers"
                error={showFormError ? 'Please select a valid municipal ward' : undefined}
              />

              <Input
                label="Observation Geotag (Lat, Long)"
                placeholder="28.6280° N, 77.3670° E"
                icon={MapPin}
                defaultValue="28.6280° N, 77.3670° E"
                helperText="Auto-captured GPS coordinates"
              />
            </div>

            <Textarea
              label="Citizen Ground Reality Observation Notes"
              placeholder="Describe physical progress, machinery present, labor count, obstruction..."
              value={sampleTextarea}
              onChange={(e) => setSampleTextarea(e.target.value)}
              helperText="Ground observations are reviewed by AI and municipal auditors."
              error={showFormError ? 'Detailed description required (minimum 20 characters)' : undefined}
            />
          </div>

          {/* Civic Alerts & Notices */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              3. Civic Alerts & Disclaimers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Alert variant="info" title="Public Record Transparency Notice">
                Official project timelines and financial disbursements are published in real time under the Municipal Infrastructure Transparency Ordinance.
              </Alert>
              <Alert variant="success" title="Milestone Verification Achieved">
                Pier cap structural completion on Sector 62 has been cross-corroborated by 19 citizen reports and certified by Executive Engineer.
              </Alert>
              <Alert variant="warning" title="Timeline Discrepancy Warning">
                Ground observation reports indicate zero machinery present since 5 days, contradicting the contractor's Active claim.
              </Alert>
              <Alert variant="error" title="Work Stop Order Logged">
                Safety compliance breach reported at civil hospital wing. Work suspended under Section 142.
              </Alert>
            </div>
          </div>

          {/* Image & Evidence Containers */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              4. Photographic Evidence Containers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ImageContainer
                src=""
                alt="Flyover Pillar 18 Site"
                locationTag="Ward 14-B (28.628° N)"
                dateTag="Feb 18, 2025"
                caption="Sector 62 Elevated Corridor — Unoccupied crane and missing barrier perimeter."
              />
              <ImageContainer
                src=""
                alt="Stormwater Drain Culvert"
                locationTag="Ward 08-C"
                dateTag="Feb 19, 2025"
                caption="Drainage Channel Revamp — Reinforced pre-cast culvert installation underway."
              />
              <ImageContainer
                src=""
                alt="Hospital Block Structure"
                locationTag="Civil Lines"
                dateTag="Feb 17, 2025"
                caption="Multi-Specialty Hospital Wing — Inactive site entrance, scaffolding idle."
              />
            </div>
          </div>

          {/* Loading & Empty States */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              5. Loading & Empty States
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LoadingState
                message="Retrieving official geospatial project feeds..."
                description="Cross-referencing municipal tenders with citizen observation layer."
              />
              <EmptyState
                title="No Disputed Observations in this Ward"
                description="All citizen observations in Ward 08-C have been corroborated by authorized engineers."
                actionLabel="View Corroborated Records"
                onAction={() => alert('Empty state action clicked')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. SAMPLE INFRASTRUCTURE PROJECTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag="Public Infrastructure Explorer"
          title="Monitored Infrastructure Projects"
          subtitle="Real-world layout demonstration showing how projects render with status indicators, metrics, and progress bars."
          action={
            <Link to="/projects">
              <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                View All Projects
              </Button>
            </Link>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PROJECTS.slice(0, 3).map((project) => (
            <Card key={project.id} variant="interactive" className="flex flex-col justify-between">
              <div>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {project.id}
                    </span>
                    <span className="text-xs text-slate-500 truncate">{project.category}</span>
                  </div>
                  <ProjectStatusBadge status={project.status} size="sm" />
                </CardHeader>

                <CardContent className="space-y-3">
                  <CardTitle className="hover:text-blue-700 transition-colors">
                    {project.name}
                  </CardTitle>

                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Sanctioned Budget:</span>
                      <strong className="text-slate-800 font-semibold">{project.budget}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Target Handover:</span>
                      <span className="font-medium text-slate-800">{project.targetDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Location:</span>
                      <span className="font-medium text-slate-800">{project.ward}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="pt-2">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600">Official Milestone Progress</span>
                      <span className="text-blue-700">{project.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                      <div
                        className={`h-full rounded-full ${
                          project.status === 'WORK_STOPPED'
                            ? 'bg-rose-500'
                            : project.status === 'DELAYED'
                            ? 'bg-amber-500'
                            : 'bg-blue-600'
                        }`}
                        style={{ width: `${project.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Ground Reality Snapshot */}
                  <div className="bg-slate-50 border border-slate-200 rounded p-2.5 text-xs text-slate-600 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-700">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-amber-600" />
                        Citizen Observations:
                      </span>
                      <span className="font-bold">{project.observationsCount} entries</span>
                    </div>
                    <p className="text-[11px] text-slate-500 italic truncate">
                      "{project.latestUpdate}"
                    </p>
                  </div>
                </CardContent>
              </div>

              <CardFooter>
                <span className="text-xs text-slate-500">
                  {project.verifiedCount} observations verified
                </span>
                <Link to="/project/JN-2025-FL-042">
                  <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                    Inspect
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. MODAL DEMO COMPONENT */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="JanNirikshan Design System Modal"
        description="Accessible modal dialog with Escape-key dismiss, backdrop click handler, and focus management."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                alert('Confirmed action in JanNirikshan design system modal.');
                setIsModalOpen(false);
              }}
            >
              Confirm Observation Submission
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs text-slate-700">
          <Alert variant="info" title="Citizen Ground Witnessing Protocol">
            Please ensure ground observations are captured directly from safe, publicly accessible viewpoints. Do not trespass into restricted construction zones.
          </Alert>

          <p className="leading-relaxed">
            Observations submitted through <strong>JanNirikshan</strong> undergo preliminary automated validation before being pushed to <strong>AAROHAN</strong> for authorized municipal engineering inspection.
          </p>

          <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
            <span className="font-semibold text-slate-900 block">Civic Transparency Standards:</span>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
              <li>Time-stamped metadata preservation</li>
              <li>Exif geotag location verification</li>
              <li>Public non-confidential transparency archive</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
}
