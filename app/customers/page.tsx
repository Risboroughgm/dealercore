import AppShell from "@/components/layout/AppShell";
import StatCard from "@/components/dashboard/StatCard";

import {
  Users,
  Tractor,
  CalendarClock,
  FileText,
} from "lucide-react";

export default function CustomersPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Customers
          </h1>

          <p className="mt-2 text-slate-500">
            Manage customers, machines and service history.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
  <StatCard
    title="Customers"
    value="0"
    icon={Users}
    colour="bg-green-500"
  />

  <StatCard
    title="Machines"
    value="0"
    icon={Tractor}
    colour="bg-blue-500"
  />

  <StatCard
    title="Service Due"
    value="0"
    icon={CalendarClock}
    colour="bg-amber-500"
  />

  <StatCard
    title="Outstanding Quotes"
    value="0"
    icon={FileText}
    colour="bg-violet-500"
  />
</div>
        </div>
      </div>
    </AppShell>
  );
}