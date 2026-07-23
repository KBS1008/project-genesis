'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/presentation/primitives/Button';

type PresentationErrorBoundaryProps = {
  readonly children: ReactNode;
};

type PresentationErrorBoundaryState = {
  readonly hasError: boolean;
  readonly message: string;
};

/** Catches render errors in presentation screens and shows a recovery panel. */
export class PresentationErrorBoundary extends Component<
  PresentationErrorBoundaryProps,
  PresentationErrorBoundaryState
> {
  public constructor(props: PresentationErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  public static getDerivedStateFromError(error: Error): PresentationErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'Die Oberfläche konnte nicht dargestellt werden.',
    };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[PresentationErrorBoundary]', error, errorInfo.componentStack);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, message: '' });
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="pg-error-boundary" role="alert">
          <h1 className="pg-error-boundary-title">Anzeigefehler</h1>
          <p className="pg-error-boundary-message">{this.state.message}</p>
          <Button variant="secondary" onClick={this.handleRetry}>
            Erneut versuchen
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
