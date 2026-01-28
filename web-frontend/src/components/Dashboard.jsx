import { useState, useEffect } from 'react';
import api from '../api';
import ProcessingOverlay from './ui/ProcessingOverlay';
import Skeleton from './ui/Skeleton';

export default function Dashboard({ onSelect }) {
    const [datasets, setDatasets] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [file, setFile] = useState(null);
    const [activeTab, setActiveTab] = useState('my'); // 'my' or 'global'
    const [isDragging, setIsDragging] = useState(false);

    const [user, setUser] = useState(null);
    const [showProfile, setShowProfile] = useState(false);

    const fetchUser = async () => {
        try {
            const res = await api.get('auth/user/');
            setUser(res.data);
        } catch (err) {
            console.error("Failed to fetch user:", err);
        }
    };

    const fetchDatasets = async () => {
        setLoadingData(true);
        try {
            const endpoint = activeTab === 'my' ? 'api/datasets/' : 'api/global-datasets/';
            const res = await api.get(endpoint);
            setDatasets(res.data.results || res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        fetchDatasets();
        fetchUser();
    }, [activeTab]);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            await Promise.all([
                api.post('api/upload/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }),
                new Promise(resolve => setTimeout(resolve, 2000)) // Artificial delay for UX
            ]);
            
            setFile(null);
            if (activeTab === 'my') fetchDatasets();
            else setActiveTab('my'); 
        } catch (err) {
            alert('Upload failed: ' + (err.response?.data?.error || err.message));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-[1200px] mx-auto pb-12 relative">
            <ProcessingOverlay isProcessing={uploading} message="Uploading & Analyzing Dataset..." />
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                     <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
                     <p className="text-slate-500 mt-1">Manage your chemical process datasets and generate insights.</p>
                </div>
                <div className="flex gap-3 items-center">
                     {user && (
                        <div className="relative">
                            <button 
                                onClick={() => setShowProfile(!showProfile)}
                                className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                            >
                                <div className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xs font-bold">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-slate-700 hidden sm:block">{user.username}</span>
                                <svg className={`w-4 h-4 text-slate-400 transition-transform ${showProfile ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>

                            {/* Profile Dropdown */}
                            {showProfile && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-lg font-bold">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{user.username}</p>
                                            <p className="text-xs text-slate-500 break-all">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="border-t border-slate-50 pt-3">
                                        <p className="text-xs text-slate-400 uppercase font-semibold mb-2">Account Details</p>
                                        <div className="flex justify-between text-sm py-1">
                                            <span className="text-slate-500">User ID</span>
                                            <span className="font-mono text-slate-700">#{user.pk}</span>
                                        </div>
                                         <div className="flex justify-between text-sm py-1">
                                            <span className="text-slate-500">Status</span>
                                            <span className="text-emerald-600 font-medium bg-emerald-50 px-2 rounded-full text-xs">Active</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                     )}

                     <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-medium text-sm hover:bg-slate-50 transition-colors shadow-sm">
                        Documentation
                     </button>
                     <button className="px-4 py-2 bg-primary-600 text-white rounded-xl font-medium text-sm hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200">
                        New Project
                     </button>
                </div>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                 <div className="max-w-xl mx-auto text-center">
                    <h2 className="text-lg font-bold text-slate-900 mb-2">Upload New Dataset</h2>
                    <p className="text-slate-500 text-sm mb-6">Upload a CSV file containing equipment logs (Flowrate, Pressure, Temperature).</p>
                    
                    <form onSubmit={handleUpload}>
                        <div 
                            className={`relative group border-2 border-dashed rounded-2xl p-10 transition-all text-center cursor-pointer 
                                ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'}
                                ${file ? 'bg-primary-50 border-primary-500' : ''}
                            `}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('fileInput').click()}
                        >
                            <input
                                id="fileInput"
                                type="file"
                                accept=".csv"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="hidden"
                            />
                            
                            <div className="flex flex-col items-center justify-center gap-3">
                                {file ? (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <div className="text-sm font-medium text-primary-700">{file.name}</div>
                                        <p className="text-xs text-primary-500">{(file.size / 1024).toFixed(1)} KB • Ready to upload</p>
                                    </>
                                ) : (
                                    <>
                                         <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 group-hover:bg-primary-100 group-hover:text-primary-500 transition-colors flex items-center justify-center mb-2">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                        </div>
                                        <p className="text-sm font-medium text-slate-700">
                                            <span className="text-primary-600">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-slate-400">CSV files up to 10MB</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {file && (
                             <button
                                type="submit"
                                disabled={uploading}
                                className="mt-6 w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium shadow-lg shadow-primary-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {uploading ? 'Processing...' : 'Start Analysis'}
                            </button>
                        )}
                    </form>
                 </div>
            </div>

            {/* History Section */}
            <div>
                 <div className="flex items-center justify-between mb-4">
                     <h2 className="text-lg font-bold text-slate-900">Recent Datasets</h2>
                     <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-100 flex">
                         <button
                            onClick={() => setActiveTab('my')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'my' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            My History
                        </button>
                        <button
                            onClick={() => setActiveTab('global')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'global' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            Global
                        </button>
                     </div>
                 </div>

                 <div className="bg-white shadow-sm border border-slate-100 rounded-2xl overflow-hidden min-h-[300px]">
                    {loadingData ? (
                        <div className="p-6 space-y-4">
                             {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="w-10 h-10 rounded-lg" />
                                        <div className="space-y-2">
                                            <Skeleton className="w-48 h-4 rounded" />
                                            <Skeleton className="w-24 h-3 rounded" />
                                        </div>
                                    </div>
                                    <Skeleton className="w-20 h-6 rounded-full" />
                                </div>
                             ))}
                        </div>
                    ) : datasets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            </div>
                            <h3 className="text-slate-900 font-medium">No datasets found</h3>
                            <p className="text-slate-500 text-sm mt-1">Upload a CSV file to get started.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {datasets.map((ds) => (
                                <div 
                                    key={ds.id} 
                                    onClick={() => onSelect(ds.id)}
                                    className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100 group-hover:scale-110 transition-transform">
                                            <span className="font-bold text-sm">csv</span>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-800 group-hover:text-primary-600 transition-colors">
                                                Dataset #{ds.id}
                                                {ds.user && <span className="ml-2 font-normal text-xs text-slate-400">by {ds.user}</span>}
                                            </h4>
                                            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                                                <span>{ds.file.split('/').pop()}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                <span>{new Date(ds.uploaded_at).toLocaleDateString()} at {new Date(ds.uploaded_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                            Processed
                                        </div>
                                        <svg className="w-5 h-5 text-slate-300 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );

}
