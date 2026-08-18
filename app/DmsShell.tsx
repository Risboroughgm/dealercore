"use client";
import Link from "next/link";
import { ReactNode, useState } from "react";

const modules=[
 ["Command Centre","Dealership overview","/dms","DC"],
 ["Customers","CRM & customer accounts","/dms/customers","C"],
 ["Sales","Pipeline, quotes & orders","/dms/sales","S"],
 ["Accounts","Invoices, payments & credit","/dms/accounts","A"],
 ["Workshop","Jobs, technicians & assets","/dms/workshop","W"],
 ["Parts","Stock, purchasing & suppliers","/dms/parts","P"],
 ["Management","KPIs, exposure & reporting","/dms/management","M"],
 ["Business Settings","Company & document branding","/settings","⚙"]
];
export default function DmsShell({title,eyebrow,subtitle,active,actions,children}:{title:string;eyebrow:string;subtitle:string;active:string;actions?:ReactNode;children:ReactNode}){
 const [depot,setDepot]=useState("Princes Risborough");
 return <main className="dms-shell"><header className="dms-topbar"><div className="dms-brand"><div className="dms-logo">DC</div><div><strong>DealerCore</strong><span>Dealership Management System</span></div></div><div className="dms-context"><label>Company<select><option>Risborough Group</option></select></label><label>Depot<select value={depot} onChange={e=>setDepot(e.target.value)}><option>Princes Risborough</option><option>All depots</option><option>Demo Depot 2</option></select></label><label>Division<select><option>All divisions</option><option>Garden Machinery</option><option>Golf & Turf</option><option>Garden Care</option></select></label></div><div className="dms-user"><button title="Notifications">●</button><div><b>Jonathan Quinton</b><span>System Administrator</span></div></div></header><aside className="dms-nav"><div className="dms-search"><span>⌕</span><input placeholder="Search customer, serial, order, invoice..."/></div><nav>{modules.map(([name,desc,href,icon])=><Link className={active===name?"dms-nav-active":""} href={href} key={name}><b>{icon}</b><div><strong>{name}</strong><span>{desc}</span></div></Link>)}</nav><div className="dms-nav-foot"><Link href="/tools">Data & test tools</Link><Link href="/legacy">Legacy operations view</Link></div></aside><section className="dms-content"><div className="dms-pagehead"><div><p>{eyebrow}</p><h1>{title}</h1><span>{subtitle} · {depot}</span></div><div>{actions}</div></div>{children}</section></main>
}