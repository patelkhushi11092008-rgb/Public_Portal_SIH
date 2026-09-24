import React, { useState, useRef } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Select from '../common/Select';
import Alert from '../common/Alert';
import {
  AlertTriangle,
  Camera,
  MapPin,
  UploadCloud,
  CheckCircle2,
  Trash2,
  Compass,
  Shield,
} from 'lucide-react';
import { submitCivilianIssue } from '../../services/civilianApi';
import { useCivilianAuth } from '../../context/CivilianAuthContext';

const ISSUE_CATEGORIES = [
  { value: 'Work Quality', label: 'Work Quality / Substandard Construction' },
  { value: 'Safety Concern', label: 'Safety Concern / Missing Barricades' },
  { value: 'Project Delay', label: 'Prolonged Inactivity / Project Delay' },
  { value: 'Damaged Infrastructure', label: 'Damaged Infrastructure / Broken Assets' },
  { value: 'Construction Issue', label: 'Construction Hazard / Traffic Bottleneck' },
  { value: 'Environmental Concern', label: 'Environmental Concern / Dust & Waste' },
  { value: 'Other', label: 'Other Civic Grievance' },
];

export default function IssueReportModal({
  isOpen,
  onClose,
  project,
  onSuccess,
}) {
  const { user } = useCivilianAuth();
  const [category, setCategory] = useState('Work Quality');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState(project?.location || project?.district || '');
  const [coords, setCoords] = useState(
    project?.latitude && project?.longitude
      ? { latitude: project.latitude, longitude: project.longitude }
      : user?.latitude && user?.longitude
      ? { latitude: user.latitude, longitude: user.longitude }
      : null
  );
  const [geoLoading, setGeoLoading] = useState(false);
  const [photoData, setPhotoData] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedIssue, setSubmittedIssue] = useState(null);
  const fileInputRef = useRef(null);

  const handleDetectGPS = () => {
    setGeoLoading(true);
    if (!navigator.geolocation) {
      setError('Geolocation not supported by browser.');
      setGeoLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: parseFloat(pos.coords.latitude.toFixed(4)),
          longitude: parseFloat(pos.coords.longitude.toFixed(4)),
        });
        setGeoLoading(false);
      },
      (err) => {
        setError('Could not lock GPS. Using project baseline coordinates.');
        setGeoLoading(false);
      }
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('Photo must be under 8MB.');
      return;
    }
    setPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoData(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAttachDemoPhoto = () => {
    setPhotoName('site_ground_evidence.jpg');
    setPhotoData('https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=600&q=80');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || description.trim().length < 15) {
      setError('Please provide a detailed description of at least 15 characters.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await submitCivilianIssue({
        project_id: project?.projectId || project?.id,
        project_name: project?.projectName || project?.name,
        category,
        description: description.trim(),
        location_name: locationName.trim() || user?.district || 'Project Site',
        latitude: coords?.latitude || project?.latitude || user?.latitude,
        longitude: coords?.longitude || project?.longitude || user?.longitude,
        photo_path: photoData || null,
        contact_mobile: user?.mobile,
        contact_email: user?.email,
      });

      setSubmittedIssue(res.issue);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to submit issue report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAndReset = () => {
    setSubmittedIssue(null);
    setDescription('');
    setPhotoData('');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseAndReset}
      title="Report a Project Issue"
      subtitle={`Lodge ground reality grievance for: ${project?.projectName || project?.name || 'Public Project'}`}
      maxWidth="max-w-xl"
    >
      {submittedIssue ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Grievance Registered Successfully
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              Issue Reference #{submittedIssue.id}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Current Live Status:{' '}
              <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                {submittedIssue.status}
              </span>
            </p>
          </div>

          <div className="max-w-md mx-auto p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-left text-xs text-slate-700 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Project:</span>
              <strong className="text-slate-900 truncate max-w-[200px]">{submittedIssue.projectName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Category:</span>
              <span className="font-medium text-slate-800">{submittedIssue.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Location:</span>
              <span>{submittedIssue.locationName}</span>
            </div>
          </div>

          <div className="pt-2">
            <Button variant="primary" size="md" onClick={handleCloseAndReset}>
              Done / Return to Dashboard
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert variant="error">{error}</Alert>}

          {/* Project Snapshot */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
            <div className="flex justify-between font-bold text-slate-800">
              <span className="truncate max-w-[280px]">{project?.projectName || project?.name}</span>
              <span className="font-mono text-blue-700">#{project?.projectId || project?.id}</span>
            </div>
            <div className="text-slate-500">
              {project?.sector || project?.category} • {project?.location || project?.district || 'India'}
            </div>
          </div>

          <Select
            label="Issue Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={ISSUE_CATEGORIES}
            required
            helperText="Select the primary nature of the observed ground issue"
          />

          <Textarea
            label="Detailed Issue Description"
            placeholder="Describe what is wrong: e.g. excavated trench left open with no caution boards, concrete cracking, prolonged work halt..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            helperText="Minimum 15 characters required."
          />

          <Input
            label="Location Landmark / Spot along the Project"
            placeholder="e.g. Opposite Gate 2, near Ring Road junction"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            required
            helperText="Specific landmark or spot where the issue is located"
          />

          {/* Location & GPS Coordinate Lock */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-blue-600" />
                GPS Coordinates
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {coords
                  ? `${coords.latitude}° N, ${coords.longitude}° E`
                  : 'No coordinates locked yet'}
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDetectGPS}
              isLoading={geoLoading}
              icon={Compass}
            >
              Lock Current GPS
            </Button>
          </div>

          {/* Photographic Evidence Attachment */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
              Attach Photographic Proof (Optional)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {photoData ? (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <img src={photoData} alt="Proof" className="w-12 h-12 object-cover rounded border border-slate-300" />
                  <span className="text-xs text-slate-700 font-mono truncate max-w-[180px]">{photoName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setPhotoData(''); setPhotoName(''); }}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 p-3 border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/20 rounded-lg text-center text-xs text-blue-700 font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" />
                  Upload Photo
                </button>
                <button
                  type="button"
                  onClick={handleAttachDemoPhoto}
                  className="text-xs text-slate-600 hover:text-slate-900 border border-slate-200 bg-white px-3 py-3 rounded-lg flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Demo Photo
                </button>
              </div>
            )}
          </div>

          {/* Submitter Info */}
          <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-md text-[11px] text-blue-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-700 shrink-0" />
            <span>
              Reported by: <strong>{user?.fullName}</strong> ({user?.mobile ? `******${user.mobile.slice(-4)}` : 'Civilian'})
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" type="button" onClick={handleCloseAndReset} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="accent"
              size="sm"
              type="submit"
              isLoading={isSubmitting}
              icon={AlertTriangle}
              iconPosition="right"
            >
              Lodge Issue Report
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

