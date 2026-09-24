import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Select from '../common/Select';
import Alert from '../common/Alert';
import { Star, MessageSquare, CheckCircle2, ShieldCheck } from 'lucide-react';
import { submitCivilianFeedback } from '../../services/civilianApi';
import { useCivilianAuth } from '../../context/CivilianAuthContext';

const FEEDBACK_CATEGORIES = [
  { value: 'Progress Update', label: 'Progress Update' },
  { value: 'Quality', label: 'Quality of Construction & Materials' },
  { value: 'Public Impact', label: 'Public Impact & Commuter Experience' },
  { value: 'Accessibility', label: 'Accessibility & Safety Standards' },
  { value: 'General Feedback', label: 'General Civic Feedback' },
];

export default function FeedbackModal({
  isOpen,
  onClose,
  project,
  onSuccess,
}) {
  const { user } = useCivilianAuth();
  const [category, setCategory] = useState('Progress Update');
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim() || feedbackText.trim().length < 10) {
      setError('Please provide feedback details of at least 10 characters.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await submitCivilianFeedback({
        project_id: project?.projectId || project?.id,
        project_name: project?.projectName || project?.name,
        category,
        rating,
        feedback_text: feedbackText.trim(),
      });

      setSubmittedSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSubmittedSuccess(false);
        setFeedbackText('');
        onClose();
      }, 1600);
    } catch (err) {
      setError(err.message || 'Failed to submit feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Give Civilian Feedback"
      subtitle={`Public project review for: ${project?.projectName || project?.name || 'Public Project'}`}
      maxWidth="max-w-lg"
    >
      {submittedSuccess ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Feedback Submitted Successfully
          </h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            Your feedback has been submitted successfully and permanently linked with project #{project?.projectId || project?.id}.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert variant="error">{error}</Alert>}

          {/* Project Details Banner */}
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
            label="Feedback Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={FEEDBACK_CATEGORIES}
            required
            helperText="What aspect of this infrastructure are you commenting on?"
          />

          {/* Star Rating Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
              Overall Experience / Quality Rating (1 - 5 Stars)
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-slate-300 hover:text-amber-400 focus:outline-none transition-colors cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-slate-700 ml-2">
                {rating === 5 ? '5/5 (Excellent)' : rating === 4 ? '4/5 (Good)' : rating === 3 ? '3/5 (Average)' : rating === 2 ? '2/5 (Needs Improvement)' : '1/5 (Poor)'}
              </span>
            </div>
          </div>

          <Textarea
            label="Your Feedback / Ground Observations"
            placeholder="Share observations regarding pace, workmanship, traffic handling, or public convenience..."
            rows={4}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            required
            helperText="Minimum 10 characters required. Factual constructive feedback is valued."
          />

          <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-md text-[11px] text-blue-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
            <span>Submitted from authenticated profile: <strong>{user?.fullName || user?.username}</strong></span>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="ghost" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="accent"
              size="sm"
              type="submit"
              isLoading={isSubmitting}
              icon={MessageSquare}
              iconPosition="right"
            >
              Submit Feedback
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

