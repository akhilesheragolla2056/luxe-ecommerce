"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const { items, total } = useCart();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    const [form, setForm] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
    });

    const handleInput = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePayment = async (e: any) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsProcessing(false);
        alert("Order placed successfully! (Simulation)");
        router.push('/');
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-3xl font-light mb-4 text-gray-900">Your bag is empty</h1>
                <Link href="/products" className="text-sm font-medium text-black underline underline-offset-4 hover:text-gray-600 transition-colors">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f8f8] pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Form */}
                    <div className="lg:col-span-7 space-y-8 animate-fade-in-up">

                        {/* 1. Contact Info */}
                        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-medium mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm">1</span>
                                Contact Information
                            </h2>
                            <div className="space-y-4">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email address"
                                    className="w-full bg-gray-50 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black/5 transition-all outline-none"
                                    onChange={handleInput}
                                />
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="news" className="rounded border-gray-300 text-black focus:ring-black" />
                                    <label htmlFor="news" className="text-sm text-gray-500">Email me with news and offers</label>
                                </div>
                            </div>
                        </section>

                        {/* 2. Shipping Address */}
                        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-medium mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm">2</span>
                                Shipping Address
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <input name="firstName" placeholder="First name" className="col-span-1 bg-gray-50 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black/5 outline-none" onChange={handleInput} />
                                <input name="lastName" placeholder="Last name" className="col-span-1 bg-gray-50 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black/5 outline-none" onChange={handleInput} />
                                <input name="address" placeholder="Address" className="col-span-2 bg-gray-50 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black/5 outline-none" onChange={handleInput} />
                                <input name="city" placeholder="City" className="col-span-1 bg-gray-50 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black/5 outline-none" onChange={handleInput} />
                                <input name="postalCode" placeholder="Postal code" className="col-span-1 bg-gray-50 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black/5 outline-none" onChange={handleInput} />
                            </div>
                        </section>

                        {/* 3. Payment */}
                        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-medium mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm">3</span>
                                Payment Method
                            </h2>

                            <div className="space-y-4">
                                <div className="flex gap-4 mb-6">
                                    <div className="flex-1 border-2 border-black rounded-xl p-4 flex items-center justify-center cursor-pointer bg-gray-50">
                                        <span className="font-semibold text-sm">Credit Card</span>
                                    </div>
                                    <div className="flex-1 border border-gray-200 rounded-xl p-4 flex items-center justify-center cursor-pointer hover:border-gray-300">
                                        <span className="font-medium text-sm text-gray-500">PayPal</span>
                                    </div>
                                    <div className="flex-1 border border-gray-200 rounded-xl p-4 flex items-center justify-center cursor-pointer hover:border-gray-300">
                                        <span className="font-medium text-sm text-gray-500">UPI</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <input name="cardNumber" placeholder="Card number" className="w-full bg-gray-50 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black/5 outline-none font-mono text-sm" onChange={handleInput} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input name="expiry" placeholder="MM / YY" className="bg-gray-50 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black/5 outline-none font-mono text-sm" onChange={handleInput} />
                                        <input name="cvc" placeholder="CVC" className="bg-gray-50 border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black/5 outline-none font-mono text-sm" onChange={handleInput} />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className="w-full bg-black text-white rounded-full py-4 font-bold text-lg hover:bg-gray-900 transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-black/10 disabled:opacity-70 disabled:cursor-wait"
                        >
                            {isProcessing ? "Processing..." : `Pay ₹${total.toLocaleString('en-IN')}`}
                        </button>

                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-medium mb-6">Order Summary</h2>

                            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                                            <div className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                                                {item.quantity}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h4>
                                            <p className="text-xs text-gray-500 mt-1">{item.size && `Size: ${item.size}`}</p>
                                        </div>
                                        <div className="text-sm font-medium">
                                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 mt-6 pt-6 space-y-3">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Subtotal</span>
                                    <span>₹{total.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-100 mt-3">
                                    <span>Total</span>
                                    <span>₹{total.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
