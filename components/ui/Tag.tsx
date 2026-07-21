import React from 'react';

export type TagVariant = 'default' | 'accent';

export interface TagProps {
  variant?: TagVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<TagVariant, string> = {
  default: 'bg-tag-default-bg text-tag-default-text',
  accent: 'bg-tag-accent-bg text-tag-accent-text',
};

export function Tag({ variant = 'default', children, className = '' }: TagProps) {
  return (
    <span
      className={[
        'inline-flex items-center',
        'rounded-[var(--radius-sm)]',
        'py-[var(--spacing-1)] px-[var(--spacing-2)]',
        'text-style-badge',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}
