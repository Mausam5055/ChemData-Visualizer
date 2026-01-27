import { useState, useEffect } from 'react';
import api from '../api';

export default function Dashboard({ onSelect }) {
    const [datasets, setDatasets] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [activeTab, setActiveTab] = useState('my'); // 'my' or 'global'

    const fetchDatasets = async () => {
        try {
            const endpoint = activeTab === 'my' ? 'api/datasets/' : 'api/global-datasets/';
            const res = await api.get(endpoint);
            setDatasets(res.data.results || res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchDatasets();
    }, [activeTab]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
             // Uploading always goes to user's history
            await api.post('api/upload/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFile(null);
            if (activeTab === 'my') fetchDatasets();
            else setActiveTab('my'); // switch to see new upload
        } catch (err) {
            alert('Upload failed: ' + (err.response?.data?.error || err.message));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Upload New Dataset</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Upload a CSV file containing equipment data.
                        </p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!file || uploading}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none disabled:bg-gray-400"
                            >
                                {uploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex" aria-label="Tabs">
                         <button
                            onClick={() => setActiveTab('my')}
                            className={`${activeTab === 'my' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                        >
                            My History
                        </button>
                        <button
                            onClick={() => setActiveTab('global')}
                            className={`${activeTab === 'global' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
                        >
                            Global History
                        </button>
                    </nav>
                </div>
                
                <ul className="divide-y divide-gray-200">
                    {datasets.map((ds) => (
                        <li key={ds.id}>
                            <a href="#" onClick={(e) => { e.preventDefault(); onSelect(ds.id); }} className="block hover:bg-gray-50">
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-primary-600 truncate">
                                            Dataset #{ds.id} {ds.user ? `(User: ${ds.user})` : ''}
                                        </p>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {new Date(ds.uploaded_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                {ds.file.split('/').pop()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </li>
                    ))}
                    {datasets.length === 0 && (
                        <li className="px-4 py-4 sm:px-6 text-center text-gray-500">No datasets found.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
