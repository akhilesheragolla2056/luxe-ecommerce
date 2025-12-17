"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useEffect } from "react";

export default function CartSidebar() {
    const { isOpen, setIsOpen, items, removeFromCart, updateQuantity, total } = useCart();

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => setIsOpen(false)}
            ></div>

            {/* Sidebar */}
            <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col animate-slide-in-right border-l border-gray-100">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold tracking-tight text-gray-900">Shopping Bag ({items.length})</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-black"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Your bag is empty</h3>
                            <p className="text-gray-500">Looks like you haven't added anything yet.</p>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4 group">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-full w-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                <div className="flex flex-1 flex-col">
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                            <Link href={`/products/${item.productId}`} onClick={() => setIsOpen(false)} className="hover:underline">
                                                {item.name}
                                            </Link>
                                        </h3>
                                        <p className="ml-4">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">{item.size} {item.color !== 'Default' ? `| ${item.color}` : ''}</p>

                                    <div className="flex flex-1 items-end justify-between text-sm">
                                        <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                                            <button
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                className="px-3 py-1 hover:bg-gray-100 transition-colors text-gray-600"
                                            >
                                                -
                                            </button>
                                            <span className="px-2 font-medium text-gray-900">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="px-3 py-1 hover:bg-gray-100 transition-colors text-gray-600"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeFromCart(item.id)}
                                            className="font-medium text-red-500 hover:text-red-400 underline underline-offset-2 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-gray-100 p-6 space-y-4 bg-gray-50/50">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                            <p>Subtotal</p>
                            <p>₹{total.toLocaleString('en-IN')}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                        <div className="mt-6">
                            <Link
                                href="/checkout"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center rounded-full border border-transparent bg-black px-6 py-4 text-base font-bold text-white shadow-lg hover:bg-gray-900 transition-all hover:scale-[1.02]"
                            >
                                Checkout
                            </Link>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                            <p>
                                or{' '}
                                <button type="button" className="font-medium text-black hover:underline" onClick={() => setIsOpen(false)}>
                                    Continue Shopping <span aria-hidden="true"> &rarr;</span>
                                </button>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
