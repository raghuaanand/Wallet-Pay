"use client"
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export const SidebarItem = ({ href, title, icon }: { href: string; title: string; icon: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname()
    const selected = pathname === href

    return <div 
        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl cursor-pointer transition-all duration-200 mb-1 ${
            selected 
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg" 
                : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
        }`} 
        onClick={() => {
            router.push(href);
        }}
    >
        <div className={`mr-3 flex-shrink-0 transition-transform duration-200 ${selected ? "scale-110" : "group-hover:scale-105"}`}>
            {icon}
        </div>
        <div className="font-semibold">
            {title}
        </div>
    </div>
}