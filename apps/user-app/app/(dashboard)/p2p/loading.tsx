import { StatCardSkeleton, FormCardSkeleton, TransactionSkeleton } from "../../../components/LoadingSkeleton";

export default function Loading() {
    return (
        <div className="space-y-8">
            {/* Header skeleton */}
            <div>
                <div className="h-8 bg-gray-200 rounded w-40 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
            </div>

            {/* Stats grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <StatCardSkeleton key={i} />
                ))}
            </div>

            {/* Content grid skeleton */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <FormCardSkeleton />
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
                    <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <TransactionSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
