import AppShell from "@/components/layout/AppShell";
import StatCard from "@/components/dashboard/StatCard";
import {
  Banknote,
  Wrench,
  Tractor,
  Users,
} from "lucide-react";

export default function Home() {
  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Welcome back, Jonathan.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Today's Revenue"
            value="£0.00"
            icon={Banknote}
            colour="bg-emerald-500"
          />

          <StatCard
            title="Workshop Jobs"
            value="0"
            icon={Wrench}
            colour="bg-blue-500"
          />

          <StatCard
            title="Machines Sold"
            value="0"
            icon={Tractor}
            colour="bg-amber-500"
          />

          <StatCard
            title="Customers"
            value="0"
            icon={Users}
            colour="bg-violet-500"
          />
        </div>
      </div>
    </AppShell>
  );
}