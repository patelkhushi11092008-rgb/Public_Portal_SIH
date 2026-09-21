import React from 'react';

export function Card({
  children,
  variant = 'default',
  className = '',
  ...props
}) {
  const variantStyles = {
    default: 'bg-white border border-slate-200 shadow-sm rounded-lg',
    elevated: 'bg-white border border-slate-200 shadow-civic-md rounded-lg',
    interactive:
      'bg-white border border-slate-200 hover:border-blue-400 hover:shadow-civic-md transition-all duration-150 rounded-lg cursor-pointer',
    muted: 'bg-slate-50 border border-slate-200 rounded-lg',
  };

  return (
    <div
      className={`overflow-hidden text-slate-800 ${variantStyles[variant] || variantStyles.default} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div
      className={`px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', as = 'h3', ...props }) {
  const Component = as;
  return (
    <Component
      className={`text-base font-semibold text-slate-900 tracking-tight ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p className={`text-xs text-slate-500 mt-0.5 ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div
      className={`px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
