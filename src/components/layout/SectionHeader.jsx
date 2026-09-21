import React from 'react';

export default function SectionHeader({
  title,
  subtitle,
  action,
  tag,
  className = '',
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-slate-200 mb-6 ${className}`}>
      <div>
        {tag && (
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 mb-1 block">
            {tag}
          </span>
        )}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
