import { useRef, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function TrendChart({ data, title = "Process Trends" }) {
    const chartRef = useRef(null);
    const [chartData, setChartData] = useState({ datasets: [] });

    useEffect(() => {
        const chart = chartRef.current;

        if (!chart) {
             return;
        }
        
        // Create Gradient
        const ctx = chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(13, 148, 136, 0.5)'); // Teal 600
        gradient.addColorStop(1, 'rgba(13, 148, 136, 0.0)');

        const metricConfigs = {
            flowrate: { label: 'Flowrate (L/min)', color: '#0d9488', bg: gradient, fill: true, axis: 'y' },
            pressure: { label: 'Pressure (PSI)', color: '#f59e0b', bg: 'transparent', fill: false, axis: 'y1' },
            temperature: { label: 'Temperature (°C)', color: '#f43f5e', bg: 'transparent', fill: false, axis: 'y' }
        };

        const datasets = (data && data[0]) ? Object.keys(metricConfigs)
            .filter(key => data[0].hasOwnProperty(key)) // Only metrics present in data
            .map(key => {
                 const config = metricConfigs[key];
                 return {
                    label: config.label,
                    data: data.map(r => r[key]),
                    borderColor: config.color,
                    backgroundColor: config.bg,
                    fill: config.fill,
                    borderWidth: 2,
                    tension: key === 'flowrate' ? 0.4 : 0.3,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    yAxisID: config.axis,
                    hidden: false // could toggle visibility based on props later if needed
                 };
            }) : [];

        setChartData({
            labels: data.map((_, i) => i + 1),
            datasets: datasets
        });

    }, [data]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: { 
                position: 'top', 
                align: 'end', 
                labels: { 
                    boxWidth: 8, 
                    usePointStyle: true,
                    font: { family: "'Inter', sans-serif", size: 11 }
                } 
            },
            title: { display: false },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1e293b',
                bodyColor: '#475569',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 10,
                displayColors: true,
                boxPadding: 4
            }
        },
        scales: {
            x: { 
                grid: { display: false }, 
                ticks: { display: false } // Hide x-axis labels if too many
            },
            y: { 
                type: 'linear', 
                display: true, 
                position: 'left', 
                grid: { color: '#f1f5f9', borderDash: [4, 4] },
                border: { display: false },
                ticks: { color: '#94a3b8', font: { size: 10 } }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: { display: false },
                border: { display: false },
                ticks: { display: false } // Hide secondary axis ticks for cleanliness, rely on tooltip
            },
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-96 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
            <div className="flex-1 min-h-0 relative">
                 {/* Only render if we have data to avoid gradient errors on empty init */}
                 {data.length > 0 && 
                    <Line ref={chartRef} data={chartData} options={options} />
                 }
            </div>
        </div>
    );
}
