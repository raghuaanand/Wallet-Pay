"use client"
export const Select = ({ options, onSelect, label }: {
    onSelect: (value: string) => void;
    options: {
        key: string;
        value: string;
    }[];
    label?: string;
}) => {
    return <div className="mb-4">
        {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
        <select 
            onChange={(e) => {
                onSelect(e.target.value)
            }} 
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 shadow-sm hover:shadow-md focus:shadow-md cursor-pointer"
        >
            {options.map(option => <option key={option.key} value={option.key}>{option.value}</option>)}
        </select>
    </div>
}