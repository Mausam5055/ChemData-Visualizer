export default function Skeleton({ className, ...props }) {
    return (
        <div 
            className={`animate-pulse bg-slate-200 rounded-lg ${className}`} 
            {...props}
        />
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col space-y-4">
            <div className="flex justify-between items-start">
                <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
            <Skeleton className="h-4 w-full" />
        </div>
    );
}

export function ChartSkeleton({ height = "h-80" }) {
    return (
        <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 ${height} flex flex-col space-y-4`}>
            <Skeleton className="h-6 w-48" />
            <div className="flex-1 flex items-end space-x-2">
                 <Skeleton className="h-full w-full rounded-none" />
            </div>
        </div>
    );
}
