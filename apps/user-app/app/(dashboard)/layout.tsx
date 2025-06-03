"use client";

import { SidebarItem } from "../../components/SidebarItem";
import { useState } from 'react';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-transparent">
        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileMenuOpen(false)} />
                <div className="fixed top-0 left-0 z-50 w-64 h-full bg-white/95 backdrop-blur-xl shadow-xl">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">WalletPay</h2>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <nav className="p-4 space-y-2">
                        <SidebarItem href={"/dashboard"} icon={<HomeIcon />} title="Dashboard" />
                        <SidebarItem href={"/transfer"} icon={<TransferIcon />} title="Add Money" />
                        <SidebarItem href={"/transactions"} icon={<TransactionsIcon />} title="Transactions" />
                        <SidebarItem href={"/p2p"} icon={<P2PTransferIcon />} title="Send Money" />
                    </nav>
                </div>
            </div>
        )}

        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:pt-16">
            <div className="flex flex-col flex-1 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl">
                <div className="flex flex-col flex-1 pt-8 pb-4 overflow-y-auto">
                    <nav className="flex-1 px-4 space-y-2">
                        <SidebarItem href={"/dashboard"} icon={<HomeIcon />} title="Dashboard" />
                        <SidebarItem href={"/transfer"} icon={<TransferIcon />} title="Add Money" />
                        <SidebarItem href={"/transactions"} icon={<TransactionsIcon />} title="Transactions" />
                        <SidebarItem href={"/p2p"} icon={<P2PTransferIcon />} title="Send Money" />
                    </nav>
                </div>
            </div>
        </div>
        
        {/* Main content */}
        <div className="flex flex-col flex-1 lg:ml-72">
            {/* Mobile header */}
            <div className="lg:hidden bg-white/80 backdrop-blur-xl border-b border-gray-200/50 px-4 py-3">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-900">WalletPay</h1>
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                {children}
            </main>
        </div>
    </div>
  );
}

// Icons Fetched from https://heroicons.com/
function HomeIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
}

function P2PTransferIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
  </svg>

}
function TransferIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
  </svg>
}

function TransactionsIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
  
}