import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function Home() {
  const categories = await prisma.category.findMany();
  const featuredProducts = await prisma.product.findMany({
    take: 4,
    orderBy: { price: 'desc' }
  });

  // Fallback images for categories if they are missing
  const getCategoryImage = (name: string) => {
    const map: any = {
      'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80',
      'Fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80',
      'Footwear': 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&q=80',
      'Home & Kitchen': 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80',
      'Sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80',
      'Books': 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80'
    };
    return map[name] || 'https://images.unsplash.com/photo-1472851294608-4155f2118c03?auto=format&fit=crop&q=80';
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full bg-black overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
            alt="Hero"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 animate-fade-in-up">
          <span className="text-white/80 uppercase tracking-[0.2em] text-sm mb-4">New Collection 2025</span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">Redefine Your Style.</h1>
          <Link
            href="/products"
            className="bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl font-bold text-black tracking-tight">Shop by Category</h2>
          <Link href="/products" className="text-sm font-medium hover:underline underline-offset-4">View All &rarr;</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, idx) => (
            <Link
              href={`/products?category=${cat.name}`}
              key={cat.id}
              className="group flex flex-col items-center gap-4 animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-transparent group-hover:border-black transition-all p-1">
                <img
                  src={cat.image || getCategoryImage(cat.name)}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <span className="font-medium text-sm tracking-wide group-hover:text-black text-gray-600 transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-black mb-12 text-center tracking-tight">Trending Now</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => {
              let imageUrl = product.images;
              try {
                const parsed = JSON.parse(product.images);
                if (Array.isArray(parsed) && parsed.length > 0) imageUrl = parsed[0];
              } catch (e) { }

              return (
                <div key={product.id} className="group bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                  <Link href={`/products/${product.id}`}>
                    <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700"
                      />
                      {product.discount > 0 && (
                        <div className="absolute top-4 right-4 bg-black text-white text-xs font-bold px-3 py-1 rounded-full">
                          SALE
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-500 text-sm">₹{product.price.toLocaleString('en-IN')}</p>
                      <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-black text-white text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Join the Club</h2>
          <p className="text-gray-400 mb-8">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Enter your email" className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50" />
            <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors">Sign Up</button>
          </div>
        </div>
      </section>
    </main>
  );
}
