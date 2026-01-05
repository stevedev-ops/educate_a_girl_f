import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900 px-4">
                    <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-8 border border-neutral-200 dark:border-neutral-700">
                        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                            <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-4xl">error</span>
                        </div>

                        <h2 className="text-2xl font-bold text-center text-neutral-900 dark:text-white mb-2">
                            {this.props.title || 'Oops! Something went wrong'}
                        </h2>

                        <p className="text-center text-neutral-600 dark:text-neutral-400 mb-6">
                            {this.props.message || 'We encountered an unexpected error. Please try again.'}
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                                <summary className="cursor-pointer font-medium text-red-800 dark:text-red-400">
                                    Error Details (Development Only)
                                </summary>
                                <pre className="mt-2 text-xs text-red-700 dark:text-red-300 overflow-auto">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={this.handleReset}
                                className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="flex-1 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-white px-6 py-3 rounded-lg font-bold hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
