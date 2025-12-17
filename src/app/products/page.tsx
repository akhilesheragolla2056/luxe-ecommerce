import { prisma } from "@/lib/prisma";
import Link from "next/link";

// Force dynamic rendering since we use searchParams
export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;
    const category = Array.isArray(params.category) ? params.category[0] : params.category;
    const search = Array.isArray(params.search) ? params.search[0] : params.search;
    const sort = Array.isArray(params.sort) ? params.sort[0] : params.sort;

    // Prisma Query Builder
    const where: any = {};
    if (category && category !== 'All') {
        where.category = {
            name: category
        };
    }
    if (search) {
        where.OR = [
            { name: { contains: search } }, // Case insensitive in SQLite by default? No, usually distinct. But for basic MVP ok.
            { description: { contains: search } }
        ];
    }

    let orderBy: any = {};
    if (sort === 'price-low') orderBy = { price: 'asc' };
    else if (sort === 'price-high') orderBy = { price: 'desc' };
    else if (sort === 'newest') orderBy = { createdAt: 'desc' };
    else orderBy = { id: 'desc' }; // Default featured

    const products = await prisma.product.findMany({
        where,
        orderBy,
        include: {
            category: true,
            variants: true
        }
    });

    const categories = await prisma.category.findMany();

    return (
        <div className="min-h-screen pt-24 pb-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-6 border-b border-gray-100">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4 md:mb-0">
                        {search ? `Results for "${search}"` : category ? category : 'All Products'}
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">{products.length} items</span>

                        {/* Sort Dropdown (Client-side would be better but simple link for now or just form) */}
                        {/* Implementing simple links for sort for now is easiest without client component */}
                        <div className="flex gap-2 text-sm font-medium">
                            <Link href={{ query: { ...params, sort: 'newest' } }} className={`px-3 py-1 rounded-full ${sort === 'newest' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>Newest</Link>
                            <Link href={{ query: { ...params, sort: 'price-low' } }} className={`px-3 py-1 rounded-full ${sort === 'price-low' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>Price: Low</Link>
                            <Link href={{ query: { ...params, sort: 'price-high' } }} className={`px-3 py-1 rounded-full ${sort === 'price-high' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}`}>Price: High</Link>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Filters Sidebar */}
                    <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
                        <div>
                            <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Categories</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/products" className={`text-sm hover:text-black transition-colors ${!category ? 'font-bold text-black' : 'text-gray-500'}`}>
                                        All Products
                                    </Link>
                                </li>
                                {categories.map(cat => (
                                    <li key={cat.id}>
                                        <Link
                                            href={`/products?category=${cat.name}`}
                                            className={`text-sm hover:text-black transition-colors ${category === cat.name ? 'font-bold text-black' : 'text-gray-500'}`}
                                        >
                                            {cat.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">Price Range</h3>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                    <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" />
                                    Under ₹1,000
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                    <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" />
                                    ₹1,000 - ₹5,000
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                    <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" />
                                    ₹5,000 - ₹10,000
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                    <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black" />
                                    Over ₹10,000
                                </label>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {products.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 rounded-2xl">
                                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                                <Link href="/products" className="text-black font-medium mt-4 inline-block underline underline-offset-4">
                                    Clear Filters
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                                {products.map((product, idx) => {
                                    // Parse image
                                    let imageUrl = product.images;
                                    try {
                                        const parsed = JSON.parse(product.images);
                                        if (Array.isArray(parsed) && parsed.length > 0) imageUrl = parsed[0];
                                    } catch (e) { }

                                    return (
                                        <div
                                            key={product.id}
                                            className="group animate-fade-in-up"
                                            style={{ animationDelay: `${idx * 0.05}s` }}
                                        >
                                            <Link href={`/products/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg mb-4">
                                                <img
                                                    src={imageUrl}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain p-6 mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                                />
                                                {product.discount > 0 && (
                                                    <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
                                                        -{product.discount}%
                                                    </div>
                                                )}

                                                {/* Quick add overlay (hover) */}
                                                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                                    <button className="w-full bg-black text-white py-3 rounded-lg font-medium text-sm hover:bg-gray-900 shadow-lg">
                                                        View Details
                                                    </button>
                                                </div>
                                            </Link>

                                            <div>
                                                <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                                                <p className="text-gray-500 text-sm mt-1">{product.category.name}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="font-bold text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
                                                    {product.discount > 0 && (
                                                        <span className="text-xs text-gray-400 line-through">
                                                            ₹{Math.round(product.price / (1 - product.discount / 100)).toLocaleString('en-IN')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
