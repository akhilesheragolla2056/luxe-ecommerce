export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen pt-16 bg-muted/20">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
                {/* Sidebar */}
                <aside className="w-full md:w-64 p-4 md:p-8 shrink-0">
                    <nav className="space-y-2 sticky top-24">
                        <a href="/admin" className="block px-4 py-2 rounded-lg bg-primary/5 font-medium text-primary">Dashboard</a>
                        <a href="/admin/products" className="block px-4 py-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition">Products</a>
                        <a href="/admin/orders" className="block px-4 py-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition">Orders</a>
                        <a href="/admin/users" className="block px-4 py-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition">Users</a>
                        <a href="/admin/settings" className="block px-4 py-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition">Settings</a>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
