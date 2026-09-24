import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowRight,
  Camera,
  MapPin,
  Building2,
  CheckCircle2,
  MessageSquare,
  AlertTriangle,
  Compass,
  RefreshCw,
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/common/Card';
import { useCivilianAuth } from '../context/CivilianAuthContext';
import { getNearbyProjects } from '../services/civilianApi';
import FeedbackModal from '../components/civilian/FeedbackModal';
import IssueReportModal from '../components/civilian/IssueReportModal';
import ProjectDetailModal from '../components/civilian/ProjectDetailModal';

const SECTORS = [
  'ALL',
  'Road Transport and Highways',
  'Railways',
  'Petroleum',
  'Water Resources',
  'Urban Infrastructure',
  'Power & Energy',
  'Health & Education',
];

export default function ProjectsPage() {
  const { user, isAuthenticated } = useCivilianAuth();

  const [tab, setTab] = useState('ongoing'); // 'ongoing' or 'completed'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [radiusKm, setRadiusKm] = useState(isAuthenticated ? 50 : 250);

  const [projectsData, setProjectsData] = useState({
    ongoingProjects: [],
    completedProjects: [],
    allProjects: [],
    totalProjectsFound: 0,
  });
  const [loading, setLoading] = useState(true);

  // Modals
  const [activeProject, setActiveProject] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showIssue, setShowIssue] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const lat = user?.latitude || 23.0225;
      const lng = user?.longitude || 72.5714;

      const data = await getNearbyProjects({
        lat,
        lng,
        radius_km: radiusKm,
        search: searchTerm,
        sector: selectedSector,
      });

      setProjectsData(data);
    } catch (err) {
      console.error('Failed to load projects from DRISHTI AI:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [user, radiusKm, searchTerm, selectedSector]);

  const displayedProjects =
    tab === 'ongoing' ? projectsData.ongoingProjects : projectsData.completedProjects;

  return (
    <div className="pb-20">
      <PageHeader
        title="Public Infrastructure Projects"
        subtitle="Explore active construction works, tender milestones, and ground-verified public infrastructure projects."
        breadcrumbs={[{ label: 'Projects' }]}
        action={
          <Link to="/report">
            <Button variant="accent" size="sm" icon={Camera}>
              Submit Ground Report
            </Button>
          </Link>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Status / Search Bar */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Tab Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg w-full md:w-auto">
            <button
              type="button"
              onClick={() => setTab('ongoing')}
              className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                tab === 'ongoing'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ongoing Projects ({projectsData.ongoingProjects.length})
            </button>
            <button
              type="button"
              onClick={() => setTab('completed')}
              className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                tab === 'completed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed Assets ({projectsData.completedProjects.length})
            </button>
          </div>

          {/* Search & Sector Filter */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>

            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="py-1.5 px-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
            >
              {SECTORS.map((s) => (
                <option key={s} value={s}>{s === 'ALL' ? 'All Sectors' : s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Location Info Banner */}
        {isAuthenticated && user && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Displaying projects sorted by distance from your location in <strong>{user.district}, {user.state}</strong>.
              </span>
            </div>
            <Link to="/dashboard" className="text-blue-700 font-bold hover:underline shrink-0">
              View 25 km Dashboard →
            </Link>
          </div>
        )}

        {/* Projects Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-2">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Retrieving projects from DRISHTI AI...</p>
          </div>
        ) : displayedProjects.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-xl space-y-3">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No Projects Found Matching Filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search keyword or sector filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProjects.map((project) => {
              const isCompleted = tab === 'completed';
              return (
                <Card key={project.projectId} variant="interactive" className="flex flex-col justify-between">
                  <div>
                    <CardHeader>
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                        #{project.projectId}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {isCompleted ? 'Completed' : 'Ongoing'}
                      </span>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wide block">
                          {project.sector}
                        </span>
                        <CardTitle className="line-clamp-2 mt-0.5">
                          {project.projectName}
                        </CardTitle>
                      </div>

                      {project.distanceKm !== undefined && (
                        <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                          <span>{project.distanceKm} km from you</span>
                        </div>
                      )}

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Physical Progress:</span>
                          <strong className="text-slate-900">{project.physicalProgress}%</strong>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${Math.min(100, project.physicalProgress)}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Budget:</span>
                          <span className="font-semibold text-slate-800">{project.budget}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Target Date:</span>
                          <span className="font-medium text-slate-800">{project.targetDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Location:</span>
                          <span className="text-slate-700 truncate max-w-[170px]">{project.location}</span>
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  <CardFooter className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveProject(project);
                          setShowFeedback(true);
                        }}
                        className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors text-xs font-semibold flex items-center gap-1"
                        title="Give Feedback"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        <span>Feedback</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveProject(project);
                          setShowIssue(true);
                        }}
                        className="p-1.5 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors text-xs font-semibold flex items-center gap-1"
                        title="Report Ground Issue"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Issue</span>
                      </button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      icon={ArrowRight}
                      iconPosition="right"
                      onClick={() => {
                        setActiveProject(project);
                        setShowDetail(true);
                      }}
                    >
                      View
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* POPUP MODALS */}
      {activeProject && (
        <>
          <FeedbackModal
            isOpen={showFeedback}
            onClose={() => setShowFeedback(false)}
            project={activeProject}
            onSuccess={loadProjects}
          />
          <IssueReportModal
            isOpen={showIssue}
            onClose={() => setShowIssue(false)}
            project={activeProject}
            onSuccess={loadProjects}
          />
          <ProjectDetailModal
            isOpen={showDetail}
            onClose={() => setShowDetail(false)}
            project={activeProject}
            onGiveFeedback={(p) => {
              setActiveProject(p);
              setShowFeedback(true);
            }}
            onReportIssue={(p) => {
              setActiveProject(p);
              setShowIssue(true);
            }}
          />
        </>
      )}
    </div>
  );
}
