import React from 'react';
import PageHeader from '../components/layout/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import Alert from '../components/common/Alert';
import { BarChart3, TrendingUp, CheckCircle, ShieldAlert } from 'lucide-react';

export default function TransparencyPage() {
  return (
    <div className="pb-16">
      <PageHeader
        title="Public Transparency & Audit Metrics"
        subtitle="Open metrics on municipal project compliance, contractor accountability, and citizen corroboration rates."
        breadcrumbs={[{ label: 'Transparency' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        <Alert variant="info" title="Open Data Standard (Placeholder Foundation)">
          JanNirikshan operates on public disclosure principles. Statistical aggregations and historical audit logs will be connected with open government data APIs in subsequent phases.
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Audit Discrepancy Rate</CardTitle>
              <ShieldAlert className="w-4 h-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">8.4%</div>
              <p className="text-xs text-slate-500 mt-1">
                Milestones reported complete by contractors that were disputed by ground citizen observations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Resolution Velocity</CardTitle>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700">4.2 Days</div>
              <p className="text-xs text-slate-500 mt-1">
                Average turnaround time for authorized municipal engineers to conduct on-site verification.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Citizen Corroboration</CardTitle>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-700">92.1%</div>
              <p className="text-xs text-slate-500 mt-1">
                Ground observations corroborated by multiple nearby contributors.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
