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

const menu = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Customers", icon: Users },
  { name: "Machines", icon: Tractor },
  { name: "Workshop", icon: Wrench },
  { name: "Inventory", icon: Package },
  { name: "Sales", icon: PoundSterling },
  { name: "Finance", icon: BarChart3 },
  { name: "Analytics", icon: BarChart3 },
  { name: "AI Centre", icon: BrainCircuit },
  { name: "Settings", icon: Settings },
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
        {menu.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={`w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-all ${
                index === 0
                  ? "bg-green-500 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={20} />

              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-4 text-sm text-slate-500">
        DealerCore v1.0
      </div>
    </aside>
  );
}