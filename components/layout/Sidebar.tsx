import {

  LayoutDashboard,
  Users,
  Tractor,
  Wrench,
  Package,
  PoundSterling,
  BarChart3,
  BrainCircuit,
  Settings,
} from "lucide-react";
import Link from "next/link";

const menu = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Machines", href: "/machines", icon: Tractor },
  { name: "Workshop", href: "/workshop", icon: Wrench },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Sales", href: "/sales", icon: PoundSterling },
  { name: "Finance", href: "/finance", icon: BarChart3 },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "AI Centre", href: "/aicentre", icon: BrainCircuit },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-slate-950 text-white flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-3xl font-bold text-green-400">
          DealerCore
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Dealer Management Platform
        </p>
      </div>

      <nav className="flex-1 p-4">
        <div className="mb-6">
  <p className="mb-2 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">
    Operations
  </p>

  {menu.slice(0, 4).map((item, index) => {
    const Icon = item.icon;

    return (
      <Link
  href={item.href}
        key={item.name}
        className={`mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-all ${
          index === 0
            ? "bg-green-500 text-white shadow-lg"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`}
      >
        <Icon size={20} />
        <span>{item.name}</span>
      </Link>
    );
  })}
</div>

<div className="mb-6">
  <p className="mb-2 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">
    Business
  </p>

  {menu.slice(4, 7).map((item) => {
    const Icon = item.icon;

    return (
      <button
        key={item.name}
        className="mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-slate-300 transition hover:bg-slate-800 hover:text-white"
      >
        <Icon size={20} />
        <span>{item.name}</span>
      </button>
    );
  })}
</div>

<div className="mb-6">
  <p className="mb-2 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">
    Intelligence
  </p>

  {menu.slice(7, 9).map((item) => {
    const Icon = item.icon;

    return (
      <button
        key={item.name}
        className="mb-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-slate-300 transition hover:bg-slate-800 hover:text-white"
      >
        <Icon size={20} />
        <span>{item.name}</span>
      </button>
    );
  })}
</div>

<div>
  <p className="mb-2 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">
    System
  </p>

  {menu.slice(9).map((item) => {
    const Icon = item.icon;

    return (
      <button
        key={item.name}
        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-slate-300 transition hover:bg-slate-800 hover:text-white"
      >
        <Icon size={20} />
        <span>{item.name}</span>
      </button>
    );
  })}
</div>
      
      </nav>

      <div className="border-t border-slate-800 p-4 text-sm text-slate-500">
        DealerCore v1.0
      </div>
    </aside>
  );
}