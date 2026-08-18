"use client";

import { useEffect } from "react";

export default function FullPageNavigation() {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const el = (event.target as HTMLElement)?.closest("button");
      if (!el) return;
      const text = (el.textContent || "").trim().toLowerCase();
      if (text === "+ new invoice") {
        event.preventDefault(); event.stopPropagation(); window.location.href = "/invoice/new";
      }
      if (text === "+ sales order") {
        event.preventDefault(); event.stopPropagation(); window.location.href = "/enterprise/operations/sales-order/new";
      }
      if (text === "+ purchase order") {
        event.preventDefault(); event.stopPropagation(); window.location.href = "/enterprise/operations/purchase-order/new";
      }
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);
  return null;
}
