import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import ProjectStatusBadge from '../components/status/ProjectStatusBadge';
import DataTierCard from '../components/status/DataTierCard';
import { MOCK_PROJECTS, MOCK_FOUR_TIER_SAMPLE } from '../constants/mockData';
import { ArrowLeft, Camera, FileText } from 'lucide-react';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const project = MOCK_PROJECTS.find((p) => p.id === id) || MOCK_PROJECTS[0];

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
            <Link to="/report">
              <Button variant="accent" size="sm" icon={Camera}>
                Add Ground Observation
              </Button>
            </Link>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        <Alert variant="info" title="Project Detail Overview (Placeholder Foundation)">
          This page establishes the foundation for deep infrastructure inspection. Full historical timeline, document repository, and citizen submission feeds will be expanded in upcoming steps.
        </Alert>

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

            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3">
                Information Tiers for this Project
              </h3>
              <div className="space-y-4">
                <DataTierCard tier="OFFICIAL" data={MOCK_FOUR_TIER_SAMPLE.official} />
                <DataTierCard tier="CITIZEN" data={MOCK_FOUR_TIER_SAMPLE.citizen} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AAROHAN Sync Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Backend System:</span>
                  <span className="font-semibold text-slate-900">AAROHAN Suite</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Access Level:</span>
                  <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Internal Non-Public
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last Data Refresh:</span>
                  <span className="font-mono text-slate-500">Today, 10:15 AM</span>
                </div>
                <p className="pt-2 text-[11px] text-slate-400 border-t border-slate-100">
                  JanNirikshan streams verified citizen ground observations directly into AAROHAN's field audit pipeline.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
