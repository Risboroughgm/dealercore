"use client";
import Link from "next/link";
import { ReactNode, useState } from "react";

const modules=[
 ["Command Centre","Dealership overview","/dms","⌂"],
 ["Customers","CRM & enquiries","/dms/customers","♙"],
 ["Sales","Quotes, orders & invoices","/dms/sales","▣"],
 ["Machines","Stock & inventory","/dms/parts","◫"],
 ["Workshop","Jobs & scheduling","/dms/workshop","⌁"],
 ["Parts","Inventory & orders","/dms/parts","◇"],
 ["Purchasing","Suppliers & POs","/dms/parts","▤"],
 ["Finance","Accounts & reporting","/dms/accounts","£"],
 ["Documents","Files & templates","/dms/accounts","▧"],
 ["Reports","Business intelligence","/dms/management","▥"],
 ["Settings","System & users","/settings","⚙"]
];
export default function DmsShell({title,eyebrow,subtitle,active,actions,children}:{title:string;eyebrow:string;subtitle:string;active:string;actions?:ReactNode;children:ReactNode}){
 const [depot,setDepot]=useState("Main Branch");
 return <main className="dms-shell commercial-shell">
 <aside className="dms-nav commercial-nav"><div className="commercial-brand"><div className="commercial-mark">◇</div><div><strong>DEALER<span>CORE</span></strong><small>DEALER MANAGEMENT SOFTWARE</small></div></div><nav>{modules.map(([name,desc,href,icon])=><Link className={active===name?"dms-nav-active":""} href={href} key={name}><b>{icon}</b><div><strong>{name}</strong><span>{desc}</span></div><i>›</i></Link>)}</nav><div className="dms-nav-foot"><div className="support-card"><b>NEED HELP?</b><span>Access guides, support and system tools.</span><Link href="/tools">Open support tools</Link></div><small>DealerCore Preview</small></div></aside>
 <header className="dms-topbar commercial-topbar"><button className="menu-button">☰</button><div className="global-search"><span>⌕</span><input placeholder="Search customers, machines, jobs, invoices, serial numbers..."/></div><div className="topbar-actions"><Link href="/invoice/new" className="quick-add">+</Link><button>▣</button><button>◌</button><button className="notify">♢<sup>3</sup></button><button>?</button><div className="branch-user"><div className="branch-avatar">RG</div><div><b>Risborough Garden Machinery</b><span>{depot}</span></div><select value={depot} onChange={e=>setDepot(e.target.value)}><option>Main Branch</option><option>All Branches</option><option>Demo Branch 2</option></select></div></div></header>
 <section className="dms-content commercial-content"><div className="dms-pagehead commercial-pagehead"><div><p>{eyebrow}</p><h1>{title}</h1><span>{subtitle}</span></div><div>{actions}</div></div>{children}</section>
 </main>
}