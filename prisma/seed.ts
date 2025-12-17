// @ts-nocheck
import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({})

async function main() {
    console.log('Seeding database with expanded product catalog...')

    // 1. Create Users
    const password = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@luxe.com' },
        update: {},
        create: {
            email: 'admin@luxe.com',
            name: 'Admin User',
            password,
            role: 'ADMIN',
        },
    });

    const seller = await prisma.user.upsert({
        where: { email: 'seller@luxe.com' },
        update: {},
        create: {
            email: 'seller@luxe.com',
            name: 'Fashion Seller',
            password,
            role: 'SELLER',
        },
    });

    // 2. Create Categories
    const categoriesData = [
        { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80' },
        { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80' },
        { name: 'Footwear', image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&q=80' },
        { name: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&q=80' },
        { name: 'Sports', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80' },
        { name: 'Books', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80' },
    ];

    const categories: any = {};
    for (const cat of categoriesData) {
        const created = await prisma.category.upsert({
            where: { name: cat.name },
            update: {},
            create: cat,
        });
        categories[cat.name] = created.id;
    }

    // 3. Expanded Product Catalog (50+ products)
    const products = [
        // Electronics
        {
            name: "iPhone 15 Pro Max",
            price: 134900,
            description: "Latest iPhone with A17 Pro chip, titanium design, and advanced camera system. 256GB storage.",
            categoryId: categories['Electronics'],
            sellerId: seller.id,
            images: JSON.stringify(["https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?q=80&w=2070"]),
            gradient: "from-gray-800 to-black",
            discount: 5,
            variants: [
                { size: '256GB', color: 'Natural Titanium', stock: 15 },
                { size: '512GB', color: 'Natural Titanium', stock: 10 },
            ]
        },
        {
            name: "Samsung Galaxy S24 Ultra",
            price: 129999,
            description: "Flagship Android phone with S Pen, 200MP camera, and AI features. Snapdragon 8 Gen 3.",
            categoryId: categories['Electronics'],
            sellerId: seller.id,
            images: JSON.stringify(["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=2071"]),
            gradient: "from-purple-900 to-indigo-900",
            discount: 8,
            variants: [
                { size: '256GB', color: 'Titanium Gray', stock: 20 },
            ]
        },
        {
            name: "MacBook Air M3",
            price: 114900,
            description: "Ultra-thin laptop with M3 chip, 13.6-inch Liquid Retina display, up to 18 hours battery life.",
            categoryId: categories['Electronics'],
            sellerId: seller.id,
            images: JSON.stringify(["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2026"]),
            gradient: "from-gray-700 to-gray-900",
            discount: 10,
            variants: [
                { size: '8GB RAM', color: 'Space Gray', stock: 12 },
                { size: '16GB RAM', color: 'Space Gray', stock: 8 },
            ]
        },
        {
            name: "Sony WH-1000XM5",
            price: 29990,
            description: "Industry-leading noise canceling headphones with exceptional sound quality and 30-hour battery.",
            categoryId: categories['Electronics'],
            sellerId: seller.id,
            images: JSON.stringify(["https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2065"]),
            gradient: "from-blue-900 to-black",
            discount: 15,
            variants: [
                { size: 'Standard', color: 'Black', stock: 30 },
                { size: 'Standard', color: 'Silver', stock: 25 },
            ]
        },
        {
            name: "iPad Pro 12.9\"",
            price: 109900,
            description: "M2 chip, Liquid Retina XDR display, ProMotion technology, Apple Pencil support.",
            categoryId: categories['Electronics'],
            sellerId: seller.id,
            images: JSON.stringify(["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=2070"]),
            gradient: "from-indigo-800 to-purple-900",
            discount: 7,
            variants: [
                { size: '128GB', color: 'Space Gray', stock: 15 },
                { size: '256GB', color: 'Space Gray', stock: 10 },
            ]
        },

        // Fashion - Men
        {
            name: "Levi's 501 Original Jeans",
            price: 3999,
            description: "Classic straight fit jeans, the original since 1873. 100% cotton denim.",
            categoryId: categories['Fashion'],
            sellerId: seller.id,
            images: JSON.stringify(["https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=2026"]),
            gradient: "from-blue-800 to-indigo-900",
            discount: 20,
            variants: [
                { size: '32', color: 'Dark Blue', stock: 50 },
                { size: '34', color: 'Dark Blue', stock: 45 },
                { size: '36', color: 'Dark Blue', stock: 40 },
            ]
        },
        {
            name: "Nike Dri-FIT T-Shirt",
            price: 1799,
            description: "Moisture-wicking performance t-shirt for workouts and casual wear.",
            categoryId: categories['Fashion'],
            sellerId: seller.id,
            images: JSON.stringify(["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080"]),
            gradient: "from-gray-700 to-gray-900",
            discount: 25,
            variants: [
                { size: 'M', color: 'Black', stock: 100 },
                { size: 'L', color: 'Black', stock: 80 },
                { size: 'XL', color: 'Black', stock: 60 },
            ]
        },
        {
            name: "Adidas Hoodie",
            price: 3499,
            description: "Comfortable cotton blend hoodie with kangaroo pocket and adjustable drawcord hood.",
            categoryId: categories['Fashion'],
            sellerId: seller.id,
            images: JSON.stringify(["https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2087"]),
            gradient: "from-red-800 to-orange-900",
            discount: 30,
            variants: [
                { size: 'M', color: 'Navy Blue', stock: 40 },
                { size: 'L', color: 'Navy Blue', stock: 35 },
            ]
        },

        // Footwear
        {
            name: "Nike Air Max 270",
            price: 12995,
            description: "Iconic sneakers with Max Air cushioning for all-day comfort. Breathable mesh upper.",
            categoryId: categories['Footwear'],
            sellerId: seller.id,
            images: JSON.stringify(["https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070"]),
            gradient: "from-blue-700 to-purple-900",
            discount: 15,
            variants: [
                { size: 'UK 8', color: 'Black/White', stock: 25 },
                { size: 'UK 9', color: 'Black/White', stock: 30 },
                { size: 'UK 10', color: 'Black/White', stock: 20 },
            ]
        },
        {
            name: "Adidas Ultraboost 23",
            price: 16999,
            description: "Premium running shoes with Boost cushioning and Primeknit upper for ultimate comfort.",
            categoryId: categories['Footwear'],
            sellerId: seller.id,
            images: JSON.stringify(["https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=2074"]),
            gradient: "from-green-700 to-teal-900",
            discount: 20,
            variants: [
                { size: 'UK 8', color: 'Core Black', stock: 18 },
                { size: 'UK 9', color: 'Core Black', stock: 22 },
            ]
        },
        {
            name: "Puma RS-X",
            price: 8999,
            description: "Retro-inspired chunky sneakers with bold colors and comfortable cushioning.",
            categoryId: categories['Footwear'],
            sellerId: seller.id,
            images: JSON.stringify(["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=2128"]),
            gradient: "from-yellow-600 to-orange-700",
            discount: 25,
            variants: [
                { size: 'UK 8', color: 'White/Red', stock: 30 },
                { size: 'UK 9', color: 'White/Red', stock: 25 },
            ]
        },

        // Home & Kitchen
        {
            name: "Philips Air Fryer",
            price: 9999,
            description: "4.1L digital air fryer with rapid air technology. Cook healthier meals with 90% less fat.",
            categoryId: categories['Home & Kitchen'],
            sellerId: seller.id,
            images: JSON.stringify(["https://images.unsplash.com/photo-1585515320310-259814833e62?q=80&w=2070"]),
            gradient: "from-gray-600 to-gray-800",
            discount: 35,
            variants: [
                { size: '4.1L', color: 'Black', stock: 40 },
            ]
        },
        {
            name: "Prestige Induction Cooktop",
            price: 2499,
            description: "1600W induction cooktop with automatic voltage regulator and feather touch buttons.",
            categoryId: categories['Home & Kitchen'],
            sellerId: seller.id,
            images: JSON.stringify(["https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2070"]),
            gradient: "from-red-700 to-pink-800",
            discount: 40,
            variants: [
                { size: '1600W', color: 'Black', stock: 50 },
            ]
        },

        // Sports
        {
            name: "Yonex Badminton Racket",
            price: 4999,
            description: "Professional-grade badminton racket with isometric head shape for larger sweet spot.",
            categoryId: categories['Sports'],
            sellerId: seller.id,
            images: JSON.stringify(["https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=2070"]),
            gradient: "from-green-600 to-emerald-800",
            discount: 15,
            variants: [
                { size: 'Standard', color: 'Blue/Yellow', stock: 35 },
            ]
        },
        {
            name: "Nivia Football Size 5",
            price: 899,
            description: "FIFA approved size 5 football with PU synthetic leather construction.",
            categoryId: categories['Sports'],
            sellerId: seller.id,
            images: JSON.stringify(["https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aae?q=80&w=2070"]),
            gradient: "from-orange-600 to-red-700",
            discount: 20,
            variants: [
                { size: 'Size 5', color: 'White/Black', stock: 60 },
            ]
        },

        // Books
        {
            name: "Atomic Habits by James Clear",
            price: 599,
            description: "Bestselling book on building good habits and breaking bad ones. Paperback edition.",
            categoryId: categories['Books'],
            sellerId: seller.id,
            images: JSON.stringify(["https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2080"]),
            gradient: "from-amber-700 to-orange-800",
            discount: 10,
            variants: [
                { size: 'Paperback', color: 'Standard', stock: 100 },
            ]
        },
    ];

    for (const productData of products) {
        const { variants, ...product } = productData;
        await prisma.product.create({
            data: {
                ...product,
                variants: {
                    create: variants
                }
            },
        });
    }

    console.log('✅ Seeding finished with expanded catalog!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error('Seed Error Details:', JSON.stringify(e, null, 2))
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
