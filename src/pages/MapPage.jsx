import React from 'react';
import PageHeader from '../components/layout/PageHeader';
import { Card, CardContent } from '../components/common/Card';
import Alert from '../components/common/Alert';
import { MapPin, Layers, Navigation, Compass } from 'lucide-react';
import Button from '../components/common/Button';
import { MOCK_PROJECTS } from '../constants/mockData';
import ProjectStatusBadge from '../components/status/ProjectStatusBadge';

export default function MapPage() {
  return (
    <div className="pb-16">
      <PageHeader
        title="Infrastructure Geospatial Map"
        subtitle="Live map tracking public projects, ground observation geotags, and regional progress indicators."
        breadcrumbs={[{ label: 'Map' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        <Alert variant="info" title="Geospatial Map Foundation">
          The map engine and GIS layer integration will be connected in future milestones. This foundation establishes the spatial layout and municipal overlay structure.
        </Alert>

        {/* Map placeholder canvas */}
        <div className="relative rounded-xl border-2 border-dashed border-slate-300 bg-slate-100/80 h-96 flex flex-col items-center justify-center text-center p-6 overflow-hidden">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0b192c_1px,transparent_1px)] [background-size:20px_20px]" />

          <div className="relative z-10 space-y-3 max-w-md">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 text-blue-700 mx-auto">
              <Compass className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              Interactive Map Module Placeholder
            </h3>
            <p className="text-xs text-slate-500">
              Geographic coordinates, GIS boundaries for 89 Municipal Wards, and real-time observation pins will render here.
            </p>
          </div>
        </div>

        {/* Quick Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {MOCK_PROJECTS.slice(0, 3).map((p) => (
            <div key={p.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800">{p.ward}</span>
                <ProjectStatusBadge status={p.status} size="sm" />
              </div>
              <p className="text-xs text-slate-600 font-medium truncate">{p.name}</p>
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <MapPin className="w-3 h-3 text-amber-500" />
                <span>{p.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
