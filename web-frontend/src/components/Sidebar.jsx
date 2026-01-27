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
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm mr-3">C</div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">ChemViz</span>
                    </div>

                    {/* Main Nav */}
                    <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                        <h3 className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Main</h3>
                        
                        <button 
                            onClick={() => onViewChange('overview')}
                            className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors font-medium text-sm ${currentView === 'overview' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            Global Overview
                        </button>

                        <button 
                            onClick={onUploadClick}
                            className="w-full flex items-center px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors font-medium text-sm"
                        >
                           <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                            Upload New Data
                        </button>

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
                                            Dataset #{ds.id}
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
