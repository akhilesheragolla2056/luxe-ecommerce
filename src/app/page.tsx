import Link from "next/link";
import { PRODUCTS } from "@/lib/data";

const FEATURED_PRODUCTS = PRODUCTS.slice(0, 3);


export default function Home() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl opacity-50"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 dark:from-white dark:via-indigo-300 dark:to-white animate-fade-in-up">
            REDEFINE <br /> YOUR STYLE
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light">
            Premium streetwear for the modern visionary. Experience functionality meets aesthetics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg hover:bg-primary/90 hover:scale-105 transition-all shadow-xl shadow-primary/25"
            >
              Shop Collection
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 bg-secondary text-secondary-foreground rounded-full font-semibold text-lg hover:bg-secondary/80 transition-all border border-border"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Trending Now</h2>
            <p className="text-muted-foreground">Curated picks for this season.</p>
          </div>
          <Link href="/products" className="hidden md:block text-primary font-medium hover:underline">
            View all products &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_PRODUCTS.map((product) => (
            <div key={product.id} className="group relative">
              <div className={`aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gradient-to-br ${product.gradient} shadow-lg relative`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>

                {/* Overlay Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="glass rounded-xl p-4 flex justify-between items-center backdrop-blur-md">
                    <div>
                      <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">{product.category}</p>
                      <h3 className="text-lg font-bold text-white">{product.name}</h3>
                    </div>
                    <span className="text-white font-bold">${product.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link href="/products" className="text-primary font-medium hover:underline">
            View all products &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
