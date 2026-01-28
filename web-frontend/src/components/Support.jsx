import React, { useState } from 'react';

export default function Support() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        type: 'question',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', type: 'question', message: '' });
                setIsModalOpen(false);
            }, 2000);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-50 overflow-x-hidden relative">
            {/* --- Hero Section (Live Support Design) --- */}
            <div className="relative w-full h-[500px] bg-white overflow-hidden">
                {/* Top Left Curved Shape (Teal) */}
                <div className="absolute top-0 left-0 w-[600px] h-[400px] bg-gradient-to-br from-primary-500 to-primary-600 rounded-br-[100%] z-0 transform -translate-x-[10%] -translate-y-[10%] shadow-xl">
                    <div className="absolute top-12 left-24">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Right Side Content (24/7 Graphic) */}
                <div className="absolute top-1/2 right-[10%] transform -translate-y-1/2 z-10 hidden lg:block">
                     <div className="relative w-80 h-80 bg-gradient-to-tr from-yellow-400 to-orange-400 rounded-full shadow-2xl flex items-center justify-center animate-pulse-slow">
                        {/* Headphones Icon Overlay */}
                        <div className="absolute -right-12 top-1/2 transform -translate-y-1/2">
                            <svg className="w-48 h-48 text-slate-800 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0v5.5A2.5 2.5 0 004.5 18h11A2.5 2.5 0 0018 15.5V10zm-2.5 4a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-9 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="text-center text-white font-black leading-none -ml-8">
                             <div className="text-8xl drop-shadow-md">24</div>
                             <div className="text-4xl opacity-90">/ 7</div>
                        </div>
                     </div>
                </div>

                {/* Main Hero Text */}
                <div className="absolute top-[160px] left-[10%] md:left-[30%] z-10 max-w-lg">
                    <p className="text-white/80 md:text-slate-500 uppercase tracking-widest text-sm font-semibold mb-2">Welcome to our site</p>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-800 leading-tight">
                        <span className="text-white md:text-primary-600 block">Live Support</span>
                        <span className="text-slate-800 md:text-orange-400 text-3xl md:text-4xl font-light block mt-2">ChemViz Platform</span>
                    </h1>
                     <p className="mt-6 text-slate-600 md:text-slate-500 max-w-md">
                        Our engineering team involves 100+ experts availble to assist you with data integration and anomaly review.
                    </p>

                </div>
            </div>

            {/* Feature Cards Loop */}
            <div className="relative z-20 max-w-6xl mx-auto px-6 -mt-16 mb-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: "Analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
                        { title: "Reports", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
                        { title: "Documentation", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
                        { title: "Verification", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center text-center">
                            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-500">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                            </div>
                            <h3 className="font-bold text-slate-800 uppercase text-sm tracking-wider">{item.title}</h3>
                            <button className="mt-4 text-xs font-bold text-slate-400 hover:text-primary-600 uppercase tracking-wide">Learn More</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact CTA Section */}
            <div className="max-w-4xl mx-auto px-6 pb-24 text-center">
                 <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-12 rounded-full shadow-xl shadow-primary-500/30 transition-all hover:scale-105 flex items-center gap-3 mx-auto"
                >
                    <span>Contact Support</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
            </div>



            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-slide-up relative">
                        {/* Close Button */}
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="p-8">
                             <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-900">Get in Touch</h2>
                                <p className="text-slate-500 text-sm mt-1">Fill out the form below or call us directly.</p>
                             </div>

                             {submitted ? (
                                <div className="bg-green-50 p-8 rounded-2xl border border-green-100 text-center py-12">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <h3 className="text-green-800 font-bold text-xl">Message Sent!</h3>
                                    <p className="text-green-600 mt-2">Redirecting...</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Name</label>
                                            <input 
                                                required
                                                type="text" 
                                                className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 focus:ring-primary-500 focus:border-primary-500"
                                                value={formData.name}
                                                onChange={e => setFormData({...formData, name: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-1 mt-4">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</label>
                                            <input 
                                                required
                                                type="email" 
                                                className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 focus:ring-primary-500 focus:border-primary-500"
                                                value={formData.email}
                                                onChange={e => setFormData({...formData, email: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Topic</label>
                                        <select 
                                            className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 focus:ring-primary-500 focus:border-primary-500"
                                            value={formData.type}
                                            onChange={e => setFormData({...formData, type: e.target.value})}
                                        >
                                            <option value="question">General Question</option>
                                            <option value="bug">Report a Bug</option>
                                            <option value="feature">Feature Request</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Message</label>
                                        <textarea 
                                            required
                                            rows={3}
                                            className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 focus:ring-primary-500 focus:border-primary-500"
                                            value={formData.message}
                                            onChange={e => setFormData({...formData, message: e.target.value})}
                                        ></textarea>
                                    </div>
                                    <button type="submit" className="w-full bg-primary-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 transition-all hover:scale-[1.02] mt-2">
                                        Submit Request
                                    </button>
                                </form>
                            )}

                            {/* Direct Contact Inside Modal */}
                            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Or call us directly at</p>
                                <div className="text-2xl font-mono font-bold text-slate-800 tracking-wider">
                                  +91 8638545574
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
