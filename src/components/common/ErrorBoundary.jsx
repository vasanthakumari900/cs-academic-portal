import React from "react";
import { FiAlertTriangle, FiRefreshCw, FiHome, FiAlertOctagon } from "react-icons/fi";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Unhandled Error Caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/";
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 py-12">
          <div className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-xl text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-sm border border-red-100">
              <FiAlertOctagon size={32} />
            </div>

            <h2 className="font-sans text-2xl font-extrabold text-[#0F4C81]">
              Something went wrong
            </h2>

            <p className="mt-2 text-xs text-[#6B7280] leading-relaxed">
              An unexpected application error occurred on this page. We've captured the error to prevent a blank screen.
            </p>

            {this.state.error && (
              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-left border border-slate-200/80 overflow-x-auto">
                <p className="text-[11px] font-mono text-red-600 font-medium truncate">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F4C81] px-4 py-3 text-xs font-bold text-white shadow-sm hover:bg-[#1E88E5] transition-all cursor-pointer"
              >
                <FiRefreshCw size={14} /> Refresh Page
              </button>

              <button
                onClick={this.handleReset}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs font-bold text-[#0F4C81] hover:bg-slate-50 transition-all cursor-pointer"
              >
                <FiHome size={14} /> Go to Home
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
