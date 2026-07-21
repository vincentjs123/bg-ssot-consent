import React from 'react';

export type BadgeVariant = 'info' | 'success' | 'caution' | 'alert';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantBgClass: Record<BadgeVariant, string> = {
  info: 'bg-badge-info-bg',
  success: 'bg-badge-success-bg',
  caution: 'bg-badge-caution-bg',
  alert: 'bg-badge-alert-bg',
};

export function Badge({ variant = 'info', children, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center',
        'rounded-pill',
        'py-[var(--spacing-1)] px-[var(--spacing-3)]',
        'text-text-primary',
        'text-style-badge',
        variantBgClass[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}
