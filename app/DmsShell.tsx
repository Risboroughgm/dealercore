"use client";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";

const modules=[
 ["Command Centre","Dealership overview","/dms","⌂"],
 ["Customers","CRM & enquiries","/dms/customers","♙"],
 ["Sales","Quotes, orders & invoices","/dms/sales","▣"],
 ["Machines","Stock & inventory","/dms/machines","◫"],
 ["Workshop","Jobs & scheduling","/dms/workshop","⌁"],
 ["Parts","Inventory & orders","/dms/parts","◇"],
 ["Purchasing","Suppliers & POs","/dms/purchasing","▤"],
 ["Finance","Accounts & reporting","/dms/accounts","£"],
 ["Documents","Files & templates","/dms/documents","▧"],
 ["Reports","Business intelligence","/dms/management","▥"],
 ["Settings","System & users","/dms/settings","⚙"]
];
const financeLinks=[['Finance Command Centre','/dms/accounts'],['Working Capital','/dms/accounts/working-capital'],['Purchase Ledger','/dms/accounts/purchase-ledger'],['Banking & Reconciliation','/dms/accounts/banking'],['Credits & Adjustments','/dms/accounts/adjustments'],['General Ledger','/dms/accounts/ledger'],['Financial Statements','/dms/accounts/reports'],['Stock Accounting','/dms/accounts/stock-accounting'],['Fixed Assets','/dms/accounts/assets'],['Budgets & Forecasts','/dms/accounts/budgets'],['Period Close','/dms/accounts/period-close']];
export default function DmsShell({title,eyebrow,subtitle,active,actions,children}:{title:string;eyebrow:string;subtitle:string;active:string;actions?:ReactNode;children:ReactNode}){
 const [depot,setDepot]=useState("Main Branch"); const [userLabel,setUserLabel]=useState("DealerCore User");
 useEffect(()=>{const supabase=createClient();supabase.auth.getUser().then(({data})=>{if(data.user)setUserLabel((data.user.user_metadata?.display_name as string)||data.user.email||"DealerCore User")})},[]);
 async function signOut(){const supabase=createClient();await supabase.auth.signOut();window.location.href="/login"}
 return <main className="dms-shell commercial-shell">
 <aside className="dms-nav commercial-nav"><div className="commercial-brand"><div className="commercial-mark">◇</div><div><strong>DEALER<span>CORE</span></strong><small>DEALER MANAGEMENT SOFTWARE</small></div></div><nav>{modules.map(([name,desc,href,icon])=><div key={name}><Link className={active===name?"dms-nav-active":""} href={href}><b>{icon}</b><div><strong>{name}</strong><span>{desc}</span></div><i>›</i></Link>{name==='Finance'&&active==='Finance'&&<div className="finance-nav-tree">{financeLinks.map(([label,url])=><Link key={label} href={url}>{label}</Link>)}</div>}</div>)}</nav><div className="dms-nav-foot"><div className="support-card"><b>NEED HELP?</b><span>Access guides, support and system tools.</span><Link href="/tools">Open support tools</Link></div><small>DealerCore Cloud</small></div></aside>
 <header className="dms-topbar commercial-topbar"><Link href="/dms" className="menu-button">☰</Link><div className="global-search"><span>⌕</span><input placeholder="Search customers, machines, jobs, invoices, serial numbers..."/></div><div className="topbar-actions"><Link href="/dms/create" className="quick-add" title="Quick create">+</Link><Link href="/dms/workshop" title="Workshop diary">▣</Link><Link href="/dms/customers" title="CRM">◌</Link><Link href="/dms/management" className="notify" title="Alerts">♢<sup>3</sup></Link><Link href="/tools" title="Help">?</Link><div className="branch-user"><div className="branch-avatar">RG</div><div><b>{userLabel}</b><span>Risborough Garden Machinery · {depot}</span></div><select value={depot} onChange={e=>setDepot(e.target.value)}><option>Main Branch</option><option>All Branches</option><option>Demo Branch 2</option></select><button className="dms-signout" onClick={signOut}>Sign out</button></div></div></header>
 <section className="dms-content commercial-content"><div className="dms-pagehead commercial-pagehead"><div><p>{eyebrow}</p><h1>{title}</h1><span>{subtitle}</span></div><div>{actions}</div></div>{children}</section>
 </main>
}
