import React from 'react';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/common/Card';
import ProjectStatusBadge from '../components/status/ProjectStatusBadge';
import { MOCK_PROJECTS } from '../constants/mockData';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProjectsPage() {
  return (
    <div className="pb-16">
      <PageHeader
        title="Public Infrastructure Projects"
        subtitle="Explore municipal tenders, active construction, and ground-verified public works across all wards."
        breadcrumbs={[{ label: 'Projects' }]}
        action={
          <Link to="/report">
            <Button variant="accent" size="sm">
              Submit Ground Report
            </Button>
          </Link>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>Showing sample projects connected with the <strong>AAROHAN</strong> project registry.</span>
          </div>
          <span className="text-xs font-semibold text-slate-700">
            5 Projects Registered (Placeholder View)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PROJECTS.map((project) => (
            <Card key={project.id} variant="interactive" className="flex flex-col justify-between">
              <div>
                <CardHeader>
                  <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {project.id}
                  </span>
                  <ProjectStatusBadge status={project.status} size="sm" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <span className="text-xs font-medium text-blue-700 uppercase tracking-wide block">
                    {project.category}
                  </span>
                  <CardTitle>{project.name}</CardTitle>
                  <div className="text-xs text-slate-600 space-y-1">
                    <div>Budget: <strong className="text-slate-800">{project.budget}</strong></div>
                    <div>Target: <span className="font-medium text-slate-800">{project.targetDate}</span></div>
                    <div>Authority: <span className="text-slate-700">{project.authority}</span></div>
                  </div>
                </CardContent>
              </div>
              <CardFooter>
                <span className="text-xs text-slate-500">{project.observationsCount} Observations</span>
                <Link to={`/project/${project.id}`}>
                  <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                    View Project
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
