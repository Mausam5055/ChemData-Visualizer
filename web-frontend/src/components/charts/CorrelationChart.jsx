import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function CorrelationChart({ data, title = "Pressure vs Temp" }) {

    const chartData = {
        datasets: [
            {
                label: 'Readings',
                data: data.map(r => ({ x: r.pressure, y: r.temperature })),
                backgroundColor: 'rgba(13, 148, 136, 0.4)', // Teal with higher transparency
                borderColor: 'rgba(13, 148, 136, 0.8)',
                borderWidth: 1,
                pointRadius: 5,
                pointHoverRadius: 7,
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
                callbacks: {
                    label: (context) => `P: ${context.raw.x} PSI, T: ${context.raw.y} °C`
                }
            }
        },
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: { display: true, text: 'Pressure (PSI)', color: '#94a3b8', font: { size: 10 } },
                grid: { color: '#f1f5f9' },
                ticks: { color: '#64748b', font: { size: 10 } },
                border: { display: false }
            },
            y: {
                title: { display: true, text: 'Temperature (°C)', color: '#94a3b8', font: { size: 10 } },
                grid: { color: '#f1f5f9' },
                ticks: { color: '#64748b', font: { size: 10 } },
                border: { display: false }
            },
        },
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80">
            <h3 className="text-lg font-bold text-slate-800 mb-4">{title}</h3>
            <div className="h-full pb-6">
                <Scatter data={chartData} options={options} />
            </div>
        </div>
    );
}
