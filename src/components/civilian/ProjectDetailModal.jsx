import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import {
  Building2,
  Calendar,
  MapPin,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';

export default function ProjectDetailModal({
  isOpen,
  onClose,
  project,
  onGiveFeedback,
  onReportIssue,
}) {
  if (!project) return null;

  const isCompleted =
    project.isCompleted ||
    project.completionStatus === 'Completed' ||
    project.status === 'Completed';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project.projectName || project.name || 'Project Details'}
      subtitle={`${project.ministry || project.implementingAgency || 'Government of India'} • ${project.location || project.district || 'India'}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Top Status & Distance Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-200 rounded text-slate-800">
              #{project.projectId || project.id}
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {isCompleted ? 'Completed' : 'Under Progress'}
            </span>
          </div>

          {project.distanceKm !== undefined && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>{project.distanceKm} km from your location</span>
            </div>
          )}
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3.5 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="text-slate-500 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Sector / Category
            </span>
            <p className="font-semibold text-slate-900 truncate">
              {project.sector || project.category || 'Infrastructure'}
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Jurisdiction State
            </span>
            <p className="font-semibold text-slate-900 truncate">
              {project.state || 'National'}
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Start Date
            </span>
            <p className="font-semibold text-slate-900">
              {project.startDate || '01-Jan-2022'}
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <span className="text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Target / Expected Handover Date
            </span>
            <p className="font-semibold text-slate-900">
              {project.expectedCompletion || project.targetDate || '31-Dec-2027'}
            </p>
          </div>
        </div>

        {/* Public Description */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs text-slate-700 leading-relaxed">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
            Public Infrastructure Scope
          </h4>
          <p>
            Civil infrastructure execution sanctioned under National Infrastructure Pipeline protocols.
            Monitored for on-time delivery, structural quality, and public convenience.
          </p>
        </div>

        {/* Action Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>

          <div className="flex items-center gap-2">
            {onGiveFeedback && (
              <Button
                variant="secondary"
                size="sm"
                icon={MessageSquare}
                onClick={() => {
                  onClose();
                  onGiveFeedback(project);
                }}
              >
                Give Feedback
              </Button>
            )}
            {onReportIssue && (
              <Button
                variant="accent"
                size="sm"
                icon={AlertTriangle}
                onClick={() => {
                  onClose();
                  onReportIssue(project);
                }}
              >
                Report Ground Issue
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
