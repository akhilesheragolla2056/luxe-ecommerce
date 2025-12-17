"use client";

import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { data: session } = useSession();
    const { items, setIsOpen } = useCart();
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <nav className="fixed w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo (Left) */}
                    <div className="flex-shrink-0 flex items-center gap-8">
                        <Link href="/" className="group">
                            <span className="text-2xl font-bold tracking-tighter text-black">LUXE<span className="text-blue-600">.</span></span>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Shop</Link>
                            <Link href="/products?category=Fashion" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Fashion</Link>
                            <Link href="/products?category=Electronics" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Electronics</Link>
                            <Link href="/deals" className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">Deals</Link>
                        </div>
                    </div>

                    {/* Search (Center - Hidden on mobile) */}
                    <div className="hidden md:block flex-1 max-w-md mx-8">
                        <div className="relative group">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Search products..."
                                className="w-full bg-gray-50 border-0 rounded-full py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-black/5 transition-all group-hover:bg-gray-100"
                            />
                            <svg
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors cursor-pointer"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                onClick={handleSearch}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Icons (Right) */}
                    <div className="flex items-center space-x-6">
                        {session?.user ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-black transition-colors">
                                    <span>{session.user.name?.split(' ')[0]}</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                {/* Dropdown */}
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right">
                                    <div className="py-1">
                                        <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                                        <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Orders</Link>
                                        {(session.user as any).role === 'ADMIN' && (
                                            <Link href="/admin" className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-50">Admin Dashboard</Link>
                                        )}
                                        <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Sign Out</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-black">
                                Sign In
                            </Link>
                        )}

                        <button
                            onClick={() => setIsOpen(true)}
                            className="relative p-2 text-gray-700 hover:text-black transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {items.length > 0 && (
                                <span className="absolute top-0 right-0 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold animate-fade-in-up">
                                    {items.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
