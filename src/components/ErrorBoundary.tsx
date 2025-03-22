
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  name?: string; // Add a name prop for better error tracking
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number; // Track error count
  lastErrorTime: number; // Track when errors occur
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
      lastErrorTime: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to console with component name if available
    const componentName = this.props.name || 'UnnamedComponent';
    console.error(`Error caught by ErrorBoundary in ${componentName}:`, error);
    console.error('Component stack:', errorInfo.componentStack);
    
    // Update error tracking state
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
      lastErrorTime: Date.now()
    }));
  }

  resetErrorBoundary = (): void => {
    // Call the onReset prop if provided
    this.props.onReset?.();
    
    // Reset the error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Render custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="p-4 rounded-md border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 my-4">
          <div className="flex items-center mb-3">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <h3 className="font-semibold">Something went wrong</h3>
          </div>
          
          <p className="text-sm mb-4">
            We've encountered an error in {this.props.name || 'this component'}. Try refreshing the page or clicking the button below to reset.
          </p>
          
          {this.state.error && (
            <div className="mb-4 p-3 bg-white dark:bg-black/20 rounded text-xs overflow-auto max-h-[150px]">
              <p className="font-mono">{this.state.error.toString()}</p>
              {this.state.errorInfo && (
                <pre className="mt-2 text-xs text-red-600 dark:text-red-400">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                Error count: {this.state.errorCount}
              </p>
            </div>
          )}
          
          <button
            onClick={this.resetErrorBoundary}
            className="flex items-center px-3 py-2 text-sm bg-red-100 dark:bg-red-800/30 hover:bg-red-200 dark:hover:bg-red-800/50 text-red-800 dark:text-red-300 rounded-md transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Component
          </button>
        </div>
      );
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
