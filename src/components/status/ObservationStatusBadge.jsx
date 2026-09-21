import React from 'react';
import { OBSERVATION_STATUSES } from '../../constants/statuses';
import {
  FileText,
  Cpu,
  Eye,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

const ICONS = {
  SUBMITTED: FileText,
  UNDER_AI_ANALYSIS: Cpu,
  UNDER_REVIEW: Eye,
  CORROBORATED: CheckCircle,
  DISPUTED: AlertCircle,
  VERIFIED: ShieldCheck,
};

export default function ObservationStatusBadge({
  status,
  size = 'md',
  showIcon = true,
  className = '',
}) {
  const statusKey = String(status || '').toUpperCase();
  const config = OBSERVATION_STATUSES[statusKey] || OBSERVATION_STATUSES.SUBMITTED;
  const IconComponent = ICONS[statusKey] || FileText;

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.bgClass} ${sizeStyles[size] || sizeStyles.md} ${className}`}
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
