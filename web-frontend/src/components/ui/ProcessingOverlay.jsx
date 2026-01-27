export default function ProcessingOverlay({ isProcessing, message = "Processing Data..." }) {
    if (!isProcessing) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center">
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-6 animate-in fade-in zoom-in duration-300">
                {/* Scientific Animation */}
                <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-4 border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-4 border-4 border-primary-300 rounded-full border-b-transparent animate-spin-reverse"></div>
                    
                    {/* Center Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-8 h-8 text-primary-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-slate-800">{message}</h3>
                    <p className="text-slate-500 text-sm mt-2">Analyzing molecules and generating insights...</p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-primary-500 h-2 rounded-full animate-progress-indeterminate"></div>
                </div>
            </div>
        </div>
    );
}

// Ensure you have these keyframes in your index.css or tailwind config for 'animate-spin-reverse' and 'animate-progress-indeterminate'
// Usually spin-reverse needs: animation: spin 1s linear infinite reverse;
