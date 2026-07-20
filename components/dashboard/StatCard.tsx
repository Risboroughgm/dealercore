import DealerCard from "@/components/ui/DealerCard";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  colour: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  colour,
}: StatCardProps) {
  return (
    <DealerCard>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            {value}
          </h2>
        </div>

        <div
          className={`rounded-xl p-3 ${colour}`}
        >
          <Icon className="text-white" size={22} />
        </div>
      </div>
    </DealerCard>
  );
}