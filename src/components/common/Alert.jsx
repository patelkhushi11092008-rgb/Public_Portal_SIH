import React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertOctagon, X } from 'lucide-react';

export default function Alert({
  variant = 'info',
  title,
  children,
  onDismiss,
  className = '',
}) {
  const configs = {
    info: {
      bg: 'bg-blue-50/80 border-blue-200 text-blue-900',
      iconColor: 'text-blue-600',
      Icon: Info,
    },
    success: {
      bg: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
      iconColor: 'text-emerald-600',
      Icon: CheckCircle2,
    },
    warning: {
      bg: 'bg-amber-50/80 border-amber-200 text-amber-900',
      iconColor: 'text-amber-600',
      Icon: AlertTriangle,
    },
    error: {
      bg: 'bg-rose-50/80 border-rose-200 text-rose-900',
      iconColor: 'text-rose-600',
      Icon: AlertOctagon,
    },
  };

  const current = configs[variant] || configs.info;
  const Icon = current.Icon;

  return (
    <div
      role="alert"
      className={`relative flex items-start gap-3 rounded-lg border p-4 text-sm ${current.bg} ${className}`}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${current.iconColor}`} />
      <div className="flex-1">
        {title && <h4 className="font-semibold text-sm mb-0.5">{title}</h4>}
        <div className="text-xs leading-relaxed opacity-90">{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="rounded p-1 text-slate-400 hover:text-slate-700 hover:bg-black/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
