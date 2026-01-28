import React from 'react';

export default function Features() {
    return (
        <div className="min-h-screen bg-slate-50 overflow-x-hidden relative">
             {/* --- Hero Section --- */}
             <div className="relative w-full h-[500px] bg-white overflow-hidden">
                {/* Top Left Curved Shape (Teal) */}
                <div className="absolute top-0 left-0 w-[600px] h-[400px] bg-gradient-to-br from-primary-500 to-primary-600 rounded-br-[100%] z-0 transform -translate-x-[10%] -translate-y-[10%] shadow-xl">
                    <div className="absolute top-12 left-24">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Right Side Content (Graphic) */}
                <div className="absolute top-1/2 right-[10%] transform -translate-y-1/2 z-10 hidden lg:block">
                     <div className="relative w-80 h-80 bg-gradient-to-tr from-amber-400 to-orange-400 rounded-full shadow-2xl flex items-center justify-center animate-pulse-slow">
                        {/* Icon Overlay */}
                        <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                            <svg className="w-40 h-40 text-slate-800 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="text-center text-white font-black leading-none -ml-8">
                             <div className="text-6xl drop-shadow-md">FAST</div>
                             <div className="text-2xl opacity-90 tracking-widest">ANALYSIS</div>
                        </div>
                     </div>
                </div>

                {/* Main Hero Text */}
                <div className="absolute top-[160px] left-[10%] md:left-[30%] z-10 max-w-lg">
                    <p className="text-white/80 md:text-slate-500 uppercase tracking-widest text-sm font-semibold mb-2">Capabilities</p>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-800 leading-tight">
                        <span className="text-white md:text-primary-600 block">Powerful Tools</span>
                        <span className="text-slate-400 md:text-slate-400 text-3xl md:text-4xl font-light block mt-2">For Complex Data</span>
                    </h1>
                     <p className="mt-6 text-slate-600 md:text-slate-500 max-w-md">
                        Discover the suite of features designed to streamline your chemical engineering workflows.
                    </p>
                </div>
            </div>

            {/* Feature Cards Loop */}
            <div className="relative z-20 max-w-6xl mx-auto px-6 -mt-16 mb-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { 
                            title: "Real-time Analytics", 
                            desc: "Instant visualization of flow, pressure, and temperature metrics.",
                            icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                            color: "text-primary-500", bg: "bg-primary-50"
                        },
                        { 
                            title: "Secure Storage", 
                            desc: "Bank-grade encryption for all your sensitive industrial datasets.",
                            icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                            color: "text-amber-500", bg: "bg-amber-50"
                        },
                        { 
                            title: "PDF Reports", 
                            desc: "One-click generation of professional executive summary documents.",
                            icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 2H7a2 2 0 00-2 2v15a2 2 0 002 2z",
                            color: "text-red-500", bg: "bg-red-50"
                        },
                        { 
                            title: "Anomaly Detection", 
                            desc: "AI-driven algorithms to flag outliers in your process data.",
                            icon: "M13 10V3L4 14h7v7l9-11h-7z",
                            color: "text-purple-500", bg: "bg-purple-50"
                        },
                        {
                            title: "Team Access",
                            desc: "Collaborate with your engineering team with role-based permissions.",
                            icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                             color: "text-green-500", bg: "bg-green-50"
                        },
                        {
                            title: "Global History",
                            desc: "Compare current batches against historical averages for consistency.",
                            icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                            color: "text-cyan-500", bg: "bg-cyan-50"
                        }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform duration-300 flex flex-col items-start group">
                            <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-6 ${item.color} group-hover:scale-110 transition-transform`}>
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                            </div>
                            <h3 className="font-bold text-xl text-slate-800 mb-3">{item.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">{item.desc}</p>
                            
                            <a href="#" className="mt-auto text-sm font-bold text-slate-400 hover:text-primary-600 uppercase tracking-wide flex items-center group-hover:gap-2 transition-all">
                                Learn More 
                                <svg className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 bg-yellow-400 text-center relative overflow-hidden rounded-[2.5rem] mx-4 md:mx-6 mb-6">
                <div className="relative z-10 max-w-2xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to optimize your workflow?</h2>
                    <p className="text-slate-800 font-medium mb-8">Join hundreds of chemical engineers using ChemViz to drive production efficiency.</p>
                    <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-slate-900/20 transition-all hover:scale-105">
                        Get Started Now
                    </button>
                </div>
                
                 {/* Background Glows */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                     <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl"></div>
                     <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
}
