export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 border-r">sidebar</aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
