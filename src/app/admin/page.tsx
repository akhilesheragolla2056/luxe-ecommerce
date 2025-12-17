import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        redirect("/");
    }

    const [usersCount, productsCount, ordersCount, totalRevenue] = await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.order.count(),
        prisma.order.aggregate({
            _sum: {
                total: true,
            },
        }),
    ]);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
                    <p className="text-2xl font-bold mt-2">${totalRevenue._sum.total?.toFixed(2) || "0.00"}</p>
                </div>
                <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                    <h3 className="text-sm font-medium text-muted-foreground">Orders</h3>
                    <p className="text-2xl font-bold mt-2">{ordersCount}</p>
                </div>
                <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                    <h3 className="text-sm font-medium text-muted-foreground">Products</h3>
                    <p className="text-2xl font-bold mt-2">{productsCount}</p>
                </div>
                <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                    <h3 className="text-sm font-medium text-muted-foreground">Users</h3>
                    <p className="text-2xl font-bold mt-2">{usersCount}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                    <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                    <div className="space-y-4">
                        <Link href="/admin/products/new" className="block w-full text-center py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition">
                            Add New Product
                        </Link>
                        <Link href="/admin/orders" className="block w-full text-center py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition">
                            Manage Orders
                        </Link>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                    <h2 className="text-xl font-bold mb-4">System Status</h2>
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                        <span>Database</span>
                        <span className="text-green-500 font-medium">Connected</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                        <span>AI Engine</span>
                        <span className="text-yellow-500 font-medium">Standby</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <span>Version</span>
                        <span className="text-muted-foreground">v1.2.0</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
