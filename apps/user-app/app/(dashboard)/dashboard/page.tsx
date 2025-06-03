
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransactions";

async function getBalance() {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

async function getOnRampTransactions() {
    const session = await getServerSession(authOptions);
    const txns = await prisma.onRampTransaction.findMany({
        where: {
            userId: Number(session?.user?.id)
        },
        orderBy: {
            startTime: 'desc'
        },
        take: 5
    });
    return txns.map(t => ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }))
}

async function getP2PTransactions() {
    const session = await getServerSession(authOptions);
    const txns = await prisma.p2pTransfer.findMany({
        where: {
            OR: [
                { fromUserId: Number(session?.user?.id) },
                { toUserId: Number(session?.user?.id) }
            ]
        },
        include: {
            fromUser: { select: { name: true } },
            toUser: { select: { name: true } }
        },
        orderBy: {
            timestamp: 'desc'
        },
        take: 5
    });
    
    return txns.map(t => ({
        time: t.timestamp,
        amount: t.amount,
        type: t.fromUserId === Number(session?.user?.id) ? 'sent' : 'received',
        name: t.fromUserId === Number(session?.user?.id) ? t.toUser.name : t.fromUser.name
    }))
}

export default async function Dashboard() {
    const balance = await getBalance();
    const onRampTransactions = await getOnRampTransactions();
    const p2pTransactions = await getP2PTransactions();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome back! Here's your wallet overview.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* Total Balance */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
                            <WalletIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Balance</p>
                            <p className="text-2xl font-bold text-gray-900">₹{((balance.amount + balance.locked) / 100).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Available Balance */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600">
                            <CheckIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Available</p>
                            <p className="text-2xl font-bold text-gray-900">₹{(balance.amount / 100).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Locked Balance */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600">
                            <LockIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Locked</p>
                            <p className="text-2xl font-bold text-gray-900">₹{(balance.locked / 100).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Total Transactions */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600">
                            <ChartIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                            <p className="text-2xl font-bold text-gray-900">{onRampTransactions.length + p2pTransactions.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Balance Card */}
                <div className="space-y-6">
                    <BalanceCard amount={balance.amount} locked={balance.locked} />
                </div>

                {/* Recent Transactions */}
                <div className="space-y-6">
                    <OnRampTransactions transactions={onRampTransactions} />
                </div>
            </div>

            {/* Recent P2P Transfers */}
            {p2pTransactions.length > 0 && (
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">Recent P2P Transfers</h3>
                    <div className="space-y-3">
                        {p2pTransactions.map((transfer, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg ${transfer.type === 'sent' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                        {transfer.type === 'sent' ? 
                                            <ArrowUpIcon className="h-4 w-4" /> : 
                                            <ArrowDownIcon className="h-4 w-4" />
                                        }
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {transfer.type === 'sent' ? 'Sent to' : 'Received from'} {transfer.name || 'Unknown'}
                                        </p>
                                        <p className="text-sm text-gray-500">{transfer.time.toDateString()}</p>
                                    </div>
                                </div>
                                <p className={`font-semibold ${transfer.type === 'sent' ? 'text-red-600' : 'text-green-600'}`}>
                                    {transfer.type === 'sent' ? '-' : '+'}₹{(transfer.amount / 100).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Icon components
function WalletIcon({ className }: { className: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
    );
}

function CheckIcon({ className }: { className: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    );
}

function LockIcon({ className }: { className: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
    );
}

function ChartIcon({ className }: { className: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
    );
}

function ArrowUpIcon({ className }: { className: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
    );
}

function ArrowDownIcon({ className }: { className: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
    );
}