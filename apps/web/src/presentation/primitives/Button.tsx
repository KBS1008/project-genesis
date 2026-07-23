'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary';

/** Shared button primitive with focus-visible styles. */
export function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly variant?: ButtonVariant;
  readonly children: ReactNode;
}) {
  const variantClass = variant === 'secondary' ? 'pg-button-secondary' : 'pg-button-primary';

  return (
    <button type="button" className={`pg-button ${variantClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
