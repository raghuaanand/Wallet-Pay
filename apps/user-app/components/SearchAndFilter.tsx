"use client";

import { useState } from 'react';

interface SearchAndFilterProps {
    onSearch?: (query: string) => void;
    onFilterChange?: (filters: FilterOptions) => void;
    showDateFilter?: boolean;
    showStatusFilter?: boolean;
    showTypeFilter?: boolean;
}

interface FilterOptions {
    dateRange?: {
        start: string;
        end: string;
    };
    status?: string;
    type?: string;
}

export function SearchAndFilter({
    onSearch,
    onFilterChange,
    showDateFilter = true,
    showStatusFilter = true,
    showTypeFilter = true
}: SearchAndFilterProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<FilterOptions>({});
    const [showFilters, setShowFilters] = useState(false);

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        onSearch?.(value);
    };

    const handleFilterChange = (key: keyof FilterOptions, value: any) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange?.(newFilters);
    };

    const clearFilters = () => {
        setFilters({});
        setSearchQuery('');
        onSearch?.('');
        onFilterChange?.({});
    };

    const hasActiveFilters = Object.values(filters).some(value => 
        value !== undefined && value !== '' && 
        (typeof value === 'object' ? Object.values(value).some(v => v !== '') : true)
    ) || searchQuery !== '';

    return (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                    </svg>
                    <span>Filters</span>
                    {hasActiveFilters && (
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full">
                            Active
                        </span>
                    )}
                </button>

                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        Clear all
                    </button>
                )}
            </div>

            {/* Filter Options */}
            {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                    {showDateFilter && (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Date Range</label>
                            <div className="space-y-2">
                                <input
                                    type="date"
                                    value={filters.dateRange?.start || ''}
                                    onChange={(e) => handleFilterChange('dateRange', {
                                        ...filters.dateRange,
                                        start: e.target.value
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                    placeholder="Start date"
                                />
                                <input
                                    type="date"
                                    value={filters.dateRange?.end || ''}
                                    onChange={(e) => handleFilterChange('dateRange', {
                                        ...filters.dateRange,
                                        end: e.target.value
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                    placeholder="End date"
                                />
                            </div>
                        </div>
                    )}

                    {showStatusFilter && (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                value={filters.status || ''}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                            >
                                <option value="">All statuses</option>
                                <option value="Success">Success</option>
                                <option value="Processing">Processing</option>
                                <option value="Failure">Failure</option>
                            </select>
                        </div>
                    )}

                    {showTypeFilter && (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Transaction Type</label>
                            <select
                                value={filters.type || ''}
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                            >
                                <option value="">All types</option>
                                <option value="onramp">Money Added</option>
                                <option value="sent">Money Sent</option>
                                <option value="received">Money Received</option>
                            </select>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
