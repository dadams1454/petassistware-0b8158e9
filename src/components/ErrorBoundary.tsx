
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
  consoleError: string; // Store error details for debugging
}

class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutRef: NodeJS.Timeout | null = null;
  
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
      lastErrorTime: 0,
      consoleError: ''
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
    
    // Store error details for debugging
    const errorDetail = `Error in ${componentName}: ${error.message}\n${errorInfo.componentStack}`;
    
    // Update error tracking state
    this.setState(prevState => {
      const newErrorCount = prevState.errorCount + 1;
      
      // Check if this is a repeated error in a short time
      const now = Date.now();
      const isRepeatedError = now - prevState.lastErrorTime < 5000; // 5 seconds
      
      // If we're getting rapid errors, schedule an auto-reset to recover
      if (isRepeatedError && newErrorCount > 3 && !this.resetTimeoutRef) {
        console.log(`Multiple errors detected in ${componentName}, scheduling auto-reset`);
        this.resetTimeoutRef = setTimeout(() => {
          console.log(`Auto-resetting ${componentName} after multiple errors`);
          this.resetErrorBoundary();
          this.resetTimeoutRef = null;
        }, 2000); // Wait 2 seconds before auto-reset
      }
      
      return {
        error,
        errorInfo,
        errorCount: newErrorCount,
        lastErrorTime: now,
        consoleError: `${prevState.consoleError}\n\n${errorDetail}`.trim()
      };
    });
  }
  
  componentWillUnmount() {
    // Clear any pending timeouts
    if (this.resetTimeoutRef) {
      clearTimeout(this.resetTimeoutRef);
      this.resetTimeoutRef = null;
    }
  }

  resetErrorBoundary = (): void => {
    // Call the onReset prop if provided
    if (this.props.onReset) {
      try {
        this.props.onReset();
      } catch (error) {
        console.error('Error in onReset callback:', error);
      }
    }
    
    // Reset the error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      consoleError: ''
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
          
          <div className="mb-4 p-3 bg-white dark:bg-black/20 rounded text-xs overflow-auto max-h-[200px]">
            {this.state.error && (
              <p className="font-mono">{this.state.error.toString()}</p>
            )}
            
            {this.state.errorInfo && (
              <pre className="mt-2 text-xs text-red-600 dark:text-red-400 overflow-x-auto">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
            
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Error count: {this.state.errorCount} | 
              Last error: {new Date(this.state.lastErrorTime).toLocaleTimeString()}
            </p>
          </div>
          
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
