import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProductActions from "./ProductActions"; // We might need to make a shared component or just inline a simpler version

export const dynamic = 'force-dynamic';

export default async function DealsPage() {
    const deals = await prisma.product.findMany({
        where: {
            discount: {
                gt: 0
            }
        },
        orderBy: {
            discount: 'desc'
        },
        include: {
            variants: true
        }
    });

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Exclusive Deals</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">Limited time offers on our premium collection.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {deals.map((product, idx) => {
                        // Parse image
                        let imageUrl = product.images;
                        try {
                            const parsed = JSON.parse(product.images);
                            if (Array.isArray(parsed) && parsed.length > 0) imageUrl = parsed[0];
                        } catch (e) { }

                        return (
                            <div
                                key={product.id}
                                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 animate-fade-in-up"
                                style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                                <Link href={`/products/${product.id}`}>
                                    <div className="aspect-[3/4] relative overflow-hidden bg-gray-50">
                                        <img
                                            src={imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                            -{product.discount}% OFF
                                        </div>
                                    </div>
                                </Link>

                                <div className="p-6">
                                    <h3 className="font-semibold text-gray-900 mb-2 truncate">{product.name}</h3>
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-lg font-bold text-black">₹{product.price.toLocaleString('en-IN')}</span>
                                        <span className="text-sm text-gray-400 line-through">
                                            ₹{Math.round(product.price / (1 - product.discount / 100)).toLocaleString('en-IN')}
                                        </span>
                                    </div>

                                    <Link
                                        href={`/products/${product.id}`}
                                        className="block w-full text-center bg-black text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition-colors"
                                    >
                                        View Deal
                                    </Link>
                                </div>
                            </div>
                        );
                    })}

                    {deals.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            No active deals right now. Check back later!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
