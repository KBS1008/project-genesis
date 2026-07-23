import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { ApplicationShell } from '@/presentation/shell/ApplicationShell';

/** Renders presentation components inside the production ApplicationShell. */
export function renderPresentation(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  function Wrapper({ children }: { readonly children: ReactNode }) {
    return <ApplicationShell>{children}</ApplicationShell>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}
