import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductActions from "@/components/ProductActions";

// Use 'any' to bypass strict Next.js 15/16 type mismatches with params/searchParams
export default async function ProductPage(props: any) {
    const params = await props.params;
    const { id } = params;

    if (!id) return notFound();

    const product = await prisma.product.findUnique({
        where: { id: parseInt(id) },
        include: { variants: true, category: true }
    });

    if (!product) {
        notFound();
    }

    // Parse images
    let images: string[] = [];
    try {
        const parsed = JSON.parse(product.images);
        if (Array.isArray(parsed) && parsed.length > 0) {
            images = parsed;
        } else {
            images = [product.images]; // Fallback if single string
        }
    } catch (e) {
        images = [product.images];
    }
    const mainImage = images[0];
    const categoryName = product.category?.name || 'Collection';

    return (
        <div className="min-h-screen pt-28 pb-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Minimal Breadcrumb */}
                <div className="text-sm text-gray-400 mb-8 flex items-center gap-2 uppercase tracking-tight text-xs animate-fade-in-up">
                    <Link href="/products" className="hover:text-black transition-colors">Shop</Link>
                    <span>/</span>
                    <Link href={`/products?category=${categoryName}`} className="hover:text-black transition-colors">
                        {categoryName}
                    </Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* Left: Premium Image Gallery */}
                    <div className="animate-fade-in-up">
                        <div className="bg-gray-50 rounded-2xl overflow-hidden mb-6 group cursor-zoom-in relative aspect-[4/5]">
                            <img
                                src={mainImage}
                                alt={product.name}
                                className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-700 ease-in-out"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {images.map((img, idx) => (
                                <button key={idx} className="bg-gray-50 rounded-xl overflow-hidden aspect-square hover:ring-2 ring-black transition-all">
                                    <img src={img} alt={`View ${idx}`} className="w-full h-full object-contain p-2" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Details */}
                    <div className="flex flex-col justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>

                        <div className="mb-6">
                            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight leading-tight">{product.name}</h1>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-gray-500">Item #{product.id}</span>
                                <div className="flex items-center text-black">
                                    ★★★★★ <span className="ml-2 text-gray-500 underline">(42 Reviews)</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-b border-gray-100 py-8 mb-8">
                            <div className="flex items-end gap-4 mb-4">
                                <span className="text-4xl font-bold text-black">₹{product.price.toLocaleString('en-IN')}</span>
                                {product.discount > 0 && (
                                    <>
                                        <span className="text-xl text-gray-400 line-through">
                                            ₹{Math.round(product.price / (1 - product.discount / 100)).toLocaleString('en-IN')}
                                        </span>
                                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                                            Save {product.discount}%
                                        </span>
                                    </>
                                )}
                            </div>
                            <p className="text-gray-600 leading-relaxed text-lg font-light">
                                {product.description}
                            </p>
                        </div>

                        {/* Interactive Actions */}
                        <div className="mb-8">
                            <ProductActions product={product} />
                        </div>

                        {/* Features Accordion Style */}
                        <div className="space-y-4 text-sm text-gray-600">
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                <span className="font-medium text-black">Free Express Delivery</span>
                                <span className="ml-auto text-gray-400">2-3 Days</span>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                                <span className="font-medium text-black">Authenticity Guaranteed</span>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                <span className="font-medium text-black">30-Day Returns</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
