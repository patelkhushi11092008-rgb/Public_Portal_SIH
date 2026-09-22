import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import EmptyState from '../components/common/EmptyState';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import ProjectStatusBadge from '../components/status/ProjectStatusBadge';
import DataTierCard from '../components/status/DataTierCard';
import { MOCK_PROJECTS, MOCK_FOUR_TIER_SAMPLE } from '../constants/mockData';
import { ArrowLeft, Camera, Users, Shield, Plus } from 'lucide-react';
import { useObservations } from '../context/ObservationContext';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const project = MOCK_PROJECTS.find((p) => p.id === id) || MOCK_PROJECTS[0];
  const { getObservationsByProjectId } = useObservations();

  const projectObservations = getObservationsByProjectId(project.id);

  return (
    <div className="pb-16">
      <PageHeader
        title={project.name}
        subtitle={`${project.authority} • ${project.location}`}
        badge={<ProjectStatusBadge status={project.status} size="md" />}
        breadcrumbs={[
          { label: 'Projects', path: '/projects' },
          { label: project.id },
        ]}
        action={
          <div className="flex gap-2">
            <Link to="/projects">
              <Button variant="outline" size="sm" icon={ArrowLeft}>
                Back to Projects
              </Button>
            </Link>
            <Link to={`/report?project=${project.id}`}>
              <Button variant="accent" size="sm" icon={Camera}>
                Add Ground Observation
              </Button>
            </Link>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Overview & Scope</CardTitle>
                <span className="font-mono text-xs text-slate-500">{project.id}</span>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                <p>
                  Execution of civil infrastructure project comprising structural foundations, civil works, and public transit connectivity sanctioned under the Urban Modernization Scheme.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block">Sanctioned Cost</span>
                    <strong className="text-slate-900 text-sm">{project.budget}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Sanction Date</span>
                    <strong className="text-slate-900 text-sm">{project.sanctionDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Target Handover</span>
                    <strong className="text-slate-900 text-sm">{project.targetDate}</strong>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information Tiers for this Project */}
            <div className="space-y-6">
              {/* Tier 1: Official Department Record */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Tier 1 • Officially Published Department Record
                </h3>
                <DataTierCard tier="OFFICIAL" data={MOCK_FOUR_TIER_SAMPLE.official} />
              </div>

              {/* Tier 2: Citizen Observations */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-amber-600" />
                      Tier 2 • Citizen Ground Reality Observations ({projectObservations.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Real-time crowd-sourced field submissions staged for AAROHAN analysis.
                    </p>
                  </div>
                  <Link to={`/report?project=${project.id}`}>
                    <Button variant="accent" size="sm" icon={Plus}>
                      Submit Observation
                    </Button>
                  </Link>
                </div>

                {projectObservations.length > 0 ? (
                  <div className="space-y-4">
                    {projectObservations.map((obs) => (
                      <DataTierCard key={obs.id} tier="CITIZEN" data={obs} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Users}
                    title="No Citizen Observations Yet"
                    description="Be the first local resident or commuter to submit on-site photographs and report real ground progress."
                    actionLabel="Submit First Observation"
                    onAction={() => window.location.assign(`/report?project=${project.id}`)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Platform Sync & Meta */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AAROHAN Sync Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Backend Pipeline:</span>
                  <span className="font-semibold text-slate-900">AAROHAN AI Suite</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>System Boundary:</span>
                  <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Internal Non-Public
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Ground Feeds Staged:</span>
                  <span className="font-mono text-blue-700 font-bold">
                    {projectObservations.length} Reports
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last Synchronization:</span>
                  <span className="font-mono text-slate-500">Live Active Queue</span>
                </div>
                <p className="pt-2 text-[11px] text-slate-500 leading-relaxed border-t border-slate-100">
                  JanNirikshan streams citizen photographic evidence into AAROHAN's automated vision core to flag discrepancies with contractor invoices.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Civic Audit Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Ward Jurisdiction:</span>
                  <span className="font-medium text-slate-800">{project.ward}</span>
                </div>
                <div className="flex justify-between">
                  <span>Official Progress:</span>
                  <span className="font-bold text-blue-700">{project.progressPercent}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Community Corroboration:</span>
                  <span className="font-semibold text-emerald-700">92% High Match</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
