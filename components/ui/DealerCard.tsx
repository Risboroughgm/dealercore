import { ReactNode } from "react";

interface DealerCardProps {
  children: ReactNode;
}

export default function DealerCard({
  children,
}: DealerCardProps) {
  return (
    <div className="
      rounded-2xl
      border
      border-slate-200
      bg-white
      shadow-sm
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-xl
      p-6
    ">
      {children}
    </div>
  );
}