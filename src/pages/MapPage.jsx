import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import { MapPin, Compass, RefreshCw, SlidersHorizontal, Building2, CheckCircle2 } from 'lucide-react';
import { useCivilianAuth } from '../context/CivilianAuthContext';
import { getNearbyProjects } from '../services/civilianApi';
import CivilianProjectMap from '../components/map/CivilianProjectMap';
import FeedbackModal from '../components/civilian/FeedbackModal';
import IssueReportModal from '../components/civilian/IssueReportModal';
import ProjectDetailModal from '../components/civilian/ProjectDetailModal';

export default function MapPage() {
  const { user, isAuthenticated } = useCivilianAuth();
  const [radiusKm, setRadiusKm] = useState(isAuthenticated ? 50 : 250);
  const [projectsData, setProjectsData] = useState({
    allProjects: [],
    ongoingCount: 0,
    completedCount: 0,
    totalProjectsFound: 0,
  });
  const [loading, setLoading] = useState(true);

  // Modals
  const [activeProject, setActiveProject] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showIssue, setShowIssue] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const loadMapData = async () => {
    setLoading(true);
    try {
      const lat = user?.latitude || 23.0225;
      const lng = user?.longitude || 72.5714;
      const data = await getNearbyProjects({
        lat,
        lng,
        radius_km: radiusKm,
      });
      setProjectsData(data);
    } catch (err) {
      console.error('Failed to load map data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMapData();
  }, [user, radiusKm]);

  const civilianCoords = {
    latitude: user?.latitude || 23.0225,
    longitude: user?.longitude || 72.5714,
  };

  return (
    <div className="pb-20">
      <PageHeader
        title="Infrastructure Geospatial Map"
        subtitle="Interactive GIS map tracking ongoing works, completed assets, and civilian ground feedback pins."
        breadcrumbs={[{ label: 'Map' }]}
        action={
          <div className="flex items-center gap-2">
            <select
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="py-1.5 px-3 text-xs bg-white border border-slate-300 rounded-lg font-semibold text-slate-700"
            >
              <option value={10}>10 KM Radius</option>
              <option value={25}>25 KM Radius</option>
              <option value={50}>50 KM Radius</option>
              <option value={100}>100 KM Radius</option>
              <option value={250}>250 KM Radius</option>
            </select>
            <Button variant="outline" size="sm" icon={RefreshCw} onClick={loadMapData}>
              Refresh Map
            </Button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Info Banner */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Compass className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Centering on: <strong>{user ? `${user.district}, ${user.state}` : 'Ahmedabad (Default)'}</strong> • Showing projects within <strong>{radiusKm} km</strong>
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Ongoing: <strong>{projectsData.ongoingCount}</strong>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Completed: <strong>{projectsData.completedCount}</strong>
            </span>
          </div>
        </div>

        {/* Live Leaflet Map */}
        <CivilianProjectMap
          civilianCoords={civilianCoords}
          projects={projectsData.allProjects}
          radiusKm={radiusKm}
          onSelectProject={(p) => {
            setActiveProject(p);
            setShowDetail(true);
          }}
          onGiveFeedback={(p) => {
            setActiveProject(p);
            setShowFeedback(true);
          }}
          onReportIssue={(p) => {
            setActiveProject(p);
            setShowIssue(true);
          }}
          height="620px"
        />
      </div>

      {/* POPUP MODALS */}
      {activeProject && (
        <>
          <FeedbackModal
            isOpen={showFeedback}
            onClose={() => setShowFeedback(false)}
            project={activeProject}
            onSuccess={loadMapData}
          />
          <IssueReportModal
            isOpen={showIssue}
            onClose={() => setShowIssue(false)}
            project={activeProject}
            onSuccess={loadMapData}
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
