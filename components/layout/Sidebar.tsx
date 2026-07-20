export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold text-green-400">
        DealerCore
      </h1>

      <nav className="mt-8 space-y-3">
        <p>Dashboard</p>
        <p>Customers</p>
        <p>Machines</p>
        <p>Workshop</p>
        <p>Inventory</p>
        <p>Sales</p>
        <p>Finance</p>
        <p>Analytics</p>
        <p>AI Centre</p>
        <p>Settings</p>
      </nav>
    </aside>
  );
}