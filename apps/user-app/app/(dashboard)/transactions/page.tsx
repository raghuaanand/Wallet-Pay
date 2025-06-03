
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";

async function getAllTransactions() {
    const session = await getServerSession(authOptions);
    const userId = Number((session?.user as any)?.id);
    if (!userId) {
        return [];
    }

    // Get OnRamp transactions
    const onRampTxns = await prisma.onRampTransaction.findMany({
        where: { userId },
        orderBy: { startTime: 'desc' }
    });

    // Get P2P transfers
    const p2pTxns = await prisma.p2pTransfer.findMany({
        where: {
            OR: [
                { fromUserId: userId },
                { toUserId: userId }
            ]
        },
        include: {
            fromUser: { select: { name: true, number: true } },
            toUser: { select: { name: true, number: true } }
        },
        orderBy: { timestamp: 'desc' }
    });

    // Transform and combine transactions
    const allTransactions: Transaction[] = [
        ...onRampTxns.map((t:any) => ({
            id: `onramp-${t.id}`,
            type: 'onramp' as const,
            amount: t.amount,
            time: t.startTime,
            status: t.status,
            provider: t.provider,
            description: `Added money via ${t.provider}`
        })),
        ...p2pTxns.map((t: any) => ({
            id: `p2p-${t.id}`,
            type: t.fromUserId === userId ? 'sent' as const : 'received' as const,
            amount: t.amount,
            time: t.timestamp,
            status: 'Success',
            user: t.fromUserId === userId ? t.toUser : t.fromUser,
            description: t.fromUserId === userId 
                ? `Sent to ${t.toUser.name}` 
                : `Received from ${t.fromUser.name}`
        }))
    ].sort((a, b) => b.time.getTime() - a.time.getTime());

    return allTransactions;
}

async function getTransactionStats() {
    const session = await getServerSession(authOptions);
    const userId = Number((session?.user as any)?.id);
    if (!userId) {
        return {
            totalAdded: 0,
            totalSent: 0,
            totalReceived: 0,
            totalTransactions: 0
        };
    }

    const [onRampTotal, p2pSent, p2pReceived, totalCount] = await Promise.all([
        prisma.onRampTransaction.aggregate({
            where: { userId, status: 'Success' },
            _sum: { amount: true },
            _count: true
        }),
        prisma.p2pTransfer.aggregate({
            where: { fromUserId: userId },
            _sum: { amount: true },
            _count: true
        }),
        prisma.p2pTransfer.aggregate({
            where: { toUserId: userId },
            _sum: { amount: true },
            _count: true
        }),
        prisma.$transaction([
            prisma.onRampTransaction.count({ where: { userId } }),
            prisma.p2pTransfer.count({
                where: {
                    OR: [{ fromUserId: userId }, { toUserId: userId }]
                }
            })
        ])
    ]);

    return {
        totalAdded: onRampTotal._sum.amount || 0,
        totalSent: p2pSent._sum.amount || 0,
        totalReceived: p2pReceived._sum.amount || 0,
        totalTransactions: totalCount[0] + totalCount[1]
    };
}

type OnRampTransaction = {
    id: string;
    type: "onramp";
    amount: number;
    time: Date;
    status: string;
    provider: string;
    description: string;
};

type P2PTransaction = {
    id: string;
    type: "sent" | "received";
    amount: number;
    time: Date;
    status: string;
    user: { name: string; number: string };
    description: string;
    provider?: undefined;
};

type Transaction = OnRampTransaction | P2PTransaction;

export default async function TransactionsPage() {
    const [transactions, stats]: [
        Transaction[],
        Awaited<ReturnType<typeof getTransactionStats>>
    ] = await Promise.all([
        getAllTransactions(),
        getTransactionStats()
    ]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">All Transactions</h1>
                <p className="text-gray-600 mt-2">Complete history of your wallet transactions and transfers.</p>
            </div>

            {/* Transaction Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Added</p>
                            <p className="text-2xl font-bold text-gray-900">₹{(stats.totalAdded / 100).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Sent</p>
                            <p className="text-2xl font-bold text-gray-900">₹{(stats.totalSent / 100).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Received</p>
                            <p className="text-2xl font-bold text-gray-900">₹{(stats.totalReceived / 100).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
                    <p className="text-sm text-gray-500 mt-1">All your wallet transactions in chronological order</p>
                </div>

                <div className="p-6">
                    {transactions.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                            <p className="text-gray-500">Your transaction history will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((transaction) => (
                                <div key={transaction.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-2 rounded-lg ${
                                            transaction.type === 'onramp' ? 'bg-green-100' :
                                            transaction.type === 'sent' ? 'bg-red-100' : 'bg-blue-100'
                                        }`}>
                                            {transaction.type === 'onramp' ? (
                                                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            ) : transaction.type === 'sent' ? (
                                                <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{transaction.description}</p>
                                            <div className="flex items-center space-x-3 mt-1">
                                                <p className="text-sm text-gray-500">{transaction.time.toDateString()}</p>
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    transaction.status === 'Success' ? 'bg-green-100 text-green-800' :
                                                    transaction.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {transaction.status}
                                                </span>
                                                {transaction.type === 'onramp' && transaction.provider && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {transaction.provider}
                                                    </span>
                                                )}
                                                {'user' in transaction && transaction.user && (
                                                    <span className="text-xs text-gray-400">
                                                        {transaction.user.number}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <p className={`text-lg font-semibold ${
                                        transaction.type === 'sent' ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                        {transaction.type === 'sent' ? '-' : '+'}₹{(transaction.amount / 100).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}