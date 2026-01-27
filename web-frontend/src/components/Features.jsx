import React from 'react';

export default function Features() {
    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-12">
            {/* Hero Section */}
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-slate-900">Mastering ChemData Visualizer</h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Your comprehensive guide to analyzing chemical equipment data with precision and ease.
                </p>
            </div>

            {/* How it Works Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative group hover:border-primary-200 transition-colors">
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">1</div>
                    <h3 className="mt-4 text-xl font-bold text-slate-800">Upload Data</h3>
                    <p className="mt-2 text-slate-500 text-sm">
                        Simply drag and drop your CSV logs. We support standard equipment log formats with Flowrate, Pressure, and Temperature columns.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative group hover:border-primary-200 transition-colors">
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">2</div>
                    <h3 className="mt-4 text-xl font-bold text-slate-800">Analyze Trends</h3>
                    <p className="mt-2 text-slate-500 text-sm">
                        Auto-generated charts reveal process anomalies. Toggle between Trend lines, Distributions, and Correlation scatters to spot outliers.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative group hover:border-primary-200 transition-colors">
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">3</div>
                    <h3 className="mt-4 text-xl font-bold text-slate-800">Export Reports</h3>
                    <p className="mt-2 text-slate-500 text-sm">
                        Generate professional PDF executive summaries with one click. Perfect for weekly plant status meetings and compliance records.
                    </p>
                </div>
            </div>

            {/* Feature Highlights */}
            <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
                <div className="relative z-10 space-y-8">
                    <div className="space-y-2">
                        <span className="text-primary-400 font-bold tracking-wider uppercase text-sm">Power Features</span>
                        <h2 className="text-2xl font-bold">Why Engineers Love Us</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex gap-4">
                            <div className="p-3 bg-white/10 rounded-lg h-fit">
                                <svg className="w-6 h-6 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">Instant Anomaly Detection</h4>
                                <p className="text-slate-400 text-sm mt-1">Our algorithms automatically flag pressure spikes and flowrate drops that deviate from the norm.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="p-3 bg-white/10 rounded-lg h-fit">
                                <svg className="w-6 h-6 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">Historical Comparison</h4>
                                <p className="text-slate-400 text-sm mt-1">Compare current batches against your global history to ensure consistent production quality.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary-600 rounded-full blur-[100px] opacity-20"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-teal-400 rounded-full blur-[80px] opacity-10"></div>
            </div>
        </div>
    );
}
