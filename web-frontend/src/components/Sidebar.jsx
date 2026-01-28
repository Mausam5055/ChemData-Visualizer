import { useState, useEffect } from 'react';
import api from '../api';

export default function Sidebar({ isOpen, toggle, onLogout, onViewChange, currentView, selectedDatasetId, onSelectDataset, onUploadClick }) {
    const [datasets, setDatasets] = useState([]);

    useEffect(() => {
        const fetchDatasets = async () => {
            try {
                const res = await api.get('api/datasets/');
                setDatasets(res.data.results || res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDatasets();
        // Poll for updates every 10s or rely on parent to trigger refresh
        const interval = setInterval(fetchDatasets, 10000);
        return () => clearInterval(interval);
    }, []);

    // Also expose a refresh method if needed, but polling is simple for now
    
    return (
        <>
            {/* Mobile Overlay */}
            <div 
                className={`fixed inset-0 bg-gray-900/50 z-40 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={toggle}
            ></div>

            {/* Sidebar Container */}
            <aside className={`fixed top-0 left-0 z-50 h-screen w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Brand */}
                    <div className="h-16 flex items-center px-8 border-b border-slate-100">
                        <img src="/favicon.png" alt="Logo" className="w-8 h-8 rounded-lg shadow-sm mr-3 object-cover" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">ChemViz</span>
                    </div>

                    {/* Main Nav */}
                    <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                        <h3 className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Main</h3>
                        


                        <button 
                            onClick={onUploadClick}
                            className="w-full flex items-center px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors font-medium text-sm"
                        >
                           <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                            Upload New Data
                        </button>

                        <div className="pt-6">
                             <h3 className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Help & Support</h3>
                             <button 
                                onClick={() => onViewChange('features')}
                                className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-colors font-medium text-sm ${currentView === 'features' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                Features & Guides
                            </button>
                             <button 
                                onClick={() => onViewChange('support')}
                                className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-colors font-medium text-sm ${currentView === 'support' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                Feedback & Support
                            </button>
                        </div>


                        <div className="pt-6 pb-2">
                             <h3 className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Recent Datasets</h3>
                             <div className="space-y-1">
                                {datasets.map(ds => (
                                    <button
                                        key={ds.id}
                                        onClick={() => onSelectDataset(ds.id)}
                                        className={`w-full flex items-center px-4 py-2.5 rounded-xl transition-colors font-medium text-sm text-left truncate group
                                            ${selectedDatasetId == ds.id ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}
                                        `}
                                    >
                                        <span className={`w-2 h-2 rounded-full mr-3 ${selectedDatasetId == ds.id ? 'bg-primary-500' : 'bg-slate-300 group-hover:bg-slate-400'}`}></span>
                                        <div className="truncate">
                                            {ds.file.split('/').pop()}
                                            <span className="block text-[10px] text-slate-400 font-normal">{new Date(ds.uploaded_at).toLocaleDateString()}</span>
                                        </div>
                                    </button>
                                ))}
                                {datasets.length === 0 && (
                                    <div className="px-4 py-4 text-sm text-slate-400 italic">No datasets yet.</div>
                                )}
                             </div>
                        </div>
                    </div>

                        <div className="pt-6 pb-2">
                             <h3 className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Connect</h3>
                             <div className="space-y-1">
                                <a href="https://mausam04.vercel.app" target="_blank" rel="noopener noreferrer" className="w-full flex items-center px-4 py-2.5 rounded-xl transition-colors font-medium text-sm text-slate-600 hover:bg-slate-50 hover:text-primary-600">
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    Creator Portfolio
                                </a>
                                <a href="https://github.com/Mausam5055/" target="_blank" rel="noopener noreferrer" className="w-full flex items-center px-4 py-2.5 rounded-xl transition-colors font-medium text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                                    GitHub
                                </a>
                                <a href="https://www.linkedin.com/in/mausam-kar-6388861a7/" target="_blank" rel="noopener noreferrer" className="w-full flex items-center px-4 py-2.5 rounded-xl transition-colors font-medium text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-700">
                                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                    LinkedIn
                                </a>
                             </div>
                        </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-100">
                        <button 
                            onClick={onLogout}
                            className="w-full flex items-center justify-center px-4 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all font-medium text-sm"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
