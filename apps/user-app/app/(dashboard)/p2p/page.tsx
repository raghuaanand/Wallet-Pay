import { SendCard } from "../../../components/SendCard";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";

async function getBalance() {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.email) // Use email as a unique identifier if 'id' does not exist
        }
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

async function getRecentP2PTransfers() {
    const session = await getServerSession(authOptions);
    // Find the user by email to get their numeric ID
    const user = await prisma.user.findUnique({
        where: { email: session?.user?.email || undefined }
    });
    const userId = user?.id;

    const transfers = await prisma.p2pTransfer.findMany({
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
        orderBy: {
            timestamp: 'desc'
        },
        take: 10
    });
    
    return transfers.map((t:any) => ({
        id: t.id,
        time: t.timestamp,
        amount: t.amount,
        type: t.fromUserId === userId ? 'sent' : 'received',
        user: t.fromUserId === userId ? 
            { name: t.toUser.name, number: t.toUser.number } : 
            { name: t.fromUser.name, number: t.fromUser.number }
    }))
}

export default async function P2PPage() {
    const balance = await getBalance();
    const recentTransfers = await getRecentP2PTransfers();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Send Money</h1>
                <p className="text-gray-600 mt-2">Send money instantly to other WalletPay users.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Available Balance</p>
                            <p className="text-2xl font-bold text-gray-900">₹{(balance.amount / 100).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Transfers</p>
                            <p className="text-2xl font-bold text-gray-900">{recentTransfers.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Last 30 Days</p>
                            <p className="text-2xl font-bold text-gray-900">
                                ₹{(recentTransfers.reduce((sum, t) => sum + (t.type === 'sent' ? t.amount : 0), 0) / 100).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Send Money Form */}
                <div>
                    <SendCard />
                </div>

                {/* Recent Transfers */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-3">Recent Transfers</h2>
                    
                    {recentTransfers.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No transfers yet</h3>
                            <p className="text-gray-500">Your recent money transfers will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentTransfers.map((transfer) => (
                                <div key={transfer.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-3 rounded-xl ${transfer.type === 'sent' ? 'bg-red-100' : 'bg-green-100'}`}>
                                            {transfer.type === 'sent' ? (
                                                <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {transfer.type === 'sent' ? 'Sent to' : 'Received from'} {transfer.user.name || 'Unknown'}
                                            </p>
                                            <p className="text-sm text-gray-500">{transfer.user.number}</p>
                                            <p className="text-xs text-gray-400">{transfer.time.toDateString()}</p>
                                        </div>
                                    </div>
                                    <p className={`text-lg font-semibold ${transfer.type === 'sent' ? 'text-red-600' : 'text-green-600'}`}>
                                        {transfer.type === 'sent' ? '-' : '+'}₹{(transfer.amount / 100).toLocaleString()}
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