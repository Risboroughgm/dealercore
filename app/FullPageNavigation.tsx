"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function FullPageNavigation() {
  const pathname=usePathname();
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const el = (event.target as HTMLElement)?.closest("button");
      if (!el) return;
      const text = (el.textContent || "").trim().toLowerCase();
      if (text === "+ new invoice") {event.preventDefault();event.stopPropagation();window.location.href = "/invoice/new";}
      if (text === "+ sales order") {event.preventDefault();event.stopPropagation();window.location.href = "/enterprise/operations/sales-order/new";}
      if (text === "+ purchase order") {event.preventDefault();event.stopPropagation();window.location.href = "/enterprise/operations/purchase-order/new";}
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);
  if(!pathname?.startsWith('/dms') || pathname==='/dms/settings') return null;
  return <Link href="/dms/settings" className="fixed bottom-5 left-5 z-50 rounded-md border border-[#34493a] bg-[#17251b] px-3 py-2 text-xs font-semibold text-white shadow-lg hover:bg-[#243529] print:hidden">⚙ Business Settings</Link>;
}
