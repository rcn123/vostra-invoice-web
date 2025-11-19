import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);
    console.error('Component stack:', errorInfo.componentStack);

    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-white rounded-lg border-2 border-red-300 shadow-lg p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-red-900 mb-2">
                  Något gick fel
                </h1>
                <p className="text-gray-700 mb-4">
                  Ett oväntat fel inträffade. Kontrollera konsolen för mer information.
                </p>

                {/* Error Details */}
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                  <h2 className="text-sm font-semibold text-red-900 mb-2">Felmeddelande:</h2>
                  <pre className="text-sm text-red-800 whitespace-pre-wrap break-words">
                    {this.state.error?.toString()}
                  </pre>
                </div>

                {/* Stack Trace */}
                {this.state.errorInfo && (
                  <details className="mb-4">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                      Visa stack trace (för utvecklare)
                    </summary>
                    <div className="mt-2 bg-gray-100 border border-gray-300 rounded-md p-4 overflow-auto max-h-64">
                      <pre className="text-xs text-gray-800">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  </details>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
                  >
                    Ladda om sidan
                  </button>
                  <button
                    onClick={() => window.location.href = '/demo/invoices'}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium transition-colors"
                  >
                    Tillbaka till fakturor
                  </button>
                </div>

                {/* Debug info */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    <strong>Tips:</strong> Öppna DevTools (F12) och kolla Console-fliken för mer detaljerad information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
