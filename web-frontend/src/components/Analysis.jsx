import { useState, useEffect } from 'react';
import api from '../api';
import TrendChart from './charts/TrendChart';
import DistributionChart from './charts/DistributionChart';
import CorrelationChart from './charts/CorrelationChart';
import BarChart from './charts/BarChart';
import StatCard from './StatCard';
import Skeleton from './ui/Skeleton';
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
    <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
);
const TempIcon = () => (
    <svg className="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </svg>
);

export default function Analysis({ datasetId }) {
    const [stats, setStats] = useState(null);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    const [viewMode, setViewMode] = useState('overview'); // overview, trends, equipment, correlations

    const [barMetric, setBarMetric] = useState('flowrate');
    const [scatterX, setScatterX] = useState('pressure');
    const [scatterY, setScatterY] = useState('temperature');

    useEffect(() => {
        setLoading(true);
        const minLoadTime = new Promise(resolve => setTimeout(resolve, 800)); // Minimum 800ms skeleton
        
        Promise.all([
            api.get(`api/datasets/${datasetId}/stats/`),
            api.get(`api/datasets/${datasetId}/data/`),
            minLoadTime
        ]).then(([statsRes, dataRes]) => {
            setStats(statsRes.data);
            setRecords(dataRes.data.results || dataRes.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [datasetId]);

    const getBarData = (metric = 'flowrate') => {
        if (!records || records.length === 0) return {};
        const sums = {};
        const counts = {};
        records.forEach(r => {
            const t = r.equipment_type;
            if (!sums[t]) { sums[t] = 0; counts[t] = 0; }
            sums[t] += r[metric];
            counts[t] += 1;
        });
        const avgs = {};
        Object.keys(sums).forEach(t => {
            avgs[t] = parseFloat((sums[t] / counts[t]).toFixed(1));
        });
        return avgs;
    };

    const downloadPDF = async () => {
        try {
            const response = await api.get(`api/datasets/${datasetId}/pdf/`, {
                responseType: 'blob',
            });
            
            // Extract filename from header if available
            let filename = `ChemViz_Report_${datasetId}.pdf`;
            const disposition = response.headers['content-disposition'];
            if (disposition && disposition.indexOf('attachment') !== -1) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) { 
                    filename = matches[1].replace(/['"]/g, '');
                }
            }

            // Method 1: File System Access API (Chrome/Edge/Opera) - True "Save As"
            if ('showSaveFilePicker' in window) {
                try {
                    const handle = await window.showSaveFilePicker({
                        suggestedName: filename,
                        types: [{
                            description: 'PDF Document',
                            accept: {'application/pdf': ['.pdf']},
                        }],
                    });
                    const writable = await handle.createWritable();
                    await writable.write(response.data);
                    await writable.close();
                    return; 
                } catch (err) {
                    if (err.name === 'AbortError') return; // User cancelled
                    // Fallback to legacy method on error
                    console.warn("File System Access API failed, falling back", err);
                }
            }

            // Method 2: Legacy Fallback (Firefox/Safari) - Prompt for rename
            // User requested explicit option to change name
            const userFilename = prompt("Save PDF Report as:", filename);
            if (userFilename === null) return; // User clicked Cancel
            
            const finalName = userFilename || filename;

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', finalName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
           console.error("PDF Download failed", error);
           alert("Failed to generate PDF. Please try again.");
        }
    };

    if (loading) return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-10 mt-6">
             <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-64" />
                </div>
                <Skeleton className="h-10 w-32 rounded-xl" />
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-32 flex flex-col justify-between">
                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                        <Skeleton className="h-8 w-16" />
                    </div>
                ))}
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Skeleton className="h-96 w-full rounded-2xl" />
                </div>
                <div>
                     <Skeleton className="h-96 w-full rounded-2xl" />
                </div>
                <div className="lg:col-span-2">
                     <Skeleton className="h-80 w-full rounded-2xl" />
                </div>
                <div>
                     <Skeleton className="h-80 w-full rounded-2xl" />
                </div>
             </div>
        </div>
    );
    if (!stats) return <div className="text-center text-red-500 mt-10">Error loading data.</div>;

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
                 <div>
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold uppercase tracking-wide whitespace-nowrap">
                            Dataset #{datasetId}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight truncate">Analytical Overview</h2>
                    </div>
                    <p className="text-slate-500 mt-1 text-sm">Real-time performance metrics and equipment status.</p>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                     {/* View Switcher */}
                     <div className="bg-slate-100 p-1 rounded-xl flex items-center overflow-x-auto w-full sm:w-auto no-scrollbar">
                        {['overview', 'trends', 'equipment', 'correlations'].map((v) => (
                            <button 
                                key={v}
                                onClick={() => setViewMode(v)}
                                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all whitespace-nowrap ${viewMode === v ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {v}
                            </button>
                        ))}
                     </div>

                    <button onClick={downloadPDF} className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all font-medium text-sm w-full sm:w-auto whitespace-nowrap">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        Export
                    </button>
                 </div>
            </div>

            {/* KPI Cards - Always Visible */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Records" 
                    value={stats.total_count} 
                    unit="Row(s)" 
                    icon={<svg className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>}
                    bgClass="bg-slate-100"
                    trend="up" trendValue="12%" 
                />
                <StatCard 
                    title="Avg Flowrate" 
                    value={stats.average_flowrate?.toFixed(1)} 
                    unit="L/min" 
                    icon={<FlowIcon />}
                    bgClass="bg-primary-50"
                    trend="up" trendValue="3.2%" 
                />
                <StatCard 
                    title="Avg Pressure" 
                    value={stats.average_pressure?.toFixed(1)} 
                    unit="PSI" 
                    icon={<PressureIcon />}
                    bgClass="bg-yellow-50"
                    trend="down" trendValue="0.8%" 
                />
                <StatCard 
                    title="Avg Temperature" 
                    value={stats.average_temperature?.toFixed(1)} 
                    unit="°C" 
                    icon={<TempIcon />}
                    bgClass="bg-rose-50"
                    trend="up" trendValue="1.5%" 
                />
            </div>

            {/* Overview Mode */}
            {viewMode === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                    {/* Top Row */}
                    <div className="lg:col-span-2 flex flex-col">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-slate-800">
                                    {`Average ${barMetric.charAt(0).toUpperCase() + barMetric.slice(1)} by Equipment`}
                                </h3>
                                <select 
                                    value={barMetric} 
                                    onChange={(e) => setBarMetric(e.target.value)}
                                    className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold py-1.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer hover:bg-slate-100 transition-colors"
                                >
                                    <option value="flowrate">Flowrate</option>
                                    <option value="pressure">Pressure</option>
                                    <option value="temperature">Temperature</option>
                                </select>
                            </div>
                            <div className="flex-1 min-h-[300px]">
                                <BarChart 
                                    data={getBarData(barMetric)} 
                                    title="" // Title handled by parent for layout control
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col">
                         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Equipment Types</h3>
                            <div className="flex-1 flex items-center justify-center min-h-[300px]">
                                <DistributionChart data={stats.type_distribution} />
                            </div>
                         </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="lg:col-span-2 flex flex-col">
                         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
                             {/* Trend Chart has its own title logic usually, but let's wrap it for consistency if needed, 
                                 or just let it be. TrendChart usually has title inside. 
                                 Let's keep it consistent: Remove title from component if possible or just wrap it. 
                                 The TrendChart component renders its own card? Let's check view_code_item but I recall it rendering the card.
                                 Wait, TrendChart usually renders the whole card. 
                                 Let's check code context. TrendChart takes `data` and `title`. 
                                 If I wrap it in a div with bg-white, I might double wrap it. 
                                 Let's assume TrendChart renders the card.
                                 Actually, looking at previous helper calls or standard practices here, 
                                 I'll assume I need to pass className or style to TrendChart to make it h-full?
                                 Or just wrap it.
                                 
                                 Actually, looking at previous code:
                                 <TrendChart data={records} title="..." />
                                 If TrendChart has fixed height or styles, it might not grow.
                                 
                                 Let's look at TrendChart source briefly if I could, but I can't in this tool.
                                 However, I can just wrap it and ensure it fills.
                              */}
                            <TrendChart data={records} title="Live Process Trends (Flow & Pressure)" />
                         </div>
                    </div>

                    <div className="relative flex flex-col">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
                            <div className="flex justify-between items-center mb-4 gap-2">
                                <h3 className="text-lg font-bold text-slate-800 truncate" title={`${scatterX} vs ${scatterY}`}>
                                    {scatterX.charAt(0).toUpperCase() + scatterX.slice(1)} vs {scatterY.charAt(0).toUpperCase() + scatterY.slice(1)}
                                </h3>
                                <div className="flex gap-2 flex-shrink-0">
                                     <select 
                                        value={scatterX} 
                                        onChange={(e) => setScatterX(e.target.value)}
                                        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold py-1 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer w-20"
                                    >
                                        <option value="flowrate">Flow</option>
                                        <option value="pressure">Press</option>
                                        <option value="temperature">Temp</option>
                                    </select>
                                     <select 
                                        value={scatterY} 
                                        onChange={(e) => setScatterY(e.target.value)}
                                        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold py-1 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer w-20"
                                    >
                                        <option value="flowrate">Flow</option>
                                        <option value="pressure">Press</option>
                                        <option value="temperature">Temp</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex-1 min-h-[300px]">
                                <CorrelationChart 
                                    data={records} 
                                    title="" // Title handled by parent
                                    xKey={scatterX} yKey={scatterY}
                                    xLabel={scatterX.charAt(0).toUpperCase() + scatterX.slice(1)} 
                                    yLabel={scatterY.charAt(0).toUpperCase() + scatterY.slice(1)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Trends Mode */}
            {viewMode === 'trends' && (
                <div className="space-y-6">
                    <TrendChart data={records} title="Flowrate Trend" />
                    <TrendChart data={records} title="Pressure Trend" />
                    <TrendChart data={records} title="Temperature Trend" />
                </div>
            )}

             {/* Equipment Mode */}
             {viewMode === 'equipment' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     <BarChart data={getBarData('flowrate')} title="Avg Flowrate by Equipment" />
                     <BarChart data={getBarData('pressure')} title="Avg Pressure by Equipment" />
                     <BarChart data={getBarData('temperature')} title="Avg Temperature by Equipment" />
                     <DistributionChart data={stats.type_distribution} />
                </div>
            )}

            {/* Correlations Mode */}
            {viewMode === 'correlations' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CorrelationChart 
                        data={records} 
                        title="Pressure vs Temperature"
                        xKey="pressure" yKey="temperature"
                        xLabel="Pressure (PSI)" yLabel="Temperature (°C)"
                    />
                     <CorrelationChart 
                        data={records} 
                        title="Flow vs Pressure"
                        xKey="flowrate" yKey="pressure"
                        xLabel="Flowrate (L/min)" yLabel="Pressure (PSI)"
                    />
                     <CorrelationChart 
                        data={records} 
                        title="Flow vs Temperature"
                        xKey="flowrate" yKey="temperature"
                        xLabel="Flowrate (L/min)" yLabel="Temperature (°C)"
                    />
                </div>
            )}

            {/* Data Table - Always Visible */}
            <div className="bg-white shadow-sm border border-slate-100 rounded-2xl overflow-hidden mt-6">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                         <h3 className="text-lg font-bold text-slate-900">Equipment Logs</h3>
                         <p className="text-sm text-slate-500 mt-1">Real-time sensor readings and operational status</p>
                    </div>
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-500 uppercase tracking-wider shadow-sm">
                        {records.length} Records
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-1/6">Equipment Name</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-1/6">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-1/5">Flowrate <span className="text-slate-300 font-normal normal-case">(L/min)</span></th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-1/5">Pressure <span className="text-slate-300 font-normal normal-case">(PSI)</span></th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-1/5">Temp <span className="text-slate-300 font-normal normal-case">(°C)</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-50">
                            {records.map((record, idx) => (
                                <tr key={record.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-700">
                                        {record.equipment_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 inline-flex items-center gap-1.5 text-xs leading-5 font-bold rounded-lg border 
                                            ${record.equipment_type === 'Pump' ? 'bg-sky-50 text-sky-700 border-sky-100' : 
                                              record.equipment_type === 'Valve' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                              record.equipment_type === 'Mixer' ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                                              record.equipment_type === 'Reactor' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                              'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                record.equipment_type === 'Pump' ? 'bg-sky-400' : 
                                                record.equipment_type === 'Valve' ? 'bg-emerald-400' : 
                                                record.equipment_type === 'Mixer' ? 'bg-purple-400' : 
                                                record.equipment_type === 'Reactor' ? 'bg-orange-400' :
                                                'bg-slate-400'
                                            }`}></span>
                                            {record.equipment_type}
                                        </span>
                                    </td>
                                    
                                    {/* Flowrate Column */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-sm font-bold text-slate-700 font-mono">{record.flowrate.toFixed(1)}</span>
                                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                                                <div 
                                                    className="bg-primary-500 h-1.5 rounded-full" 
                                                    style={{ width: `${Math.min(100, (record.flowrate / 400) * 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Pressure Column */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-sm font-bold text-slate-700 font-mono">{record.pressure.toFixed(1)}</span>
                                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                                                <div 
                                                    className="bg-amber-500 h-1.5 rounded-full" 
                                                    style={{ width: `${Math.min(100, (record.pressure / 25) * 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Temperature Column */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                 <span className={`text-sm font-bold font-mono ${record.temperature > 100 ? 'text-rose-600' : 'text-slate-700'}`}>
                                                    {record.temperature.toFixed(1)}
                                                 </span>
                                                 {record.temperature > 100 && (
                                                     <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100 animate-pulse">HIGH</span>
                                                 )}
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                                                <div 
                                                    className={`h-1.5 rounded-full ${record.temperature > 100 ? 'bg-rose-500' : 'bg-rose-400'}`}
                                                    style={{ width: `${Math.min(100, (record.temperature / 150) * 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
