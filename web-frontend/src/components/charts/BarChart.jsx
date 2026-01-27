import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart({ data, title = "Avg Flowrate by Type" }) {
    // data: { 'Pump': 45.2, 'Valve': 12.5 ... }

    const chartData = {
        labels: Object.keys(data),
        datasets: [
            {
                label: title.includes("Pressure") ? "Pressure (PSI)" : title.includes("Temp") ? "Temperature (°C)" : 'Avg Flowrate (L/min)',
                data: Object.values(data),
                backgroundColor: title.includes("Pressure") ? 'rgba(245, 158, 11, 0.8)' : title.includes("Temp") ? 'rgba(244, 63, 94, 0.8)' : 'rgba(13, 148, 136, 0.8)',
                hoverBackgroundColor: title.includes("Pressure") ? 'rgba(245, 158, 11, 1)' : title.includes("Temp") ? 'rgba(244, 63, 94, 1)' : 'rgba(15, 118, 110, 1)',
                borderRadius: 4,
                barThickness: 30,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1e293b',
                bodyColor: '#475569',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#64748b', font: { size: 11, family: "'Inter', sans-serif" } },
                border: { display: false }
            },
            y: {
                grid: { color: '#f1f5f9', borderDash: [4, 4] },
                ticks: { color: '#94a3b8', font: { size: 10 } },
                border: { display: false },
                title: { display: true, text: 'Liters / min', color: '#cbd5e1', font: { size: 10 } }
            },
        },
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80">
            <h3 className="text-lg font-bold text-slate-800 mb-4">{title}</h3>
            <div className="h-full pb-6">
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
}
