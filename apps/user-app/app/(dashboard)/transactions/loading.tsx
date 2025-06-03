import { StatCardSkeleton, TransactionSkeleton } from "../../../components/LoadingSkeleton";

export default function Loading() {
    return (
        <div className="space-y-8">
            {/* Header skeleton */}
            <div>
                <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
            </div>

            {/* Stats grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <StatCardSkeleton key={i} />
                ))}
            </div>

            {/* Transactions list skeleton */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50">
                <div className="p-6 border-b border-gray-100">
                    <div className="h-6 bg-gray-200 rounded w-40 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                </div>
                <div className="p-6 space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <TransactionSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}
