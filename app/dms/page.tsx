"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import DmsShell from "../DmsShell";
import {createClient} from "../../lib/supabase/client";
import {getCloudContext} from "../../lib/dealercore/cloud";

type Period="daily"|"weekly"|"monthly"|"quarterly";
type Core={customers:any[];workshop:any[];diary:any[];stock:any[];suppliers:any[];cashBuffer:number};
const K="dealercore-v2",PK="dealercore-enterprise-pos";
const money=(n:number)=>new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP",maximumFractionDigits:0}).format(n||0);
const lineNet=(l:any)=>(+l.quantity||0)*(+l.unit_price||0)*(1-(+l.discount_percent||0)/100);
const invoiceTotal=(i:any)=>(i.invoice_lines||[]).reduce((s:number,l:any)=>s+lineNet(l)*(1+(+l.vat_percent||0)/100),0);
const orderTotal=(o:any)=>(o.sales_order_lines||[]).reduce((s:number,l:any)=>s+lineNet(l),0);
const quoteTotal=(q:any)=>(q.quote_lines||[]).reduce((s:number,l:any)=>s+lineNet(l)*(1+(+l.vat_percent||0)/100),0);
function dateKey(d:Date){return d.toISOString().slice(0,10)}
function periodStart(period:Period){const d=new Date();d.setHours(0,0,0,0);if(period==='weekly'){const day=d.getDay()||7;d.setDate(d.getDate()-day+1)}if(period==='monthly'){d.setDate(1)}if(period==='quarterly'){d.setMonth(Math.floor(d.getMonth()/3)*3,1)}return dateKey(d)}
function periodLabel(period:Period){return ({daily:'Today',weekly:'This week',monthly:'This month',quarterly:'This quarter'} as Record<Period,string>)[period]}

export default function DmsHome(){
 const [core,setCore]=useState<Core>({customers:[],workshop:[],diary:[],stock:[],suppliers:[],cashBuffer:0});
 const [pos,setPos]=useState<any[]>([]);
 const [period,setPeriod]=useState<Period>('weekly');
 const [cloud,setCloud]=useState<any>({invoices:[],payments:[],orders:[],quotes:[],opps:[]});
 const [loading,setLoading]=useState(true),[cloudError,setCloudError]=useState('');
 useEffect(()=>{try{const local=JSON.parse(localStorage.getItem(K)||"{}");setCore(s=>({...s,...local}));setPos(JSON.parse(localStorage.getItem(PK)||"[]"))}catch{};(async()=>{try{const supabase=createClient();const ctx=await getCloudContext();const [{data:invoices,error:ie},{data:payments,error:pe},{data:orders,error:oe},{data:quotes,error:qe},{data:opps,error:ope}]=await Promise.all([
  supabase.from('invoices').select('*,invoice_lines(*)').eq('organization_id',ctx.organizationId).order('invoice_date',{ascending:false}),
  supabase.from('payments').select('*').eq('organization_id',ctx.organizationId),
  supabase.from('sales_orders').select('*,sales_order_lines(*)').eq('organization_id',ctx.organizationId).order('created_at',{ascending:false}),
  supabase.from('quotes').select('*,quote_lines(*)').eq('organization_id',ctx.organizationId).order('created_at',{ascending:false}),
  supabase.from('opportunities').select('*').eq('organization_id',ctx.organizationId).order('created_at',{ascending:false})
 ]);if(ie)throw ie;if(pe)throw pe;if(oe)throw oe;if(qe)throw qe;if(ope)throw ope;setCloud({invoices:invoices||[],payments:payments||[],orders:orders||[],quotes:quotes||[],opps:opps||[]})}catch(e:any){setCloudError(e.message||'Unable to load cloud commercial data.')}finally{setLoading(false)}})()},[]);
 const start=periodStart(period),label=periodLabel(period);
 const periodInvoices=useMemo(()=>cloud.invoices.filter((i:any)=>(i.invoice_date||i.created_at?.slice(0,10)||'')>=start),[cloud.invoices,start]);
 const periodOrders=useMemo(()=>cloud.orders.filter((o:any)=>(o.created_at?.slice(0,10)||'')>=start),[cloud.orders,start]);
 const periodQuotes=useMemo(()=>cloud.quotes.filter((q:any)=>(q.created_at?.slice(0,10)||'')>=start),[cloud.quotes,start]);
 const periodOpps=useMemo(()=>cloud.opps.filter((o:any)=>(o.created_at?.slice(0,10)||'')>=start),[cloud.opps,start]);
 const invoiced=periodInvoices.reduce((s:number,i:any)=>s+invoiceTotal(i),0);
 const periodInvoiceIds=new Set(periodInvoices.map((i:any)=>i.id));
 const paidAgainstPeriod=cloud.payments.filter((p:any)=>periodInvoiceIds.has(p.invoice_id)).reduce((s:number,p:any)=>s+(+p.amount||0),0);
 const receivables=Math.max(0,invoiced-paidAgainstPeriod);
 const openOrders=periodOrders.filter((o:any)=>!['Delivered','Cancelled','Invoiced'].includes(o.status));
 const openSales=openOrders.reduce((s:number,o:any)=>s+orderTotal(o),0);
 const liveQuotes=periodQuotes.filter((q:any)=>['Draft','Sent'].includes(q.status));
 const quotePipe=liveQuotes.reduce((s:number,q:any)=>s+quoteTotal(q),0);
 const activeWorkshop=core.workshop.filter(j=>j.status!=='Collected');
 const lowStock=core.stock.filter(i=>(+i.qty||0)<=1);
 const today=new Date().toISOString().slice(0,10),todayDiary=core.diary.filter(d=>d.date===today&&!d.done);
 const openPo=pos.filter(p=>!['Received','Cancelled'].includes(p.status)).reduce((s,p)=>s+(+p.value||0),0);
 return <DmsShell active="Command Centre" eyebrow="DEALERSHIP COMMAND CENTRE" title="Welcome back" subtitle="Your dealership operational overview" actions={<Link className="dms-primary" href="/invoice/new">+ New transaction</Link>}>
 <div className="dms-kpi-controls"><div><b>Commercial period</b><span>Cloud sales KPIs · {label}</span></div><select value={period} onChange={e=>setPeriod(e.target.value as Period)}><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option></select></div>
 {cloudError&&<div className="dms-cloud-warning">Cloud KPI data could not be loaded: {cloudError}</div>}
 <div className="dms-kpi-grid"><div><span>Total sales / invoiced</span><strong>{loading?'—':money(invoiced)}</strong><small>{periodInvoices.length} invoices · {label}</small></div><div><span>Receivables</span><strong>{loading?'—':money(receivables)}</strong><small>Outstanding on {label.toLowerCase()} invoices</small></div><div><span>Open sales orders</span><strong>{loading?'—':money(openSales)}</strong><small>{openOrders.length} live orders · {label}</small></div><div><span>Quote pipeline</span><strong>{loading?'—':money(quotePipe)}</strong><small>{periodOpps.filter((o:any)=>!['Won','Lost'].includes(o.stage)).length} opportunities · {label}</small></div><div><span>Workshop jobs</span><strong>{activeWorkshop.length}</strong><small>{activeWorkshop.filter(j=>j.status==='In progress').length} in progress</small></div><div><span>Parts backorders / low</span><strong>{lowStock.length}</strong><small>{core.stock.length} stock lines</small></div></div>
 <div className="dms-workgrid"><section className="dms-panel dms-wide"><div className="dms-panel-head"><div><h2>Operational work queues</h2><span>Items requiring dealership attention</span></div><Link href="/dms/management">View management</Link></div><div className="dms-queue-head"><span>Area</span><span>Priority</span><span>Work item</span><span>Owner</span><span>Due</span><span>Value</span></div>{todayDiary.slice(0,4).map((d:any)=><div className="dms-queue-row" key={d.id}><span>Sales</span><span className="priority amber">Today</span><span><b>{d.title}</b><small>General task</small></span><span>Sales</span><span>{d.time||'Today'}</span><span>—</span></div>)}{activeWorkshop.filter(j=>j.status==='Finished').slice(0,4).map((j:any)=><div className="dms-queue-row" key={j.id}><span>Workshop</span><span className="priority green">Ready</span><span><b>{j.machine||'Machine ready'}</b><small>Customer</small></span><span>{j.technician||'Workshop'}</span><span>{j.dueDate||'—'}</span><span>{money((j.labourHours||0)*(j.labourRate||0)+(j.partsSell||0))}</span></div>)}{lowStock.slice(0,4).map((i:any)=><div className="dms-queue-row" key={i.id}><span>Parts</span><span className="priority red">Low</span><span><b>{i.sku||'SKU'} · {i.description}</b><small>Quantity {i.qty}</small></span><span>Parts</span><span>Reorder</span><span>{money((i.qty||0)*(i.cost||0))}</span></div>)}{!todayDiary.length&&!activeWorkshop.some(j=>j.status==='Finished')&&!lowStock.length&&<div className="dms-empty">No priority work items in the current dataset.</div>}</section>
 <section className="dms-panel"><div className="dms-panel-head"><div><h2>Workshop jobs</h2><span>Live work in progress</span></div><Link href="/dms/workshop">View all jobs</Link></div><div className="dms-status-list">{['Booked','Awaiting approval','Awaiting parts','In progress','Finished'].map(s=><div key={s}><span>{s}</span><b>{core.workshop.filter(j=>j.status===s).length}</b></div>)}</div></section>
 <section className="dms-panel"><div className="dms-panel-head"><div><h2>Sales funnel</h2><span>{label} cloud opportunities</span></div><Link href="/dms/sales">View sales</Link></div><div className="dms-funnel">{['Lead','Qualified','Demo / Survey','Quoted','Negotiation','Won'].map(stage=>{const xs=periodOpps.filter((o:any)=>o.stage===stage);const val=xs.reduce((s:number,o:any)=>s+(+o.value||0),0);return <div key={stage}><span>{stage}</span><div><i style={{width:`${Math.min(100,Math.max(8,(val/(Math.max(...periodOpps.map((o:any)=>+o.value||0),1)))*100))}%`}}/></div><b>{xs.length}</b><strong>{money(val)}</strong></div>})}</div></section>
 <section className="dms-panel dms-wide"><div className="dms-panel-head"><div><h2>Management exposure</h2><span>Current commercial position</span></div><span className="dms-badge">SUPABASE CLOUD</span></div><div className="dms-exposure"><div><span>{label} invoiced</span><strong>{money(invoiced)}</strong><small>Cloud invoice revenue</small></div><div><span>Supplier commitments</span><strong>{money(openPo)}</strong><small>Purchasing migration pending</small></div><div><span>Stock at cost</span><strong>{money(core.stock.reduce((s,i)=>s+(+i.qty||0)*(+i.cost||0),0))}</strong><small>Parts migration pending</small></div><div><span>Cash buffer</span><strong>{money(core.cashBuffer||0)}</strong><small>Configured reserve</small></div></div></section></div></DmsShell>}
