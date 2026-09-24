import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Building2,
  CheckCircle2,
  Clock,
  Compass,
  Filter,
  Search,
  MessageSquare,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  User,
  Plus,
  RefreshCw,
  ExternalLink,
  SlidersHorizontal,
  FileText,
  Camera,
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Alert from '../components/common/Alert';
import Badge from '../components/common/Badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/common/Card';
import { useCivilianAuth } from '../context/CivilianAuthContext';
import { getNearbyProjects, getMyFeedback, getMyIssues } from '../services/civilianApi';
import CivilianProjectMap from '../components/map/CivilianProjectMap';
import FeedbackModal from '../components/civilian/FeedbackModal';
import IssueReportModal from '../components/civilian/IssueReportModal';
import ProjectDetailModal from '../components/civilian/ProjectDetailModal';

const RADIUS_OPTIONS = [10, 25, 50, 100];

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

export default function CivilianDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useCivilianAuth();

  // If not authenticated, redirect to login
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Dashboard View State
  const [activeTab, setActiveTab] = useState('ongoing'); // 'ongoing', 'completed', 'map', 'my-activity'
  const [radiusKm, setRadiusKm] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');

  // Data State
  const [nearbyData, setNearbyData] = useState({
    totalProjectsFound: 0,
    ongoingCount: 0,
    completedCount: 0,
    ongoingProjects: [],
    completedProjects: [],
    allProjects: [],
  });
  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const [myIssues, setMyIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState('');

  // Modal State
  const [activeModalProject, setActiveModalProject] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Fetch nearby projects and activity
  const loadDashboardData = async () => {
    if (!user) return;
    setFetchError('');
    try {
      const lat = user.latitude || 23.0225;
      const lng = user.longitude || 72.5714;

      const [projectsRes, feedbackRes, issuesRes] = await Promise.all([
        getNearbyProjects({
          lat,
          lng,
          radius_km: radiusKm,
          search: searchTerm,
          sector: selectedSector,
        }),
        getMyFeedback().catch(() => []),
        getMyIssues().catch(() => []),
      ]);

      setNearbyData(projectsRes);
      setMyFeedbacks(feedbackRes);
      setMyIssues(issuesRes);
    } catch (err) {
      console.error('Failed to load civilian dashboard data:', err);
      setFetchError('Unable to load nearby infrastructure projects. Please ensure DRISHTI backend is active.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, radiusKm, searchTerm, selectedSector]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  // Modal Triggers
  const openFeedback = (project) => {
    setActiveModalProject(project);
    setShowFeedbackModal(true);
  };

  const openIssue = (project) => {
    setActiveModalProject(project);
    setShowIssueModal(true);
  };

  const openDetail = (project) => {
    setActiveModalProject(project);
    setShowDetailModal(true);
  };

  if (authLoading || (!user && loading)) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Loading JanNirikshan Civilian Portal...</p>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Civilian Greeting & Location Bar */}
      <PageHeader
        title={`Welcome, ${user?.fullName || 'Citizen'}`}
        subtitle={`Public Infrastructure Transparency Portal • ${user?.district || 'Your City'}, ${user?.state || 'India'}`}
        breadcrumbs={[{ label: 'Civilian Dashboard' }]}
        badge={
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-100 text-blue-900 border border-blue-300 px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            Verified Civilian Profile
          </span>
        }
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              isLoading={refreshing}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
            <Link to="/profile">
              <Button variant="secondary" size="sm" icon={User}>
                My Profile
              </Button>
            </Link>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Neighborhood Discovery Banner */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-xl shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                Geographic Discovery Active
              </span>
            </div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              {user?.district}, {user?.state} • {user?.pincode}
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Monitoring public works within <strong>{radiusKm} KM radius</strong> calculated using backend Haversine geospatial coordinates ({user?.latitude?.toFixed(4)}° N, {user?.longitude?.toFixed(4)}° E).
            </p>
          </div>

          {/* Quick Radius Selector */}
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700 space-y-1.5 shrink-0">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wide">
              Search Radius:
            </span>
            <div className="flex items-center gap-1.5">
              {RADIUS_OPTIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRadiusKm(r)}
                  className={`px-2.5 py-1 text-xs font-bold rounded transition-all ${
                    radiusKm === r
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-700/70 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {r} KM
                </button>
              ))}
            </div>
          </div>
        </div>

        {fetchError && (
          <Alert variant="error">
            <div className="flex items-center justify-between">
              <span>{fetchError}</span>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                Retry
              </Button>
            </div>
          </Alert>
        )}

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => setActiveTab('ongoing')}
            className={`p-4 bg-white border rounded-xl shadow-sm cursor-pointer transition-all ${
              activeTab === 'ongoing' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ongoing Works</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{nearbyData.ongoingCount}</span>
              <span className="text-xs text-slate-500">within {radiusKm} km</span>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('completed')}
            className={`p-4 bg-white border rounded-xl shadow-sm cursor-pointer transition-all ${
              activeTab === 'completed' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Completed Assets</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{nearbyData.completedCount}</span>
              <span className="text-xs text-slate-500">within {radiusKm} km</span>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('my-activity')}
            className={`p-4 bg-white border rounded-xl shadow-sm cursor-pointer transition-all ${
              activeTab === 'my-activity' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">My Feedback</span>
              <MessageSquare className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{myFeedbacks.length}</span>
              <span className="text-xs text-slate-500">submitted</span>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('my-activity')}
            className={`p-4 bg-white border rounded-xl shadow-sm cursor-pointer transition-all ${
              activeTab === 'my-activity' ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Reported Issues</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{myIssues.length}</span>
              <span className="text-xs text-slate-500">tracked live</span>
            </div>
          </div>
        </div>

        {/* Tab Controls & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-2 bg-white border border-slate-200 rounded-xl shadow-sm">
          {/* Main Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setActiveTab('ongoing')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'ongoing'
                  ? 'bg-amber-100 text-amber-900 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Ongoing Projects ({nearbyData.ongoingCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'completed'
                  ? 'bg-emerald-100 text-emerald-900 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Completed Projects ({nearbyData.completedCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('map')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'map'
                  ? 'bg-blue-600 text-white font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Interactive Map ({nearbyData.totalProjectsFound})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('my-activity')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'my-activity'
                  ? 'bg-slate-900 text-white font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              My Activity ({myFeedbacks.length + myIssues.length})
            </button>
          </div>

          {/* Quick Search & Sector Filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-48">
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
              className="py-1.5 px-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 max-w-[130px]"
            >
              {SECTORS.map((s) => (
                <option key={s} value={s}>{s === 'ALL' ? 'All Sectors' : s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* TAB CONTENT: ONGOING PROJECTS */}
        {activeTab === 'ongoing' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                Showing <strong>{nearbyData.ongoingProjects.length}</strong> ongoing projects within {radiusKm} km of {user?.district}
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('map')}
                className="text-blue-700 font-semibold hover:underline flex items-center gap-1"
              >
                <Compass className="w-3.5 h-3.5" />
                View on Geospatial Map
              </button>
            </div>

            {nearbyData.ongoingProjects.length === 0 ? (
              <div className="p-12 text-center bg-white border border-slate-200 rounded-xl space-y-3">
                <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No Ongoing Projects in {radiusKm} km Radius</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try widening your search radius to 50 km or 100 km, or check the Completed Projects tab.
                </p>
                <Button variant="outline" size="sm" onClick={() => setRadiusKm(50)}>
                  Expand to 50 KM
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyData.ongoingProjects.map((project) => (
                  <Card key={project.projectId} variant="interactive" className="flex flex-col justify-between">
                    <div>
                      <CardHeader>
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                          #{project.projectId}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                          Ongoing
                        </span>
                      </CardHeader>
                      <CardContent className="space-y-3.5">
                        <div>
                          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wide block">
                            {project.sector}
                          </span>
                          <CardTitle className="line-clamp-2 mt-0.5">
                            {project.projectName}
                          </CardTitle>
                        </div>

                        {/* Distance Badge */}
                        <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{project.distanceKm} km from you</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Physical Progress:</span>
                            <strong className="text-slate-900">{project.physicalProgress}%</strong>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-amber-500 rounded-full"
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
                            <span className="text-slate-400">Target Handover:</span>
                            <span className="font-medium text-slate-800">{project.targetDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Agency:</span>
                            <span className="text-slate-700 truncate max-w-[170px]">{project.implementingAgency}</span>
                          </div>
                        </div>
                      </CardContent>
                    </div>

                    <CardFooter className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openFeedback(project)}
                          className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors text-xs font-semibold flex items-center gap-1"
                          title="Give Feedback"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                          <span>Feedback</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openIssue(project)}
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
                        onClick={() => openDetail(project)}
                      >
                        Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: COMPLETED PROJECTS */}
        {activeTab === 'completed' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                Showing <strong>{nearbyData.completedProjects.length}</strong> completed assets delivered within {radiusKm} km
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('map')}
                className="text-blue-700 font-semibold hover:underline flex items-center gap-1"
              >
                <Compass className="w-3.5 h-3.5" />
                View on Geospatial Map
              </button>
            </div>

            {nearbyData.completedProjects.length === 0 ? (
              <div className="p-12 text-center bg-white border border-slate-200 rounded-xl space-y-3">
                <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No Completed Projects Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Completed infrastructure within {radiusKm} km will be listed here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyData.completedProjects.map((project) => (
                  <Card key={project.projectId} variant="interactive" className="flex flex-col justify-between border-emerald-100">
                    <div>
                      <CardHeader>
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                          #{project.projectId}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          Completed
                        </span>
                      </CardHeader>
                      <CardContent className="space-y-3.5">
                        <div>
                          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide block">
                            {project.sector}
                          </span>
                          <CardTitle className="line-clamp-2 mt-0.5">
                            {project.projectName}
                          </CardTitle>
                        </div>

                        {/* Distance Badge */}
                        <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{project.distanceKm} km from you</span>
                        </div>

                        <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Total Sanctioned:</span>
                            <span className="font-semibold text-slate-800">{project.budget}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Handover Date:</span>
                            <span className="font-medium text-slate-800">{project.targetDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Delivered By:</span>
                            <span className="text-slate-700 truncate max-w-[170px]">{project.implementingAgency}</span>
                          </div>
                        </div>
                      </CardContent>
                    </div>

                    <CardFooter className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => openFeedback(project)}
                        className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors text-xs font-semibold flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                        <span>Public Review</span>
                      </button>

                      <Button
                        variant="ghost"
                        size="sm"
                        icon={ArrowRight}
                        iconPosition="right"
                        onClick={() => openDetail(project)}
                      >
                        Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: INTERACTIVE MAP */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-700 shrink-0" />
                <span>
                  Interactive map showing your location (blue pin) and projects within <strong>{radiusKm} km</strong>. Click any marker to view metrics, feedback, and issue reporting.
                </span>
              </span>
              <span className="font-mono text-blue-800 font-bold shrink-0">
                {nearbyData.totalProjectsFound} Map Markers
              </span>
            </div>

            <CivilianProjectMap
              civilianCoords={{ latitude: user?.latitude, longitude: user?.longitude }}
              projects={nearbyData.allProjects}
              radiusKm={radiusKm}
              onSelectProject={openDetail}
              onGiveFeedback={openFeedback}
              onReportIssue={openIssue}
              height="580px"
            />
          </div>
        )}

        {/* TAB CONTENT: MY ACTIVITY (FEEDBACK & REPORTED ISSUES) */}
        {activeTab === 'my-activity' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* My Feedbacks Panel */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  My Submitted Feedback ({myFeedbacks.length})
                </h3>
              </div>

              {myFeedbacks.length === 0 ? (
                <div className="p-8 text-center bg-white border border-slate-200 rounded-xl space-y-2">
                  <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-600">You haven't submitted any project feedback yet.</p>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('ongoing')}>
                    Browse Nearby Projects
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myFeedbacks.map((fb) => (
                    <div key={fb.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate max-w-[240px]">
                          {fb.projectName}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {fb.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{fb.feedbackText}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                        <span>Rating: <strong className="text-amber-600">{fb.rating ? `${fb.rating}/5` : 'General'}</strong></span>
                        <span>{new Date(fb.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Reported Issues Panel */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  My Reported Ground Issues ({myIssues.length})
                </h3>
              </div>

              {myIssues.length === 0 ? (
                <div className="p-8 text-center bg-white border border-slate-200 rounded-xl space-y-2">
                  <AlertTriangle className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-600">No issues reported under your account.</p>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('ongoing')}>
                    Explore Nearby Projects
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myIssues.map((issue) => (
                    <div key={issue.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-bold">
                            #{issue.id}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                            {issue.projectName}
                          </h4>
                        </div>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          issue.status === 'Resolved' || issue.status === 'Closed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : issue.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {issue.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">{issue.description}</p>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-100">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-500" />
                          {issue.locationName}
                        </span>
                        <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* POPUP MODALS */}
      {activeModalProject && (
        <>
          <FeedbackModal
            isOpen={showFeedbackModal}
            onClose={() => setShowFeedbackModal(false)}
            project={activeModalProject}
            onSuccess={loadDashboardData}
          />

          <IssueReportModal
            isOpen={showIssueModal}
            onClose={() => setShowIssueModal(false)}
            project={activeModalProject}
            onSuccess={loadDashboardData}
          />

          <ProjectDetailModal
            isOpen={showDetailModal}
            onClose={() => setShowDetailModal(false)}
            project={activeModalProject}
            onGiveFeedback={openFeedback}
            onReportIssue={openIssue}
          />
        </>
      )}
    </div>
  );
}

