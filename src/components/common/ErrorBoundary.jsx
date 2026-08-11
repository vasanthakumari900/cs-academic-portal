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
        <div className="min-h-screen flex items-center justify-center bg-[#FBF7F2] dark:bg-[#190B13] px-4 py-12">
          <div className="w-full max-w-md rounded-2xl border border-[#F0E2E6]/80 dark:border-white/10 bg-white dark:bg-[#22101A] p-8 shadow-[0_2px_4px_rgba(28,10,16,0.05),0_16px_48px_rgba(28,10,16,0.10)] text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F6E4E8] dark:bg-[#4A1620]/60 text-[#7E2238] dark:text-[#F4C266] shadow-sm border border-[#F0E2E6] dark:border-white/10">
              <FiAlertOctagon size={32} />
            </div>

            <h2 className="font-heading text-2xl font-extrabold text-[#3A101A] dark:text-[#F3E4E8]">
              Something went wrong
            </h2>

            <p className="mt-2 text-sm text-[#7C4B5E] dark:text-[#D9C2CA] leading-relaxed">
              An unexpected application error occurred on this page. We've captured the error to prevent a blank screen.
            </p>

            {this.state.error && (
              <div className="mt-4 rounded-xl bg-[#FBF4F5] dark:bg-[#2E1622] p-3 text-left border border-[#F0E2E6] dark:border-white/10 overflow-x-auto">
                <p className="text-[11px] font-mono text-red-600 dark:text-red-400 font-medium truncate">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#4A1620] hover:bg-[#61182A] px-4 py-3 text-xs font-bold text-white shadow-[0_1px_2px_rgba(28,10,16,0.2),0_4px_14px_rgba(74,22,32,0.3)] transition-all cursor-pointer font-heading"
              >
                <FiRefreshCw size={14} /> Refresh Page
              </button>

              <button
                onClick={this.handleReset}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[#EDC8D0] dark:border-white/15 bg-white dark:bg-[#22101A] px-4 py-3 text-xs font-bold text-[#4A1620] dark:text-[#F3E4E8] hover:bg-[#F6E4E8]/60 dark:hover:bg-white/10 transition-all cursor-pointer"
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
