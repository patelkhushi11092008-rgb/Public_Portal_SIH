import React from 'react';
import { Loader2 } from 'lucide-react';

export function Spinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <Loader2
      className={`animate-spin text-blue-600 ${sizeClasses[size] || sizeClasses.md} ${className}`}
    />
  );
}

export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded bg-slate-200/80 ${className}`}
      aria-hidden="true"
    />
  );
}

export function LoadingCard() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  );
}

export default function LoadingState({
  message = 'Loading official data...',
  description,
  rows = 3,
}) {
  return (
    <div className="p-8 text-center bg-white rounded-lg border border-slate-200 shadow-sm">
      <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-3">
        <Spinner size="lg" />
      </div>
      <h4 className="text-sm font-semibold text-slate-800">{message}</h4>
      {description && (
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">{description}</p>
      )}
      <div className="mt-6 max-w-md mx-auto space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full" />
        ))}
      </div>
    </div>
  );
}
