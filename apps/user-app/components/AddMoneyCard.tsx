"use client"
import { Button } from "@repo/ui/button";
import { Select } from "@repo/ui/select";
import { useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import { createOnRampTransaction } from "../app/lib/actions/createOnRamptxn";

const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com"
}, {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/"
}];

export const AddMoney = () => {
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
    const [amount, setAmount] = useState(0);
    const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");
    const [loading, setLoading] = useState(false);

    const handleAddMoney = async () => {
        if (amount <= 0) {
            alert("Please enter a valid amount");
            return;
        }
        
        setLoading(true);
        try {
            await createOnRampTransaction(amount * 100, provider);
            window.location.href = redirectUrl || "";
        } catch (error) {
            console.error("Error adding money:", error);
            alert("Failed to add money. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
            <div className="flex items-center mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 mr-4">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                    </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Add Money to Wallet</h2>
            </div>

            <div className="space-y-6">
                {/* Amount Input */}
                <div>
                    <TextInput 
                        label="Amount (₹)" 
                        placeholder="Enter amount to add" 
                        type="number"
                        onChange={(value) => {
                            setAmount(Number(value))
                        }} 
                    />
                </div>

                {/* Bank Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Bank</label>
                    <Select 
                        onSelect={(value) => {
                            setRedirectUrl(SUPPORTED_BANKS.find(x => x.name === value)?.redirectUrl || "")
                            setProvider(SUPPORTED_BANKS.find(x => x.name === value)?.name || "")
                        }} 
                        options={SUPPORTED_BANKS.map(x => ({
                            key: x.name,
                            value: x.name
                        }))} 
                    />
                </div>

                {/* Bank Features */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center mb-2">
                        <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium text-blue-900">Secure Banking</span>
                    </div>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Bank-grade security</li>
                        <li>• Instant money transfer</li>
                        <li>• 24/7 support available</li>
                    </ul>
                </div>

                {/* Add Money Button */}
                <div className="pt-2">
                    <Button 
                        onClick={handleAddMoney}
                        disabled={loading || amount <= 0}
                        className="w-full"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </div>
                        ) : (
                            `Add ₹${amount.toLocaleString()} to Wallet`
                        )}
                    </Button>
                </div>

                {/* Note */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600">
                        <strong>Note:</strong> You will be redirected to your bank's secure payment gateway to complete the transaction.
                    </p>
                </div>
            </div>
        </div>
    );
}