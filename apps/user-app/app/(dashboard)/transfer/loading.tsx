import { StatCardSkeleton, BalanceCardSkeleton, FormCardSkeleton } from "../../../components/LoadingSkeleton";

export default function Loading() {
    return (
        <div className="space-y-8">
            {/* Header skeleton */}
            <div>
                <div className="h-8 bg-gray-200 rounded w-40 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-80 animate-pulse"></div>
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
                <div className="space-y-6">
                    <BalanceCardSkeleton />
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                                    </div>
                                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
