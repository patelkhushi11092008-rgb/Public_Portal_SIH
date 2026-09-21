import React from 'react';
import { PROJECT_STATUSES } from '../../constants/statuses';
import { Activity, Clock, AlertOctagon, CircleDashed, CheckCircle2 } from 'lucide-react';

const ICONS = {
  ACTIVE: Activity,
  DELAYED: Clock,
  WORK_STOPPED: AlertOctagon,
  NOT_STARTED: CircleDashed,
  COMPLETED: CheckCircle2,
};

export default function ProjectStatusBadge({
  status,
  size = 'md',
  showIcon = true,
  className = '',
}) {
  const statusKey = String(status || '').toUpperCase();
  const config = PROJECT_STATUSES[statusKey] || PROJECT_STATUSES.NOT_STARTED;
  const IconComponent = ICONS[statusKey] || CircleDashed;

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border shadow-2xs ${config.bgClass} ${sizeStyles[size] || sizeStyles.md} ${className}`}
      title={config.description}
    >
      {showIcon ? (
        <IconComponent className="w-3.5 h-3.5 shrink-0" />
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass} shrink-0`} />
      )}
      <span>{config.label}</span>
    </span>
  );
}
