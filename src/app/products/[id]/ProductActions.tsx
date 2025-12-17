"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductActions({ product }: { product: any }) {
    const { addToCart, setIsOpen } = useCart();
    const [selectedSize, setSelectedSize] = useState('M');
    const [isAdding, setIsAdding] = useState(false);
    const router = useRouter();

    const handleAddToCart = async () => {
        setIsAdding(true);
        let image = product.images;
        try {
            const parsed = JSON.parse(product.images);
            if (Array.isArray(parsed) && parsed.length > 0) image = parsed[0];
        } catch (e) { }

        await addToCart({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: image,
            quantity: 1,
            size: selectedSize,
            color: product.variants?.find((v: any) => v.size === selectedSize)?.color || 'Default'
        });
        setTimeout(() => setIsAdding(false), 500);
    };

    const handleBuyNow = async () => {
        await handleAddToCart();
        setIsOpen(false);
        router.push('/checkout');
    };

    return (
        <div className="space-y-6">
            {/* Size Selector */}
            {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Select Size</label>
                    <div className="flex flex-wrap gap-2">
                        {['S', 'M', 'L', 'XL'].map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${selectedSize === size ? 'bg-black text-white shadow-lg transform scale-105' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 bg-black text-white py-4 px-6 rounded-full font-bold text-sm tracking-wide hover:opacity-90 transition-all shadow-xl shadow-black/10 disabled:opacity-70 disabled:cursor-wait"
                >
                    {isAdding ? "ADDING..." : "ADD TO BAG"}
                </button>

                <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-white text-black border border-gray-200 py-4 px-6 rounded-full font-bold text-sm tracking-wide hover:bg-gray-50 transition-all"
                >
                    BUY NOW
                </button>
            </div>

            <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                    <span>Free Shipping</span>
                </div>
            </div>
        </div>
    );
}
