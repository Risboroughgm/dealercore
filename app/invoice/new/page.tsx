"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Customer={id:string;name:string;company?:string};
type Line={id:string;description:string;qty:number;unit:number;vat:number};
const K="dealercore-v2";
const money=(n:number)=>new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP"}).format(n||0);
const uid=()=>crypto.randomUUID();

export default function NewInvoice(){
 const [customers,setCustomers]=useState<Customer[]>([]); const [store,setStore]=useState<any>({});
 const [customerId,setCustomerId]=useState(""); const [dueDate,setDueDate]=useState(new Date(Date.now()+14*86400000).toISOString().slice(0,10));
 const [reference,setReference]=useState(""); const [notes,setNotes]=useState(""); const [lines,setLines]=useState<Line[]>([{id:uid(),description:"",qty:1,unit:0,vat:20}]);
 useEffect(()=>{try{const s=JSON.parse(localStorage.getItem(K)||"{}");setStore(s);setCustomers(s.customers||[])}catch{}},[]);
 const totals=useMemo(()=>{const net=lines.reduce((s,l)=>s+l.qty*l.unit,0);const vat=lines.reduce((s,l)=>s+l.qty*l.unit*l.vat/100,0);return{net,vat,total:net+vat}},[lines]);
 function save(){if(!customerId){alert("Select a customer first.");return}const invoices=store.invoices||[];const invoice={id:uid(),number:`INV-${String(invoices.length+1).padStart(4,"0")}`,customerId,lines,status:"Unpaid",notes:[reference?`Reference: ${reference}`:"",notes].filter(Boolean).join("\n"),dueDate,createdAt:new Date().toISOString()};const next={...store,invoices:[invoice,...invoices]};localStorage.setItem(K,JSON.stringify(next));window.location.href="/"}
 return <main className="doc-workspace"><header className="doc-workspace-head"><div><p>DEALERCORE / ACCOUNTS RECEIVABLE</p><h1>New Invoice</h1><span>Create, review and post a customer invoice.</span></div><div><Link href="/" className="secondary">Close</Link><button className="primary" onClick={save}>Save invoice</button></div></header>
 <div className="doc-workspace-grid"><section className="doc-main"><div className="doc-section"><h2>Customer & document details</h2><div className="doc-fields three"><label><span>Customer</span><select value={customerId} onChange={e=>setCustomerId(e.target.value)}><option value="">Select customer</option>{customers.map(c=><option key={c.id} value={c.id}>{c.company||c.name}</option>)}</select></label><label><span>Due date</span><input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)}/></label><label><span>Customer reference / PO</span><input value={reference} onChange={e=>setReference(e.target.value)} placeholder="Optional reference"/></label></div></div>
 <div className="doc-section"><div className="doc-section-head"><h2>Invoice lines</h2><button className="secondary" onClick={()=>setLines(v=>[...v,{id:uid(),description:"",qty:1,unit:0,vat:20}])}>+ Add line</button></div><div className="doc-line-head"><span>Description</span><span>Qty</span><span>Unit ex VAT</span><span>VAT</span><span>Line total</span><span></span></div>{lines.map(l=><div className="doc-line" key={l.id}><input value={l.description} onChange={e=>setLines(v=>v.map(x=>x.id===l.id?{...x,description:e.target.value}:x))} placeholder="Product, labour or service"/><input type="number" value={l.qty} onChange={e=>setLines(v=>v.map(x=>x.id===l.id?{...x,qty:+e.target.value}:x))}/><input type="number" step="0.01" value={l.unit} onChange={e=>setLines(v=>v.map(x=>x.id===l.id?{...x,unit:+e.target.value}:x))}/><select value={l.vat} onChange={e=>setLines(v=>v.map(x=>x.id===l.id?{...x,vat:+e.target.value}:x))}><option value="20">20%</option><option value="5">5%</option><option value="0">0%</option></select><strong>{money(l.qty*l.unit*(1+l.vat/100))}</strong><button onClick={()=>setLines(v=>v.filter(x=>x.id!==l.id))}>×</button></div>)}</div>
 <div className="doc-section"><h2>Internal / customer notes</h2><textarea rows={6} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Payment terms, installation notes, warranty information or other invoice notes..."/></div></section>
 <aside className="doc-summary"><div className="doc-summary-card"><span>DOCUMENT TOTAL</span><div><small>Net</small><b>{money(totals.net)}</b></div><div><small>VAT</small><b>{money(totals.vat)}</b></div><div className="grand"><small>Total</small><strong>{money(totals.total)}</strong></div></div><div className="doc-summary-card"><span>WORKFLOW</span><p><b>1.</b> Select account</p><p><b>2.</b> Add invoice lines</p><p><b>3.</b> Check VAT and reference</p><p><b>4.</b> Save to receivables</p></div></aside></div>
 <footer className="doc-sticky"><Link href="/" className="secondary">Cancel / Close</Link><div><span>Total {money(totals.total)}</span><button className="primary" onClick={save}>Save invoice</button></div></footer></main>
}