'use client';

import React, { useId } from 'react';

export type InputState = 'default' | 'error' | 'success';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id'> {
  id?: string;
  label?: string;
  helpText?: string;
  state?: InputState;
}

export function Input({
  id,
  label,
  helpText,
  state = 'default',
  required,
  disabled,
  className = '',
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helpTextId = helpText ? `${inputId}-helptext` : undefined;

  return (
    <div
      className="flex flex-col"
      style={{ gap: 'var(--gap-xs)' }}
    >
      {label && (
        <label htmlFor={inputId} className="text-style-label">
          {label}
          {required && (
            <span className="text-input-label-required" aria-hidden="true">
              {' *'}
            </span>
          )}
        </label>
      )}

      <input
        {...props}
        id={inputId}
        disabled={disabled}
        required={required}
        aria-required={required ? 'true' : undefined}
        aria-invalid={state === 'error' ? 'true' : undefined}
        aria-describedby={helpTextId}
        className={[
          'input-field',
          state === 'success' ? 'input-success' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      />

      {helpText && (
        <p
          id={helpTextId}
          className={[
            'text-style-caption',
            state === 'error' ? 'text-input-helptext-error' : '',
            state === 'success' ? 'text-input-helptext-success' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {helpText}
        </p>
      )}
    </div>
  );
}
