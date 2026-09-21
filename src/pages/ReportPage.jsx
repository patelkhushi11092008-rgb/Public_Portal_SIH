import React, { useState } from 'react';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Select from '../components/common/Select';
import Alert from '../components/common/Alert';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { Camera, MapPin, UploadCloud, Info, CheckCircle2 } from 'lucide-react';

export default function ReportPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="pb-16">
      <PageHeader
        title="Submit Ground Observation"
        subtitle="Share on-site evidence, upload field photographs, and verify public project execution."
        breadcrumbs={[{ label: 'Submit Observation' }]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        <Alert variant="info" title="Citizen Ground Witnessing Protocol">
          This form establishes the foundation for citizen field reporting. Automated AI analysis and verification workflows via <strong>AAROHAN</strong> will be enabled in future stages.
        </Alert>

        {submitted ? (
          <div className="p-8 bg-white border border-emerald-300 rounded-xl shadow-sm text-center space-y-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Observation Submitted Successfully (Demo)
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your report has been received in the JanNirikshan staging queue. In production, this observation will be forwarded to the AAROHAN AI triage pipeline for cross-referencing.
            </p>
            <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
              Submit Another Observation
            </Button>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Ground Observation Submission Form</CardTitle>
              <span className="text-xs text-slate-500">Tier 2 Citizen Submission</span>
            </CardHeader>
            <CardContent className="space-y-5">
              <Select
                label="Target Infrastructure Project"
                placeholder="Choose Project..."
                options={[
                  { value: 'p1', label: 'Sector 62 Elevated Corridor & Underpass' },
                  { value: 'p2', label: 'Trunk Stormwater Drainage Channel Revamp' },
                  { value: 'p3', label: 'District Multi-Specialty Hospital 200-Bed Block' },
                ]}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Observation Date & Time"
                  type="datetime-local"
                  defaultValue="2025-02-20T10:30"
                  required
                />
                <Input
                  label="Field Location / Landmark"
                  placeholder="e.g. Near Pillar 18, Opp. Gate 3"
                  icon={MapPin}
                  required
                />
              </div>

              {/* Photo Upload Zone (UI Foundation) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Upload Site Photograph Evidence
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer bg-slate-50/50">
                  <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <span className="text-sm font-semibold text-blue-700 block">
                    Click to select photo or drag and drop
                  </span>
                  <span className="text-xs text-slate-500 mt-1 block">
                    JPEG, PNG up to 15MB • Geotag EXIF data preserved
                  </span>
                </div>
              </div>

              <Textarea
                label="Ground Reality Observations & Details"
                placeholder="Describe what you observed: Is work active? How many workers? Is traffic blocked? Are safety barricades in place?"
                rows={4}
                required
              />

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Submissions are public under open civic data guidelines.
                </span>
                <Button
                  variant="accent"
                  size="md"
                  onClick={() => setSubmitted(true)}
                >
                  Submit Observation
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
