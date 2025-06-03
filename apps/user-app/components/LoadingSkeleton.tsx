export function StatCardSkeleton() {
    return (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 animate-pulse">
            <div className="flex items-center">
                <div className="p-3 rounded-xl bg-gray-200 w-12 h-12"></div>
                <div className="ml-4 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
            </div>
        </div>
    );
}

export function TransactionSkeleton() {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 animate-pulse">
            <div className="flex items-center space-x-4">
                <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
                <div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="flex items-center space-x-3">
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                        <div className="h-5 bg-gray-200 rounded w-16"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                </div>
            </div>
            <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>
    );
}

export function BalanceCardSkeleton() {
    return (
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white animate-pulse">
            <div className="flex items-center justify-between mb-4">
                <div className="h-5 bg-white/20 rounded w-24"></div>
                <div className="w-6 h-6 bg-white/20 rounded"></div>
            </div>
            <div className="space-y-4">
                <div>
                    <div className="h-4 bg-white/20 rounded w-16 mb-2"></div>
                    <div className="h-8 bg-white/20 rounded w-32"></div>
                </div>
                <div>
                    <div className="h-4 bg-white/20 rounded w-20 mb-2"></div>
                    <div className="h-6 bg-white/20 rounded w-24"></div>
                </div>
            </div>
        </div>
    );
}

export function FormCardSkeleton() {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="space-y-4">
                <div>
                    <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
                <div>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded w-full mt-6"></div>
            </div>
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            {/* Header skeleton */}
            <div>
                <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
            </div>

            {/* Stats grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <StatCardSkeleton key={i} />
                ))}
            </div>

            {/* Content grid skeleton */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <BalanceCardSkeleton />
                <div className="space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <TransactionSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}
