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
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
          <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 border border-red-100">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong.</h1>
            <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-auto text-sm font-mono mb-4 h-64">
                <p className="font-bold text-red-400">{this.state.error && this.state.error.toString()}</p>
                <div className="mt-2 opacity-75 whitespace-pre-wrap">
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                </div>
            </div>
            <button 
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
                Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
