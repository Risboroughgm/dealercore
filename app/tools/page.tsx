"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "dealercore-v2";

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const iso = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

function demoStore() {
  const customerId = uid();
  const equipmentId = uid();
  const supplierId = uid();
  const invoiceId = uid();
  return {
    customers: [{ id: customerId, name: "Demo Customer", company: "Risborough Estates", phone: "01844 000000", email: "demo@example.com", address: "1 Market Square", postcode: "HP27 0AA", notes: "DealerCore test account" }],
    equipment: [{ id: equipmentId, customerId, make: "Kress", model: "KR172E", serial: "DEMO-001", type: "Robotic mower", notes: "Demo equipment record" }],
    quotes: [{ id: uid(), number: "Q-DEMO-0001", customerId, lines: [{ id: uid(), description: "Robot mower installation", qty: 1, unit: 400, vat: 20 }], status: "Sent", notes: "Demo quotation", createdAt: new Date().toISOString() }],
    invoices: [{ id: invoiceId, number: "INV-DEMO-0001", customerId, lines: [{ id: uid(), description: "Annual machinery service", qty: 1, unit: 180, vat: 20 }], status: "Part Paid", notes: "Demo invoice", dueDate: iso(14), createdAt: new Date().toISOString() }],
    payments: [{ id: uid(), invoiceId, amount: 100, date: iso(), method: "Bank transfer" }],
    workshop: [{ id: uid(), customerId, equipmentId, machine: "Kress KR172E", serial: "DEMO-001", workRequired: "Winter service and inspection", status: "In progress", labourHours: 1.5, labourRate: 65, partsCost: 18, partsSell: 35, dueDate: iso(3), notes: "Demo workshop job" }],
    diary: [{ id: uid(), customerId, title: "Follow up robot quotation", type: "Follow-up", date: iso(), time: "14:00", done: false }],
    stock: [{ id: uid(), sku: "DEMO-BLADE", description: "Robot mower blade set", qty: 12, cost: 6.5, sell: 14.95, supplierId }],
    suppliers: [{ id: supplierId, name: "Demo Supplier", contact: "Accounts", phone: "01234 000000", email: "accounts@example.com", accountNo: "DEMO-01", notes: "Test supplier" }],
    cashBuffer: 2500
  };
}

export default function ToolsPage() {
  const [raw, setRaw] = useState("");
  const [message, setMessage] = useState("");

  const refresh = () => setRaw(localStorage.getItem(STORAGE_KEY) || "");
  useEffect(() => refresh(), []);

  const summary = useMemo(() => {
    try {
      const d = raw ? JSON.parse(raw) : {};
      return {
        customers: d.customers?.length || 0,
        quotes: d.quotes?.length || 0,
        invoices: d.invoices?.length || 0,
        workshop: d.workshop?.length || 0,
        stock: d.stock?.length || 0
      };
    } catch {
      return { customers: 0, quotes: 0, invoices: 0, workshop: 0, stock: 0 };
    }
  }, [raw]);

  function exportData() {
    const data = localStorage.getItem(STORAGE_KEY) || JSON.stringify({});
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dealercore-backup-${iso()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage("Backup exported.");
  }

  async function importData(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      refresh();
      setMessage("Backup imported. Return to DealerCore and refresh.");
    } catch {
      setMessage("That file could not be imported as DealerCore JSON.");
    }
  }

  function seedDemo() {
    if (!confirm("Replace the current local preview data with safe demo data? Export a backup first if needed.")) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoStore()));
    refresh();
    setMessage("Demo data loaded. Return to DealerCore and refresh to test the workflows.");
  }

  function clearData() {
    if (!confirm("Clear all DealerCore data stored in this browser? This cannot be undone unless you exported a backup.")) return;
    localStorage.removeItem(STORAGE_KEY);
    refresh();
    setMessage("Local DealerCore data cleared.");
  }

  return (
    <main className="min-h-screen bg-[#f4f6f3] p-6 md:p-10 text-[#172018]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-[#376f2b]">DEALERCORE PREVIEW</p>
            <h1 className="mt-1 text-3xl font-bold">Data & Test Tools</h1>
            <p className="mt-2 text-sm text-[#738075]">Safe tools for validating the browser-storage version before Supabase goes live.</p>
          </div>
          <Link href="/" className="rounded-lg bg-[#376f2b] px-4 py-2 font-semibold text-white">← Back to DealerCore</Link>
        </div>

        <div className="mb-6 rounded-2xl border border-[#dbe3d9] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><strong>Current data mode: Local browser</strong><p className="mt-1 text-sm text-[#738075]">Not yet shared between devices. Supabase will replace this after testing.</p></div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">Cloud sync not connected</span>
          </div>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {Object.entries(summary).map(([label, value]) => <div key={label} className="rounded-xl border border-[#e4e8e2] bg-white p-4"><span className="block text-xs uppercase text-[#738075]">{label}</span><strong className="mt-1 block text-2xl">{value}</strong></div>)}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-[#e4e8e2] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Backup & restore</h2>
            <p className="mt-2 text-sm text-[#738075]">Export the entire current DealerCore dataset before major changes, or restore a previously exported JSON backup.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={exportData} className="rounded-lg bg-[#376f2b] px-4 py-2 font-semibold text-white">Export backup</button>
              <label className="cursor-pointer rounded-lg border border-[#ccd5cb] bg-white px-4 py-2 font-semibold">Import backup<input className="hidden" type="file" accept="application/json,.json" onChange={importData} /></label>
            </div>
          </section>

          <section className="rounded-2xl border border-[#e4e8e2] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Workflow testing</h2>
            <p className="mt-2 text-sm text-[#738075]">Load a complete dummy customer, machine, quotation, invoice, payment, workshop job, diary item, stock item and supplier.</p>
            <button onClick={seedDemo} className="mt-5 rounded-lg bg-[#173f1f] px-4 py-2 font-semibold text-white">Load demo dataset</button>
          </section>

          <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-bold text-red-800">Reset local preview</h2>
            <p className="mt-2 text-sm text-[#738075]">Only use this if you want a completely clean local test database. Export a backup first if any data matters.</p>
            <button onClick={clearData} className="mt-5 rounded-lg border border-red-300 bg-red-50 px-4 py-2 font-semibold text-red-800">Clear local DealerCore data</button>
          </section>
        </div>

        {message && <div className="mt-6 rounded-xl border border-[#cbe4ce] bg-[#e8f4e8] p-4 text-sm font-semibold text-[#2d6833]">{message}</div>}
      </div>
    </main>
  );
}
