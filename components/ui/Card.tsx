import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={[
        'bg-bg-surface',
        'border border-border-subtle',
        'rounded-card',
        'shadow-card',
        'p-[var(--padding-lg)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
