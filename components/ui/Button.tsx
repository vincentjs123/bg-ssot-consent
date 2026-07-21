'use client';

import React from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'success'
  | 'alert'
  | 'caution';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'bg-btn-primary-bg text-btn-primary-text',
    'hover:bg-btn-primary-bg-hover',
    'active:bg-btn-primary-bg-active',
    'disabled:bg-btn-primary-disabled-bg disabled:text-btn-primary-disabled-text',
  ].join(' '),

  secondary: [
    'bg-btn-secondary-bg text-btn-secondary-text',
    'hover:bg-btn-secondary-bg-hover',
    'active:bg-btn-secondary-bg-active',
    'disabled:bg-btn-secondary-disabled-bg disabled:text-btn-secondary-disabled-text',
  ].join(' '),

  ghost: [
    'bg-btn-ghost-bg text-btn-ghost-text',
    'border border-btn-ghost-border',
    'hover:bg-btn-ghost-bg-hover',
    'active:bg-btn-ghost-bg-active',
    'disabled:text-btn-ghost-disabled-text',
  ].join(' '),

  success: [
    'bg-btn-success-bg text-btn-success-text',
    'hover:bg-btn-success-bg-hover',
    'active:bg-btn-success-bg-active',
    'disabled:opacity-50',
  ].join(' '),

  alert: [
    'bg-btn-alert-bg text-btn-alert-text',
    'hover:bg-btn-alert-bg-hover',
    'active:bg-btn-alert-bg-active',
    'disabled:opacity-50',
  ].join(' '),

  caution: [
    'bg-btn-caution-bg text-btn-caution-text',
    'hover:bg-btn-caution-bg-hover',
    'active:bg-btn-caution-bg-active',
    'disabled:opacity-50',
  ].join(' '),
};

export function Button({
  variant = 'primary',
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      aria-disabled={disabled}
      className={[
        'inline-flex items-center justify-center',
        'h-[var(--control-md)]',
        'px-[var(--padding-md)]',
        'rounded-button',
        'text-style-button',
        'cursor-pointer disabled:cursor-not-allowed',
        'transition-colors duration-150',
        'select-none whitespace-nowrap',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  );
}
