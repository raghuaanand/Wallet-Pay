"use client"

export const TextInput = ({
    placeholder,
    onChange,
    label,
    type = "text",
    value,
    disabled = false
}: {
    placeholder: string;
    onChange: (value: string) => void;
    label: string;
    type?: string;
    value?: string;
    disabled?: boolean;
}) => {
    return <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <input 
            onChange={(e) => onChange(e.target.value)} 
            type={type}
            value={value}
            disabled={disabled}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md focus:shadow-md" 
            placeholder={placeholder} 
        />
    </div>
}