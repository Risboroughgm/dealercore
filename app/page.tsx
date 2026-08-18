"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Tab = "dashboard" | "crm" | "quotes" | "invoices" | "workshop" | "diary";
type Customer = { id: string; name: string; phone: string; email: string; postcode: string; notes: string; createdAt: string };
type Quote = { id: string; number: string; customerId: string; description: string; net: number; vat: number; total: number; status: "Draft" | "Sent" | "Accepted" | "Rejected"; createdAt: string };
type Invoice = { id: string; number: string; customerId: string; description: string; net: number; vat: number; total: number; status: "Unpaid" | "Paid"; createdAt: string };
type WorkshopJob = { id: string; customerId: string; machine: string; serial: string; workRequired: string; status: "Booked" | "Awaiting approval" | "Awaiting parts" | "In progress" | "Finished" | "Collected"; value: number; bookedFor: string };
type DiaryItem = { id: string; customerId: string; title: string; type: "Follow-up" | "Appointment" | "Demo" | "Installation" | "Delivery"; date: string; time: string; done: boolean };

type Store = { customers: Customer[]; quotes: Quote[]; invoices: Invoice[]; workshop: WorkshopJob[]; diary: DiaryItem[]; cashBuffer: number };

const blankStore: Store = { customers: [], quotes: [], invoices: [], workshop: [], diary: [], cashBuffer: 0 };
const STORAGE_KEY = "dealercore-v1";
const money = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n || 0);
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const today = () => new Date().toISOString().slice(0, 10);
const nowTime = () => new Date().toTimeString().slice(0, 5);

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={(e) => e.stopPropagation()}><div className="modal-head"><h3>{title}</h3><button className="icon-btn" onClick={onClose}>×</button></div>{children}</div></div>;
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [store, setStore] = useState<Store>(blankStore);
  const [loaded, setLoaded] = useState(false);
  const [modal, setModal] = useState<null | "customer" | "quote" | "invoice" | "workshop" | "diary">(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setStore({ ...blankStore, ...JSON.parse(raw) });
    } catch { /* ignore corrupt local data */ }
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); }, [store, loaded]);

  const customerName = (id: string) => store.customers.find((c) => c.id === id)?.name || "Unknown customer";
  const weeklyTurnover = useMemo(() => store.invoices.filter((i) => {
    const d = new Date(i.createdAt); const n = new Date(); const day = (n.getDay() + 6) % 7; const monday = new Date(n); monday.setHours(0,0,0,0); monday.setDate(n.getDate() - day); return d >= monday;
  }).reduce((s, i) => s + i.total, 0), [store.invoices]);
  const target = 2500;
  const outstandingQuotes = store.quotes.filter((q) => q.status === "Sent" || q.status === "Draft").reduce((s, q) => s + q.total, 0);
  const unpaid = store.invoices.filter((i) => i.status === "Unpaid").reduce((s, i) => s + i.total, 0);
  const finishedValue = store.workshop.filter((j) => j.status === "Finished").reduce((s, j) => s + j.value, 0);
  const dueToday = store.diary.filter((d) => d.date === today() && !d.done);

  function addCustomer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    const c: Customer = { id: uid(), name: String(f.get("name")), phone: String(f.get("phone")), email: String(f.get("email")), postcode: String(f.get("postcode")), notes: String(f.get("notes")), createdAt: new Date().toISOString() };
    setStore((s) => ({ ...s, customers: [c, ...s.customers] })); setModal(null);
  }
  function addQuote(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget); const net = Number(f.get("net") || 0); const vat = net * 0.2;
    const q: Quote = { id: uid(), number: `Q-${String(store.quotes.length + 1).padStart(4,"0")}`, customerId: String(f.get("customerId")), description: String(f.get("description")), net, vat, total: net + vat, status: "Draft", createdAt: new Date().toISOString() };
    setStore((s) => ({ ...s, quotes: [q, ...s.quotes] })); setModal(null);
  }
  function addInvoice(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget); const net = Number(f.get("net") || 0); const vat = net * 0.2;
    const inv: Invoice = { id: uid(), number: `INV-${String(store.invoices.length + 1).padStart(4,"0")}`, customerId: String(f.get("customerId")), description: String(f.get("description")), net, vat, total: net + vat, status: "Unpaid", createdAt: new Date().toISOString() };
    setStore((s) => ({ ...s, invoices: [inv, ...s.invoices] })); setModal(null);
  }
  function addWorkshop(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    const job: WorkshopJob = { id: uid(), customerId: String(f.get("customerId")), machine: String(f.get("machine")), serial: String(f.get("serial")), workRequired: String(f.get("workRequired")), status: "Booked", value: Number(f.get("value") || 0), bookedFor: String(f.get("bookedFor")) || today() };
    setStore((s) => ({ ...s, workshop: [job, ...s.workshop] })); setModal(null);
  }
  function addDiary(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    const item: DiaryItem = { id: uid(), customerId: String(f.get("customerId")), title: String(f.get("title")), type: String(f.get("type")) as DiaryItem["type"], date: String(f.get("date")), time: String(f.get("time")), done: false };
    setStore((s) => ({ ...s, diary: [item, ...s.diary] })); setModal(null);
  }
  function convertQuote(q: Quote) {
    const inv: Invoice = { id: uid(), number: `INV-${String(store.invoices.length + 1).padStart(4,"0")}`, customerId: q.customerId, description: q.description, net: q.net, vat: q.vat, total: q.total, status: "Unpaid", createdAt: new Date().toISOString() };
    setStore((s) => ({ ...s, invoices: [inv, ...s.invoices], quotes: s.quotes.map((x) => x.id === q.id ? { ...x, status: "Accepted" } : x) })); setTab("invoices");
  }

  const nav: { id: Tab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "▦" }, { id: "crm", label: "CRM", icon: "◎" }, { id: "quotes", label: "Quotations", icon: "◇" }, { id: "invoices", label: "Invoices", icon: "£" }, { id: "workshop", label: "Workshop", icon: "⚙" }, { id: "diary", label: "Sales Diary", icon: "□" }
  ];

  const filteredCustomers = store.customers.filter((c) => `${c.name} ${c.phone} ${c.email} ${c.postcode}`.toLowerCase().includes(search.toLowerCase()));

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">DC</div><div><strong>DealerCore</strong><span>The Core of Your Dealership</span></div></div>
      <nav>{nav.map((n) => <button key={n.id} onClick={() => setTab(n.id)} className={tab === n.id ? "active" : ""}><b>{n.icon}</b>{n.label}</button>)}</nav>
      <div className="sidebar-foot"><span>Risborough Group</span><small>DealerCore V1</small></div>
    </aside>

    <main className="content">
      <header className="topbar"><div><p className="eyebrow">RISBOROUGH GROUP</p><h1>{nav.find((n) => n.id === tab)?.label}</h1></div><div className="top-actions"><span className="live-dot">● Live</span><button className="primary" onClick={() => setModal(tab === "crm" ? "customer" : tab === "quotes" ? "quote" : tab === "invoices" ? "invoice" : tab === "workshop" ? "workshop" : "diary")}>+ New</button></div></header>

      {tab === "dashboard" && <section>
        <div className="target-card"><div><p>WEEKLY TURNOVER</p><h2>{money(weeklyTurnover)} <span>/ {money(target)}</span></h2><small>{money(Math.max(0, target - weeklyTurnover))} remaining to Target One</small></div><div className="progress"><div style={{ width: `${Math.min(100, weeklyTurnover / target * 100)}%` }} /></div></div>
        <div className="stats-grid">
          <div className="stat"><span>Outstanding quotes</span><strong>{money(outstandingQuotes)}</strong><small>{store.quotes.filter(q => q.status === "Draft" || q.status === "Sent").length} active quotes</small></div>
          <div className="stat"><span>Unpaid invoices</span><strong>{money(unpaid)}</strong><small>{store.invoices.filter(i => i.status === "Unpaid").length} awaiting payment</small></div>
          <div className="stat"><span>Finished workshop</span><strong>{money(finishedValue)}</strong><small>Cash waiting to collect</small></div>
          <div className="stat"><span>Cash buffer</span><strong>{money(store.cashBuffer)}</strong><small>Target £10,000</small></div>
        </div>
        <div className="two-col">
          <div className="panel"><div className="panel-head"><h3>Today&apos;s actions</h3><button onClick={() => setModal("diary")}>+ Add</button></div>{dueToday.length ? dueToday.map((d) => <div className="action-row" key={d.id}><button className="tick" onClick={() => setStore(s => ({...s, diary:s.diary.map(x=>x.id===d.id?{...x,done:true}:x)}))}>✓</button><div><strong>{d.title}</strong><span>{d.time} · {customerName(d.customerId)} · {d.type}</span></div></div>) : <div className="empty">No actions due today. Add sales follow-ups or appointments.</div>}</div>
          <div className="panel"><div className="panel-head"><h3>Workshop attention</h3><button onClick={() => setTab("workshop")}>View all</button></div>{store.workshop.filter(j => j.status !== "Collected").slice(0,5).map((j) => <div className="action-row" key={j.id}><span className="status-dot"/><div><strong>{j.machine}</strong><span>{customerName(j.customerId)} · {j.status} · {money(j.value)}</span></div></div>)}{!store.workshop.length && <div className="empty">No workshop jobs yet.</div>}</div>
        </div>
      </section>}

      {tab === "crm" && <section><div className="toolbar"><input placeholder="Search customers..." value={search} onChange={(e)=>setSearch(e.target.value)} /><button className="primary" onClick={()=>setModal("customer")}>+ Add customer</button></div><div className="table-wrap"><table><thead><tr><th>Customer</th><th>Phone</th><th>Email</th><th>Postcode</th><th>Notes</th></tr></thead><tbody>{filteredCustomers.map(c=><tr key={c.id}><td><strong>{c.name}</strong></td><td>{c.phone || "—"}</td><td>{c.email || "—"}</td><td>{c.postcode || "—"}</td><td>{c.notes || "—"}</td></tr>)}</tbody></table>{!filteredCustomers.length&&<div className="empty">No customers found.</div>}</div></section>}

      {tab === "quotes" && <section><div className="toolbar"><p>{store.quotes.length} quotations</p><button className="primary" onClick={()=>setModal("quote")}>+ New quotation</button></div><div className="cards-list">{store.quotes.map(q=><div className="record" key={q.id}><div><span className="record-no">{q.number}</span><h3>{customerName(q.customerId)}</h3><p>{q.description}</p></div><div className="record-right"><strong>{money(q.total)}</strong><select value={q.status} onChange={(e)=>setStore(s=>({...s,quotes:s.quotes.map(x=>x.id===q.id?{...x,status:e.target.value as Quote["status"]}:x)}))}><option>Draft</option><option>Sent</option><option>Accepted</option><option>Rejected</option></select>{q.status!=="Accepted"&&<button onClick={()=>convertQuote(q)}>Convert to invoice</button>}</div></div>)}{!store.quotes.length&&<div className="empty">No quotations yet.</div>}</div></section>}

      {tab === "invoices" && <section><div className="toolbar"><p>{store.invoices.length} invoices · {money(unpaid)} outstanding</p><button className="primary" onClick={()=>setModal("invoice")}>+ New invoice</button></div><div className="cards-list">{store.invoices.map(i=><div className="record" key={i.id}><div><span className="record-no">{i.number}</span><h3>{customerName(i.customerId)}</h3><p>{i.description}</p></div><div className="record-right"><strong>{money(i.total)}</strong><button className={i.status==="Paid"?"paid":""} onClick={()=>setStore(s=>({...s,invoices:s.invoices.map(x=>x.id===i.id?{...x,status:x.status==="Paid"?"Unpaid":"Paid"}:x)}))}>{i.status}</button></div></div>)}{!store.invoices.length&&<div className="empty">No invoices yet.</div>}</div></section>}

      {tab === "workshop" && <section><div className="toolbar"><p>{store.workshop.filter(j=>j.status!=="Collected").length} active workshop jobs</p><button className="primary" onClick={()=>setModal("workshop")}>+ Book machine</button></div><div className="table-wrap"><table><thead><tr><th>Booked</th><th>Customer</th><th>Machine</th><th>Work required</th><th>Value</th><th>Status</th></tr></thead><tbody>{store.workshop.map(j=><tr key={j.id}><td>{j.bookedFor}</td><td>{customerName(j.customerId)}</td><td><strong>{j.machine}</strong><small className="block">{j.serial}</small></td><td>{j.workRequired}</td><td>{money(j.value)}</td><td><select value={j.status} onChange={(e)=>setStore(s=>({...s,workshop:s.workshop.map(x=>x.id===j.id?{...x,status:e.target.value as WorkshopJob["status"]}:x)}))}><option>Booked</option><option>Awaiting approval</option><option>Awaiting parts</option><option>In progress</option><option>Finished</option><option>Collected</option></select></td></tr>)}</tbody></table>{!store.workshop.length&&<div className="empty">No workshop jobs yet.</div>}</div></section>}

      {tab === "diary" && <section><div className="toolbar"><p>{store.diary.filter(d=>!d.done).length} open diary items</p><button className="primary" onClick={()=>setModal("diary")}>+ New diary item</button></div><div className="cards-list">{[...store.diary].sort((a,b)=>`${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)).map(d=><div className={`record ${d.done?"done":""}`} key={d.id}><div><span className="record-no">{d.date} · {d.time}</span><h3>{d.title}</h3><p>{customerName(d.customerId)} · {d.type}</p></div><div className="record-right"><button onClick={()=>setStore(s=>({...s,diary:s.diary.map(x=>x.id===d.id?{...x,done:!x.done}:x)}))}>{d.done?"Reopen":"Complete"}</button></div></div>)}{!store.diary.length&&<div className="empty">No sales diary items yet.</div>}</div></section>}
    </main>

    {modal === "customer" && <Modal title="Add customer" onClose={()=>setModal(null)}><form onSubmit={addCustomer} className="form-grid"><Field label="Customer name"><input name="name" required autoFocus/></Field><Field label="Phone"><input name="phone"/></Field><Field label="Email"><input name="email" type="email"/></Field><Field label="Postcode"><input name="postcode"/></Field><Field label="Notes"><textarea name="notes" rows={3}/></Field><button className="primary full">Save customer</button></form></Modal>}
    {modal === "quote" && <Modal title="New quotation" onClose={()=>setModal(null)}><form onSubmit={addQuote} className="form-grid"><Field label="Customer"><select name="customerId" required><option value="">Select customer</option>{store.customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Field><Field label="Description"><textarea name="description" required rows={3}/></Field><Field label="Net value (ex VAT)"><input name="net" type="number" min="0" step="0.01" required/></Field><button className="primary full">Create quotation</button></form></Modal>}
    {modal === "invoice" && <Modal title="New invoice" onClose={()=>setModal(null)}><form onSubmit={addInvoice} className="form-grid"><Field label="Customer"><select name="customerId" required><option value="">Select customer</option>{store.customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Field><Field label="Description"><textarea name="description" required rows={3}/></Field><Field label="Net value (ex VAT)"><input name="net" type="number" min="0" step="0.01" required/></Field><button className="primary full">Create invoice</button></form></Modal>}
    {modal === "workshop" && <Modal title="Book workshop job" onClose={()=>setModal(null)}><form onSubmit={addWorkshop} className="form-grid"><Field label="Customer"><select name="customerId" required><option value="">Select customer</option>{store.customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Field><Field label="Machine"><input name="machine" placeholder="e.g. Honda HRX537" required/></Field><Field label="Serial number"><input name="serial"/></Field><Field label="Booked for"><input name="bookedFor" type="date" defaultValue={today()}/></Field><Field label="Work required"><textarea name="workRequired" required rows={3}/></Field><Field label="Expected value inc VAT"><input name="value" type="number" min="0" step="0.01"/></Field><button className="primary full">Book machine</button></form></Modal>}
    {modal === "diary" && <Modal title="New sales diary item" onClose={()=>setModal(null)}><form onSubmit={addDiary} className="form-grid"><Field label="Customer"><select name="customerId"><option value="">No customer</option>{store.customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Field><Field label="Action"><input name="title" placeholder="e.g. Chase robot quotation" required/></Field><Field label="Type"><select name="type"><option>Follow-up</option><option>Appointment</option><option>Demo</option><option>Installation</option><option>Delivery</option></select></Field><div className="split"><Field label="Date"><input name="date" type="date" defaultValue={today()} required/></Field><Field label="Time"><input name="time" type="time" defaultValue={nowTime()} required/></Field></div><button className="primary full">Add to diary</button></form></Modal>}
  </div>;
}
