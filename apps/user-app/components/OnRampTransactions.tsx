export const OnRampTransactions = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        status: string,
        provider: string
    }[]
}) => {
    if (!transactions.length) {
        return (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-3">Recent Transactions</h2>
                <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                    <p className="text-gray-500">Your recent transactions will appear here</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-3">Recent Transactions</h2>
            <div className="space-y-3">
                {transactions.map((t, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                        <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-xl ${getStatusColor(t.status).bg}`}>
                                {getStatusIcon(t.status)}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Money Added</p>
                                <p className="text-sm text-gray-500">{t.provider}</p>
                                <p className="text-xs text-gray-400">{t.time.toDateString()}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-semibold text-green-600">+₹{(t.amount / 100).toLocaleString()}</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(t.status).text} ${getStatusColor(t.status).bg}`}>
                                {t.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function getStatusColor(status: string) {
    switch (status.toLowerCase()) {
        case 'success':
            return {
                bg: 'bg-green-100',
                text: 'text-green-800'
            };
        case 'processing':
            return {
                bg: 'bg-yellow-100',
                text: 'text-yellow-800'
            };
        case 'failure':
            return {
                bg: 'bg-red-100',
                text: 'text-red-800'
            };
        default:
            return {
                bg: 'bg-gray-100',
                text: 'text-gray-800'
            };
    }
}

function getStatusIcon(status: string) {
    const iconClass = "h-5 w-5";
    
    switch (status.toLowerCase()) {
        case 'success':
            return (
                <svg className={`${iconClass} text-green-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            );
        case 'processing':
            return (
                <svg className={`${iconClass} text-yellow-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        case 'failure':
            return (
                <svg className={`${iconClass} text-red-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            );
        default:
            return (
                <svg className={`${iconClass} text-gray-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
    }
}