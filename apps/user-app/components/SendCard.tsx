"use client"
import { Button } from "@repo/ui/button";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2pTransfer";

export function SendCard() {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSendMoney = async () => {
        if (!number || !amount) {
            setMessage("Please fill in all fields");
            return;
        }

        if (Number(amount) <= 0) {
            setMessage("Please enter a valid amount");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const result = await p2pTransfer(number, Number(amount) * 100);
            if (result?.message) {
                setMessage(result.message);
            } else {
                setMessage("Money sent successfully!");
                setNumber("");
                setAmount("");
            }
        } catch (error) {
            console.error("Error sending money:", error);
            setMessage("Failed to send money. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
            <div className="flex items-center mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 mr-4">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Send Money</h2>
            </div>

            <div className="space-y-6">
                {/* Recipient Phone Number */}
                <div>
                    <TextInput 
                        placeholder="Enter phone number" 
                        label="Recipient Phone Number" 
                        type="tel"
                        value={number}
                        onChange={(value) => {
                            setNumber(value);
                            setMessage("");
                        }} 
                    />
                </div>

                {/* Amount */}
                <div>
                    <TextInput 
                        placeholder="Enter amount to send" 
                        label="Amount (₹)" 
                        type="number"
                        value={amount}
                        onChange={(value) => {
                            setAmount(value);
                            setMessage("");
                        }} 
                    />
                </div>

                {/* Transfer Info */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center mb-2">
                        <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium text-blue-900">Instant Transfer</span>
                    </div>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Money sent instantly</li>
                        <li>• No additional charges</li>
                        <li>• Secure and encrypted</li>
                    </ul>
                </div>

                {/* Message Display */}
                {message && (
                    <div className={`p-4 rounded-xl border ${
                        message.includes("successfully") || message.includes("sent") 
                            ? "bg-green-50 border-green-200 text-green-800" 
                            : "bg-red-50 border-red-200 text-red-800"
                    }`}>
                        <div className="flex items-center">
                            {message.includes("successfully") || message.includes("sent") ? (
                                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                            <span className="text-sm font-medium">{message}</span>
                        </div>
                    </div>
                )}

                {/* Send Button */}
                <div className="pt-2">
                    <Button 
                        onClick={handleSendMoney}
                        disabled={loading || !number || !amount || Number(amount) <= 0}
                        className="w-full"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Sending...
                            </div>
                        ) : (
                            `Send ${amount ? `₹${Number(amount).toLocaleString()}` : 'Money'}`
                        )}
                    </Button>
                </div>

                {/* Note */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-600">
                        <strong>Note:</strong> Make sure the recipient's phone number is registered with WalletPay.
                    </p>
                </div>
            </div>
        </div>
    );
}