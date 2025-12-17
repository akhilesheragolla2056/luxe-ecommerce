import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({
        where: { userId: session.user.id },
        include: {
            items: {
                include: {
                    product: true,
                    variant: true,
                }
            }
        }
    });

    return NextResponse.json(cart || { items: [] });
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity, size, color } = await req.json();

    // Find or create cart
    let cart = await prisma.cart.findUnique({
        where: { userId: session.user.id }
    });

    if (!cart) {
        cart = await prisma.cart.create({
            data: { userId: session.user.id }
        });
    }

    // Find variant if size/color provided
    let variantId = null;
    if (size && color) {
        const variant = await prisma.productVariant.findFirst({
            where: {
                productId,
                size,
                color
            }
        });
        if (variant) variantId = variant.id;
    }

    // Add Item
    // Check if exists
    const existingItem = await prisma.cartItem.findFirst({
        where: {
            cartId: cart.id,
            productId,
            variantId
        }
    });

    if (existingItem) {
        await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + quantity }
        });
    } else {
        await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                variantId,
                quantity
            }
        });
    }

    return NextResponse.json({ message: "Added to cart" });
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { cartItemId } = await req.json();

    await prisma.cartItem.delete({
        where: { id: cartItemId }
    });

    return NextResponse.json({ message: "Removed from cart" });
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { cartItemId, quantity } = await req.json();

    if (quantity <= 0) {
        await prisma.cartItem.delete({ where: { id: cartItemId } });
    } else {
        await prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity }
        });
    }

    return NextResponse.json({ message: "Updated quantity" });
}
