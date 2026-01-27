export default function StatCard({ title, value, unit, icon, trend, trendValue, colorClass = "text-primary-600", bgClass = "bg-primary-50" }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                        {value} <span className="text-sm font-semibold text-slate-400 ml-1">{unit}</span>
                    </h3>
                </div>
                <div className={`p-3 rounded-xl ${bgClass}`}>
                    {icon}
                </div>
            </div>
            {(trend || trendValue) && (
                <div className="mt-4 flex items-center text-sm">
                    <span className={`font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'} flex items-center`}>
                        {trend === 'up' ? '↑' : '↓'} {trendValue}
                    </span>
                    <span className="text-slate-400 ml-2">vs last batch</span>
                </div>
            )}
        </div>
    );
}
