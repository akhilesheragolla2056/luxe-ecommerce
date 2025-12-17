"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

type CartItem = {
    id: string; // CartItem ID or Product ID if temporary
    productId: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    size?: string;
    color?: string;
};

type CartContextType = {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
    removeFromCart: (itemId: string) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    total: number;
    isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { data: session } = useSession();

    // Fetch cart on load if logged in
    useEffect(() => {
        if (session?.user) {
            fetchCart();
        }
    }, [session?.user]);

    const fetchCart = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/cart');
            if (res.ok) {
                const data = await res.json();
                setItems(data.items.map((item: any) => ({
                    id: item.id,
                    productId: item.productId,
                    name: item.product.name,
                    price: item.product.price,
                    image: JSON.parse(item.product.images)[0],
                    quantity: item.quantity,
                    size: item.variant?.size,
                    color: item.variant?.color
                })));
            }
        } catch (error) {
            console.error("Failed to fetch cart", error);
        } finally {
            setIsLoading(false);
        }
    };

    const addToCart = async (newItem: Omit<CartItem, 'id'>) => {
        // Optimistic update
        const tempId = Math.random().toString(36).substr(2, 9);
        const optimisticItem = { ...newItem, id: tempId };

        setItems(prev => [...prev, optimisticItem]);
        setIsOpen(true);

        if (session?.user) {
            try {
                const res = await fetch('/api/cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        productId: newItem.productId,
                        quantity: newItem.quantity,
                        size: newItem.size,
                        color: newItem.color
                    })
                });

                if (res.ok) {
                    await fetchCart(); // Sync with server ID
                }
            } catch (error) {
                console.error("Failed to add to cart", error);
                // Revert optimistic update? For now keep it simple
            }
        }
    };

    const removeFromCart = async (itemId: string) => {
        setItems(prev => prev.filter(item => item.id !== itemId));

        if (session?.user) {
            await fetch('/api/cart', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartItemId: itemId })
            });
        }
    };

    const updateQuantity = async (itemId: string, quantity: number) => {
        setItems(prev => prev.map(item =>
            item.id === itemId ? { ...item, quantity } : item
        ));

        if (session?.user) {
            await fetch('/api/cart', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartItemId: itemId, quantity })
            });
        }
    };

    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, isOpen, setIsOpen, total, isLoading }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
