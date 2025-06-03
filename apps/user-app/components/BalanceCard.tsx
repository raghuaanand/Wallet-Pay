import { Card } from "@repo/ui/card";

export const BalanceCard = ({amount, locked}: {
    amount: number;
    locked: number;
}) => {
    return (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-3">Balance Overview</h2>
            
            <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-green-100">
                            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="font-medium text-gray-700">Available Balance</span>
                    </div>
                    <span className="text-xl font-bold text-green-600">₹{(amount / 100).toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200/50">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-yellow-100">
                            <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <span className="font-medium text-gray-700">Locked Balance</span>
                    </div>
                    <span className="text-xl font-bold text-yellow-600">₹{(locked / 100).toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <span className="font-medium text-gray-700">Total Balance</span>
                    </div>
                    <span className="text-xl font-bold text-blue-600">₹{((locked + amount) / 100).toLocaleString()}</span>
                </div>
            </div>
        </div>
    )
}