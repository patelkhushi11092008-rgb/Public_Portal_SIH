import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Camera,
  MapPin,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Trash2,
  Compass,
  Building2,
  Users,
  Cpu,
  Shield,
  FileCheck,
  ChevronDown,
  ExternalLink,
  Plus,
  RefreshCw,
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Select from '../components/common/Select';
import Alert from '../components/common/Alert';
import Badge from '../components/common/Badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/common/Card';
import ProjectStatusBadge from '../components/status/ProjectStatusBadge';
import ObservationStatusBadge from '../components/status/ObservationStatusBadge';
import DataTierCard from '../components/status/DataTierCard';
import { MOCK_PROJECTS } from '../constants/mockData';
import { useObservations } from '../context/ObservationContext';

const OBSERVATION_CATEGORIES = [
  { value: 'Work Inactivity / Delay', label: 'Work Inactivity / Idle Site' },
  { value: 'Safety Hazard / Barrier Defect', label: 'Safety Hazard / Damaged Barricade' },
  { value: 'Active Construction Progress', label: 'Active Construction Progress' },
  { value: 'Structural / Quality Issue', label: 'Structural / Quality Concern' },
  { value: 'Traffic & Public Obstruction', label: 'Traffic & Public Pedestrian Obstruction' },
  { value: 'Milestone Claim Verification', label: 'Milestone Claim Ground Verification' },
];

const WORK_STATUS_OPTIONS = [
  { value: 'WORK_STOPPED', label: 'Work Stopped / Idle Site (No active labor)' },
  { value: 'DELAYED', label: 'Behind Schedule / Minimal Activity' },
  { value: 'ACTIVE', label: 'Active Construction (Workers & machinery present)' },
  { value: 'COMPLETED', label: 'Work Completed / Handed Over' },
];

const LABOR_ESTIMATE_OPTIONS = [
  '0 workers (Site idle)',
  '1 - 5 workers (Minimal crew)',
  '6 - 20 workers (Moderate activity)',
  '20+ workers (Full workforce)',
];

const MACHINERY_OPTIONS = [
  'Hydraulic Crane',
  'Earth Excavator / JCB',
  'Transit Cement Mixer',
  'Road Paver / Roller',
  'Scaffolding / Shuttering',
  'No active machinery present',
];

const SAMPLE_DEMO_IMAGES = [
  {
    name: 'ground_evidence_pillar18.jpg',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=600&q=80',
    caption: 'Unoccupied crane and broken safety netting observed near site perimeter.',
    size: '2.1 MB',
  },
  {
    name: 'drainage_culvert_work.jpg',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
    caption: 'Pre-cast concrete sections placed alongside excavation trench.',
    size: '1.9 MB',
  },
];

export default function ReportPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { observations, addObservation } = useObservations();

  const preselectedProjectId = searchParams.get('project') || '';

  // Form State
  const [selectedProjectId, setSelectedProjectId] = useState(preselectedProjectId || MOCK_PROJECTS[0].id);
  const [category, setCategory] = useState(OBSERVATION_CATEGORIES[0].value);
  const [observedWorkStatus, setObservedWorkStatus] = useState('WORK_STOPPED');
  const [locationName, setLocationName] = useState('');
  const [observationTime, setObservationTime] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  });
  const [description, setDescription] = useState('');
  const [workerCountEstimate, setWorkerCountEstimate] = useState(LABOR_ESTIMATE_OPTIONS[0]);
  const [selectedMachinery, setSelectedMachinery] = useState(['Earth Excavator / JCB']);
  const [reporterType, setReporterType] = useState('Local Resident');
  const [reporterName, setReporterName] = useState('');

  // Geolocation State
  const [coords, setCoords] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');

  // Photographic Evidence State
  const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef(null);

  // Validation and Submission State
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEntry, setSubmittedEntry] = useState(null);
  const [showAarohanPayload, setShowAarohanPayload] = useState(false);

  // Selected project metadata
  const currentProject = MOCK_PROJECTS.find((p) => p.id === selectedProjectId) || MOCK_PROJECTS[0];

  // Auto-fill project landmark if empty
  useEffect(() => {
    if (!locationName && currentProject) {
      setLocationName(currentProject.location);
    }
  }, [currentProject]);

  // Handle URL param changes
  useEffect(() => {
    if (preselectedProjectId && MOCK_PROJECTS.some((p) => p.id === preselectedProjectId)) {
      setSelectedProjectId(preselectedProjectId);
    }
  }, [preselectedProjectId]);

  // Geolocation handler
  const handleDetectLocation = () => {
    setGeoLoading(true);
    setGeoError('');

    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      setGeoLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const detected = {
          latitude: parseFloat(position.coords.latitude.toFixed(4)),
          longitude: parseFloat(position.coords.longitude.toFixed(4)),
          accuracy: `±${Math.round(position.coords.accuracy)}m`,
        };
        setCoords(detected);
        setGeoLoading(false);
      },
      (error) => {
        let msg = 'Unable to retrieve location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission denied. Please enter landmark manually or use site coordinates.';
        }
        setGeoError(msg);
        setGeoLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleUseSiteCoordinates = () => {
    // Representative coordinates for the selected project
    const siteCoords = {
      latitude: 28.6280,
      longitude: 77.3670,
      accuracy: '±5m (Project Cadastral Landmark)',
    };
    setCoords(siteCoords);
    setGeoError('');
  };

  // Photo handlers
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = 3 - photos.length;
    const filesToAdd = files.slice(0, remainingSlots);

    filesToAdd.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 10MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotos((prev) => [
          ...prev,
          {
            url: event.target.result,
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            caption: '',
            uploadedAt: new Date().toLocaleTimeString(),
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddDemoPhoto = () => {
    if (photos.length >= 3) {
      alert('Maximum 3 photos permitted per observation.');
      return;
    }
    const sample = SAMPLE_DEMO_IMAGES[photos.length % SAMPLE_DEMO_IMAGES.length];
    setPhotos((prev) => [
      ...prev,
      {
        ...sample,
        uploadedAt: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const handleRemovePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateCaption = (index, caption) => {
    setPhotos((prev) =>
      prev.map((photo, i) => (i === index ? { ...photo, caption } : photo))
    );
  };

  const handleToggleMachinery = (item) => {
    setSelectedMachinery((prev) =>
      prev.includes(item) ? prev.filter((m) => m !== item) : [...prev, item]
    );
  };

  // Form Validation & Submission
  const validateForm = () => {
    const errs = {};
    if (!selectedProjectId) errs.project = 'Please select a project';
    if (!locationName.trim()) errs.location = 'Please specify the on-ground landmark or location';
    if (!description.trim()) {
      errs.description = 'Please describe your ground observation';
    } else if (description.trim().length < 20) {
      errs.description = `Observation description must be at least 20 characters (current: ${description.trim().length})`;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const finalCoords = coords || {
        latitude: 28.6280,
        longitude: 77.3670,
        accuracy: '±15m (Landmark Geo-estimated)',
      };

      const newRecord = addObservation({
        projectId: currentProject.id,
        projectName: currentProject.name,
        category,
        observedWorkStatus,
        location: locationName,
        coordinates: finalCoords,
        description,
        workerCountEstimate,
        machineryPresent: selectedMachinery,
        photos,
        reporterType,
        reporterName,
      });

      setSubmittedEntry(newRecord);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  const handleResetForm = () => {
    setSubmittedEntry(null);
    setDescription('');
    setPhotos([]);
    setCoords(null);
    setErrors({});
    setShowAarohanPayload(false);
  };

  return (
    <div className="pb-20">
      <PageHeader
        title="Submit Ground Observation"
        subtitle="Share on-site reality, upload photographic evidence, and provide transparent ground truth for public infrastructure projects."
        breadcrumbs={[{ label: 'Submit Observation' }]}
        badge={
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
            <Users className="w-3.5 h-3.5 text-amber-700" />
            Tier 2 Ground Truth Module
          </span>
        }
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Civic Protocol Banner */}
        <div className="bg-slate-900 text-slate-200 rounded-xl p-4 sm:p-5 border border-slate-800 shadow-sm flex flex-col sm:flex-row items-start gap-3.5">
          <div className="p-2 rounded-lg bg-blue-900/60 text-blue-300 border border-blue-700/50 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                Citizen Reporting & AAROHAN Pipeline Protocol
              </h3>
              <span className="font-mono text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800">
                Connected with AAROHAN
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Observations submitted here form the citizen reality feed. Verified reports are automatically
              structured and transferred to our internal <strong>AAROHAN</strong> AI monitoring engine
              to trigger municipal field audits.
            </p>
          </div>
        </div>

        {/* SUCCESS CONFIRMATION VIEW */}
        {submittedEntry ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-8 bg-white border-2 border-emerald-400 rounded-xl shadow-civic-md text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Observation Submitted & Staged Successfully
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  Reference: {submittedEntry.id}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Assigned Pipeline Key:{' '}
                  <span className="font-mono text-slate-700 font-semibold">
                    {submittedEntry.aarohanPipelineId}
                  </span>
                </p>
              </div>

              <div className="max-w-xl mx-auto p-4 bg-emerald-50/70 border border-emerald-200 rounded-lg text-left text-xs text-slate-700 space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-emerald-200/80">
                  <span className="text-slate-500">Project:</span>
                  <strong className="text-slate-900">{submittedEntry.projectName}</strong>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-emerald-200/80">
                  <span className="text-slate-500">Observation Category:</span>
                  <span className="font-medium text-slate-800">{submittedEntry.category}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-emerald-200/80">
                  <span className="text-slate-500">Observed Reality Status:</span>
                  <span className="font-semibold text-amber-800">{submittedEntry.observedWorkStatus}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Evidence Attached:</span>
                  <span className="font-semibold text-slate-800">
                    {submittedEntry.photos.length} photograph(s) • Geotagged ({submittedEntry.coordinates.latitude}°, {submittedEntry.coordinates.longitude}°)
                  </span>
                </div>
              </div>

              {/* AAROHAN PAYLOAD INSPECTOR */}
              <div className="pt-2 max-w-xl mx-auto text-left">
                <button
                  type="button"
                  onClick={() => setShowAarohanPayload(!showAarohanPayload)}
                  className="w-full flex items-center justify-between p-3 bg-slate-900 text-slate-200 rounded-lg hover:bg-slate-800 transition-colors text-xs font-medium cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    <span>Inspect AAROHAN Data Ingestion Payload</span>
                  </span>
                  <span className="font-mono text-[11px] text-blue-300">
                    {showAarohanPayload ? 'Hide JSON [-]' : 'View Schema [+]'}
                  </span>
                </button>

                {showAarohanPayload && (
                  <div className="mt-2 p-3.5 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-lg border border-slate-800 overflow-x-auto leading-relaxed shadow-inner">
                    <div className="text-slate-500 mb-1">
                      // Structured civic ingestion payload prepared for AAROHAN AI Core
                    </div>
                    <pre>{JSON.stringify(submittedEntry.aarohanPayload, null, 2)}</pre>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <Button variant="outline" size="md" onClick={handleResetForm} icon={Plus}>
                  Submit Another Ground Report
                </Button>
                <Link to={`/project/${submittedEntry.projectId}`}>
                  <Button variant="primary" size="md" icon={ExternalLink} iconPosition="right">
                    View on Project Page
                  </Button>
                </Link>
              </div>
            </div>

            {/* Render newly submitted observation as a Tier 2 card */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Your Submitted Ground Record (Tier 2 Preview)
              </h3>
              <DataTierCard tier="CITIZEN" data={submittedEntry} />
            </div>
          </div>
        ) : (
          /* MAIN CITIZEN REPORTING FORM */
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* STEP 1: TARGET PROJECT & STATUS */}
            <Card>
              <CardHeader>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                    Step 1 of 4
                  </span>
                  <CardTitle>Select Public Infrastructure Project</CardTitle>
                </div>
                <Badge variant="blue">Public Registry</Badge>
              </CardHeader>
              <CardContent className="space-y-5">
                <Select
                  label="Target Infrastructure Project"
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  options={MOCK_PROJECTS.map((p) => ({
                    value: p.id,
                    label: `${p.name} [${p.id}] • ${p.ward}`,
                  }))}
                  required
                  error={errors.project}
                  helperText="Choose the ongoing public work you are observing on-site"
                />

                {/* Selected Project Quick Snapshot */}
                {currentProject && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-900">{currentProject.name}</span>
                      <p className="text-slate-500">
                        {currentProject.authority} • Sanctioned Cost: {currentProject.budget}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-slate-500">Official Status:</span>
                      <ProjectStatusBadge status={currentProject.status} size="sm" />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <Select
                    label="Observation Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    options={OBSERVATION_CATEGORIES}
                    required
                    helperText="Primary focus of your ground report"
                  />

                  <Select
                    label="Observed Ground Reality Status"
                    value={observedWorkStatus}
                    onChange={(e) => setObservedWorkStatus(e.target.value)}
                    options={WORK_STATUS_OPTIONS}
                    required
                    helperText="What does the site look like in reality right now?"
                  />
                </div>
              </CardContent>
            </Card>

            {/* STEP 2: PHOTOGRAPHIC EVIDENCE UPLOAD */}
            <Card>
              <CardHeader>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
                    Step 2 of 4
                  </span>
                  <CardTitle>Ground Photographic Evidence</CardTitle>
                </div>
                <span className="text-xs text-slate-500">Up to 3 Photos</span>
              </CardHeader>
              <CardContent className="space-y-5">
                <Alert variant="info">
                  Photographs provide objective ground proof for our verification queue. Please capture clear images showing machinery, construction barriers, or structural condition.
                </Alert>

                {/* Upload dropzone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/20 rounded-xl p-6 text-center transition-colors cursor-pointer bg-slate-50/50"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <span className="text-sm font-semibold text-blue-700 block">
                    Click to select ground photo or drag & drop files
                  </span>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Supports JPG, PNG, WebP up to 10MB each
                  </span>
                </div>

                {/* Quick demo image simulator */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-500">Testing on desktop without camera?</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddDemoPhoto}
                    icon={Camera}
                    disabled={photos.length >= 3}
                  >
                    Attach Sample Site Photo
                  </Button>
                </div>

                {/* Uploaded Photos Thumbnails & Captions */}
                {photos.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                      Attached Evidence ({photos.length} / 3)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {photos.map((photo, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs space-y-2 p-2.5"
                        >
                          <div className="relative aspect-video rounded bg-slate-100 overflow-hidden">
                            <img
                              src={photo.url}
                              alt={`Evidence ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(idx)}
                              className="absolute top-1.5 right-1.5 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded shadow-sm transition-colors cursor-pointer"
                              title="Remove photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-[11px] text-slate-500 flex justify-between">
                            <span className="truncate max-w-[120px] font-mono">{photo.name}</span>
                            <span>{photo.size}</span>
                          </div>
                          <input
                            type="text"
                            placeholder="Add photo caption..."
                            value={photo.caption}
                            onChange={(e) => handleUpdateCaption(idx, e.target.value)}
                            className="w-full text-xs border border-slate-200 rounded px-2 py-1 placeholder-slate-400 focus:outline-none focus:border-blue-600"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* STEP 3: LOCATION & GEOTAG */}
            <Card>
              <CardHeader>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                    Step 3 of 4
                  </span>
                  <CardTitle>Location & Time Verification</CardTitle>
                </div>
                <MapPin className="w-4 h-4 text-amber-600" />
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Observation Date & Time"
                    type="datetime-local"
                    value={observationTime}
                    onChange={(e) => setObservationTime(e.target.value)}
                    required
                    helperText="When did you observe this site condition?"
                  />

                  <Input
                    label="On-Ground Landmark / Pillar / Intersection"
                    placeholder="e.g. Pillar 18, Opp. Metro Gate 3"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    required
                    error={errors.location}
                    helperText="Precise physical position along the project corridor"
                  />
                </div>

                {/* GPS Coordinate Detection Widget */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-blue-700" />
                        Geospatial GPS Coordinate Lock
                      </span>
                      <p className="text-[11px] text-slate-500">
                        EXIF geotags prevent fraudulent submissions and corroborate site proximity.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleDetectLocation}
                        isLoading={geoLoading}
                        icon={Compass}
                      >
                        Detect My Location
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleUseSiteCoordinates}
                      >
                        Use Project Coordinates
                      </Button>
                    </div>
                  </div>

                  {/* Coordinates Display */}
                  {coords ? (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-md flex items-center justify-between text-xs text-emerald-950 font-mono">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        GPS Fixed: {coords.latitude}° N, {coords.longitude}° E
                      </span>
                      <span className="text-emerald-700">{coords.accuracy}</span>
                    </div>
                  ) : geoError ? (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-900 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>{geoError}</span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">
                      No coordinates locked yet. Click "Detect My Location" or "Use Project Coordinates".
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* STEP 4: DETAILED OBSERVATIONS & CONTEXT */}
            <Card>
              <CardHeader>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                    Step 4 of 4
                  </span>
                  <CardTitle>Site Conditions & Ground Observations</CardTitle>
                </div>
                <span className="text-xs text-slate-500">Auditing Details</span>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Labor and Machinery checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                      Approximate Labor Workforce On-Site
                    </label>
                    <div className="space-y-1.5">
                      {LABOR_ESTIMATE_OPTIONS.map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-2 text-xs text-slate-700 p-2 rounded hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="workerCount"
                            checked={workerCountEstimate === opt}
                            onChange={() => setWorkerCountEstimate(opt)}
                            className="text-blue-600 focus:ring-blue-600"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                      Heavy Machinery Observed
                    </label>
                    <div className="space-y-1.5">
                      {MACHINERY_OPTIONS.map((item) => (
                        <label
                          key={item}
                          className="flex items-center gap-2 text-xs text-slate-700 p-1.5 rounded hover:bg-slate-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedMachinery.includes(item)}
                            onChange={() => handleToggleMachinery(item)}
                            className="rounded text-blue-600 focus:ring-blue-600"
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Detailed Description */}
                <div>
                  <Textarea
                    label="Detailed Ground Reality Description"
                    placeholder="Provide specific, factual details: Has concrete work halted? Are safety barricades collapsed? Is traffic blocked? How long has the condition persisted?"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    error={errors.description}
                    helperText="Minimum 20 characters required. Factual observations are prioritized."
                  />
                  <div className="text-right text-[11px] text-slate-400 mt-1">
                    {description.trim().length} characters
                  </div>
                </div>

                {/* Submitter Attribution */}
                <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Citizen Attribution Role"
                    value={reporterType}
                    onChange={(e) => setReporterType(e.target.value)}
                    options={[
                      { value: 'Local Resident', label: 'Local Resident (Living in Ward)' },
                      { value: 'Daily Commuter', label: 'Daily Commuter / Transit User' },
                      { value: 'Civic Auditor', label: 'Civic Auditor / Volunteer' },
                      { value: 'Anonymous Citizen', label: 'Anonymous Contributor' },
                    ]}
                    helperText="Identifies ground perspective context"
                  />

                  <Input
                    label="Your Name or Handle (Optional)"
                    placeholder="e.g. Ramesh K. (or leave blank for anonymous)"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    helperText="Your identity is protected under Civic Transparency Charter"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-500 text-center sm:text-left">
                  Submissions are public under open civic infrastructure monitoring standards.
                </span>
                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  isLoading={isSubmitting}
                  icon={UploadCloud}
                  iconPosition="right"
                >
                  Submit Ground Observation
                </Button>
              </CardFooter>
            </Card>
          </form>
        )}

        {/* RECENT COMMUNITY OBSERVATIONS FEED */}
        <div className="pt-8 border-t border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
                Live Ground Feed
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Recent Citizen Ground Observations
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              {observations.length} Total Submissions Staged
            </span>
          </div>

          <div className="space-y-4">
            {observations.slice(0, 4).map((obs) => (
              <DataTierCard key={obs.id} tier="CITIZEN" data={obs} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
