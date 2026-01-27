import { useState, useEffect } from 'react';
import api from '../api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// SVGs for cards
const FlowIcon = () => (
    <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);
const PressureIcon = () => (
    <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
);
const TempIcon = () => (
    <svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </svg>
);

export default function Analysis({ datasetId }) {
    const [stats, setStats] = useState(null);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            api.get(`api/datasets/${datasetId}/stats/`),
            api.get(`api/datasets/${datasetId}/data/`)
        ]).then(([statsRes, dataRes]) => {
            setStats(statsRes.data);
            setRecords(dataRes.data.results || dataRes.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [datasetId]);

    const downloadPDF = async () => {
        try {
            const response = await api.get(`api/datasets/${datasetId}/pdf/`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ChemViz_Report_${datasetId}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
           console.error("PDF Download failed", error);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );
    if (!stats) return <div className="text-center text-red-500 mt-10">Error loading data.</div>;

    const barData = {
        labels: Object.keys(stats.type_distribution),
        datasets: [
            {
                label: 'Count',
                data: Object.values(stats.type_distribution),
                backgroundColor: 'rgba(13, 148, 136, 0.7)',
                borderColor: 'rgba(13, 148, 136, 1)',
                borderWidth: 0,
                borderRadius: 6,
                hoverBackgroundColor: 'rgba(15, 118, 110, 0.9)',
            },
        ],
    };
    
    const chartOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1F2937',
                padding: 12,
                titleFont: { size: 13 },
                bodyFont: { size: 14 },
                cornerRadius: 8,
                displayColors: false,
            }
        },
        scales: {
            y: {
                grid: {
                    color: '#F3F4F6',
                    borderDash: [5, 5],
                },
                ticks: {
                    font: { size: 12 },
                    color: '#6B7280'
                },
                border: { display: false }
            },
            x: {
                grid: { display: false },
                ticks: {
                    font: { size: 12 },
                    color: '#374151',
                    font: { weight: 'bold' }
                },
                border: { display: false }
            }
        },
        animation: {
            duration: 1500,
            easing: 'easeOutQuart'
        }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                 <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Analytics Overview</h2>
                    <p className="text-gray-500">Real-time insights from your dataset.</p>
                 </div>
                 <button onClick={downloadPDF} className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all font-medium text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    Export Report
                 </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-start justify-between hover:shadow-md transition-shadow">
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Total Records</dt>
                        <dd className="mt-2 text-3xl font-extrabold text-gray-900">{stats.total_count}</dd>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-2 inline-block">All Active</span>
                    </div>
                     <div className="p-3 bg-gray-50 rounded-xl">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    </div>
                </div>
                
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-start justify-between hover:shadow-md transition-shadow">
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Avg Flowrate</dt>
                        <dd className="mt-2 text-3xl font-extrabold text-gray-900">{stats.average_flowrate?.toFixed(1)}</dd>
                        <span className="text-xs font-medium text-gray-400 mt-2 inline-block">Liters/min</span>
                    </div>
                     <div className="p-3 bg-primary-50 rounded-xl">
                        <FlowIcon />
                    </div>
                </div>

                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-start justify-between hover:shadow-md transition-shadow">
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Avg Pressure</dt>
                        <dd className="mt-2 text-3xl font-extrabold text-gray-900">{stats.average_pressure?.toFixed(1)}</dd>
                        <span className="text-xs font-medium text-gray-400 mt-2 inline-block">PSI</span>
                    </div>
                     <div className="p-3 bg-red-50 rounded-xl">
                        <PressureIcon />
                    </div>
                </div>

                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-start justify-between hover:shadow-md transition-shadow">
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Avg Temp</dt>
                        <dd className="mt-2 text-3xl font-extrabold text-gray-900">{stats.average_temperature?.toFixed(1)}</dd>
                         <span className="text-xs font-medium text-gray-400 mt-2 inline-block">°C</span>
                    </div>
                     <div className="p-3 bg-orange-50 rounded-xl">
                        <TempIcon />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 lg:col-span-2">
                     <h3 className="text-lg font-bold text-gray-900 mb-6">Equipment Distribution</h3>
                     <div className="h-80">
                        <Bar data={barData} options={chartOptions} />
                     </div>
                </div>

                {/* Summary / Table Preview ? Or just full table below */}
                 <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Highest Pressure</span>
                            <span className="font-bold text-gray-900">
                                {Math.max(...records.map(r => r.pressure)).toFixed(1)} PSI
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Peak Temp</span>
                            <span className="font-bold text-gray-900">
                                {Math.max(...records.map(r => r.temperature)).toFixed(1)} °C
                            </span>
                        </div>
                         <div className="p-4 bg-primary-50 rounded-lg mt-4">
                            <p className="text-sm text-primary-800 font-medium">System Status</p>
                            <p className="text-xs text-primary-600 mt-1">All parameters within optimal range based on recent upload.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 backdrop-blur">
                    <h3 className="text-lg font-bold text-gray-900">Detailed Records</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Equipment</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Flowrate</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pressure</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Temp</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50">
                            {records.map((record, idx) => (
                                <tr key={record.id} className={idx % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50/30 hover:bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.equipment_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${record.equipment_type === 'Pump' ? 'bg-sky-100 text-sky-800' : 
                                              record.equipment_type === 'Valve' ? 'bg-green-100 text-green-800' : 
                                              'bg-gray-100 text-gray-800'}`}>
                                            {record.equipment_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{record.flowrate.toFixed(1)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{record.pressure.toFixed(1)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{record.temperature.toFixed(1)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
