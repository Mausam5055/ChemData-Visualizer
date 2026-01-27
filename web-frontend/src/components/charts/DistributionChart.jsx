import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DistributionChart({ data, title = "Equipment Types" }) {
  
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: [
          '#0f766e', // Teal 800
          '#0d9488', // Teal 600
          '#14b8a6', // Teal 500
          '#2dd4bf', // Teal 400
          '#5eead4', // Teal 300
          '#99f6e4', // Teal 200
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 4,
      },
    ],
  };

  const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
          legend: { 
              position: 'right', 
              labels: { 
                  usePointStyle: true, 
                  pointStyle: 'circle',
                  font: { family: "'Inter', sans-serif", size: 11 },
                  padding: 15
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
              callbacks: {
                  label: function(context) {
                      const label = context.label || '';
                      const value = context.raw || 0;
                      const total = context.chart._metasets[context.datasetIndex].total;
                      const percentage = Math.round((value / total) * 100) + '%';
                      return `${label}: ${value} (${percentage})`;
                  }
              }
          }
      },
      cutout: '75%',
      layout: { padding: 0 }
  };

  const total = Object.values(data).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80 flex flex-col">
        <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
        <div className="flex-grow relative">
            <Doughnut data={chartData} options={options} />
             {/* Center Text */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 {/* Offset left slightly to account for legend on right */}
                <div className="text-center pr-20 md:pr-24"> 
                    <span className="block text-3xl font-bold text-slate-800">{total}</span>
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total</span>
                </div>
             </div>
        </div>
    </div>
  );
}
