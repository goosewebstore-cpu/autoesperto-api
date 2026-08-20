'use client';

import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
}

export default class ReportErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('ReportErrorBoundary caught:', error);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="mt-5 rounded-2xl p-6 border border-amber-200 bg-amber-50 text-center">
          <AlertTriangle className="h-6 w-6 text-amber-600 mx-auto mb-3" />
          <h2 className="text-sm font-bold text-amber-900">Qualcosa è andato storto nel report</h2>
          <p className="mt-1 text-xs text-amber-800">Riprova l&apos;analisi o inserisci marca e modello manualmente.</p>
          {this.props.onRetry && (
            <button
              type="button"
              onClick={() => { this.setState({ hasError: false }); this.props.onRetry!(); }}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 transition-colors"
            >
              Riprova
            </button>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
