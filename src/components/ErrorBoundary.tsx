import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-5 text-center font-sans">
                    <h2 className="text-red-600">Something went wrong</h2>
                    <p>We're sorry, but something unexpected happened.</p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="px-5 py-2.5 bg-blue-500 text-white border-none rounded cursor-pointer hover:bg-blue-600 transition-colors"
                    >
                        Try again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
