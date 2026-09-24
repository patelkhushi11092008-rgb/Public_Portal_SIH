import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import EmptyState from '../components/common/EmptyState';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import {
  ArrowLeft,
  Camera,
  Users,
  Shield,
  Plus,
  Building2,
  Calendar,
  IndianRupee,
  MapPin,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useCivilianAuth } from '../context/CivilianAuthContext';
import { getProjectDetail } from '../services/civilianApi';
import FeedbackModal from '../components/civilian/FeedbackModal';
import IssueReportModal from '../components/civilian/IssueReportModal';
import { MOCK_PROJECTS } from '../constants/mockData';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { user } = useCivilianAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showIssue, setShowIssue] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const lat = user?.latitude || null;
        const lng = user?.longitude || null;
        const data = await getProjectDetail(id, lat, lng);
        setProject(data);
      } catch (err) {
        console.warn('Could not load from DRISHTI backend, trying fallback mock data:', err);
        const fallback = MOCK_PROJECTS.find((p) => p.id === id) || {
          projectId: id,
          projectName: `Public Infrastructure Project #${id}`,
          sector: 'Urban Infrastructure',
          ministry: 'National Infrastructure Agency',
          implementingAgency: 'Department of Public Works',
          state: user?.state || 'Gujarat',
          district: user?.district || 'Ahmedabad',
          location: `${user?.district || 'Ahmedabad'} Region`,
          status: 'Under Progress',
          physicalProgress: 65,
          budget: '₹85.00 Cr',
          startDate: '10-Jan-2023',
          expectedCompletion: '30-Oct-2026',
        };
        setProject(fallback);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, user]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-2">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500">Retrieving project record...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <Alert variant="warning">Project #{id} could not be located in the public repository.</Alert>
        <Link to="/projects">
          <Button variant="outline" size="sm">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  const isCompleted =
    project.isCompleted ||
    project.completionStatus === 'Completed' ||
    project.status === 'Completed' ||
    project.physicalProgress >= 99.5;

  return (
    <div className="pb-20">
      <PageHeader
        title={project.projectName || project.name}
        subtitle={`${project.ministry || project.implementingAgency || 'Government of India'} • ${project.location || project.district}`}
        badge={
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            {isCompleted ? 'Completed' : 'Under Progress'}
          </span>
        }
        breadcrumbs={[
          { label: 'Projects', path: '/projects' },
          { label: `#${project.projectId || id}` },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Link to="/projects">
              <Button variant="outline" size="sm" icon={ArrowLeft}>
                Back
              </Button>
            </Link>
            <Button variant="secondary" size="sm" icon={MessageSquare} onClick={() => setShowFeedback(true)}>
              Give Feedback
            </Button>
            <Button variant="accent" size="sm" icon={AlertTriangle} onClick={() => setShowIssue(true)}>
              Report Issue
            </Button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle>Project Overview & Key Metrics</CardTitle>
                <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  #{project.projectId || id}
                </span>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.distanceKm !== undefined && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2 text-xs font-semibold text-blue-900">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>Calculated distance: <strong>{project.distanceKm} km from your residential center</strong></span>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 font-semibold">Physical Progress</span>
                    <strong className="text-blue-700 font-bold">{project.physicalProgress || 0}%</strong>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(100, project.physicalProgress || 0)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block">Sanctioned Cost</span>
                    <strong className="text-slate-900 text-sm">{project.budget || `₹${project.originalCostCr} Cr`}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Start Date</span>
                    <strong className="text-slate-900 text-sm">{project.startDate || '01-Jan-2022'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Target DOC</span>
                    <strong className="text-slate-900 text-sm">{project.expectedCompletion || project.targetDate || '31-Dec-2027'}</strong>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scope */}
            <Card>
              <CardHeader>
                <CardTitle>Civilian Transparency Charter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-slate-700 leading-relaxed">
                <p>
                  JanNirikshan connects directly with DRISHTI AI to provide transparent milestone updates for this infrastructure project. Citizens can post ground observations, photo evidence, and service reviews.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button variant="secondary" size="sm" icon={MessageSquare} onClick={() => setShowFeedback(true)}>
                    Submit Feedback on this Project
                  </Button>
                  <Button variant="accent" size="sm" icon={AlertTriangle} onClick={() => setShowIssue(true)}>
                    Report Construction / Safety Issue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Meta Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Implementing Authority</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Ministry:</span>
                  <span className="font-semibold text-slate-900 truncate max-w-[170px]">{project.ministry}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sector:</span>
                  <span className="font-medium text-slate-800">{project.sector}</span>
                </div>
                <div className="flex justify-between">
                  <span>State:</span>
                  <span className="font-medium text-slate-800">{project.state}</span>
                </div>
                <div className="flex justify-between">
                  <span>District:</span>
                  <span className="font-medium text-slate-800">{project.district}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        project={project}
      />

      <IssueReportModal
        isOpen={showIssue}
        onClose={() => setShowIssue(false)}
        project={project}
      />
    </div>
  );
}
