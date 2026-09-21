import React from 'react';
import { FolderSearch } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  icon: Icon = FolderSearch,
  title = 'No records found',
  description = 'There are no items matching the selected criteria or filter.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`p-10 text-center bg-white rounded-lg border border-dashed border-slate-300 shadow-sm ${className}`}
    >
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-500 mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
