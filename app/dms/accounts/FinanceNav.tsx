"use client";
import Link from 'next/link';
import {useEffect,useMemo,useRef,useState} from 'react';

type Shortcut={label:string;href:string};
type ModuleConfig={title:string;shortcuts:Shortcut[]};
const config:Record<string,ModuleConfig>={
  'Working Capital':{title:'Working Capital & Treasury',shortcuts:[{label:'Aged Debtors',href:'/dms/accounts/working-capital#aged-debtors'},{label:'Aged Creditors',href:'/dms/accounts/working-capital#aged-creditors'},{label:'Payment Runs',href:'/dms/accounts/working-capital#payment-runs'},{label:'13 Week Cash Flow',href:'/dms/accounts/working-capital#cash-flow'}]},
  'Purchase Ledger':{title:'Purchase Ledger',shortcuts:[{label:'Supplier Bills',href:'/dms/accounts/purchase-ledger'},{label:'Supplier Credits',href:'/dms/accounts/adjustments#supplier-credits'},{label:'Payment Runs',href:'/dms/accounts/working-capital#payment-runs'},{label:'Aged Creditors',href:'/dms/accounts/working-capital#aged-creditors'}]},
  'Banking':{title:'Banking & Reconciliation',shortcuts:[{label:'Bank Accounts',href:'/dms/accounts/banking#bank-accounts'},{label:'Statement Import',href:'/dms/accounts/banking#import'},{label:'Reconciliation',href:'/dms/accounts/banking#reconciliation'},{label:'Unreconciled',href:'/dms/accounts/banking#unreconciled'}]},
  'VAT & Tax Control':{title:'VAT & Tax Control',shortcuts:[{label:'VAT Return',href:'/dms/accounts/vat'},{label:'VAT Detail',href:'/dms/accounts/vat#detail'},{label:'VAT Control',href:'/dms/accounts/vat#control'},{label:'Saved Returns',href:'/dms/accounts/vat#returns'}]},
  'Profitability':{title:'Dealership Profitability',shortcuts:[{label:'Revenue Streams',href:'/dms/accounts/profitability#streams'},{label:'Manufacturers',href:'/dms/accounts/profitability#manufacturers'},{label:'Margins',href:'/dms/accounts/profitability#margins'},{label:'Contribution',href:'/dms/accounts/profitability#contribution'}]},
  'Controls':{title:'Controls & Approvals',shortcuts:[{label:'Approval Rules',href:'/dms/accounts/controls#rules'},{label:'Approval Queue',href:'/dms/accounts/controls#queue'},{label:'Management Packs',href:'/dms/accounts/controls#packs'},{label:'Audit Controls',href:'/dms/accounts/controls#audit'}]},
  'Recurring':{title:'Recurring Accounting',shortcuts:[{label:'Recurring Journals',href:'/dms/accounts/recurring'},{label:'Active Templates',href:'/dms/accounts/recurring#templates'},{label:'Due Postings',href:'/dms/accounts/recurring#due'},{label:'History',href:'/dms/accounts/recurring#history'}]},
  'Adjustments':{title:'Credits & Adjustments',shortcuts:[{label:'Customer Credits',href:'/dms/accounts/adjustments#customer-credits'},{label:'Supplier Credits',href:'/dms/accounts/adjustments#supplier-credits'},{label:'Accruals',href:'/dms/accounts/adjustments#accruals'},{label:'Prepayments',href:'/dms/accounts/adjustments#prepayments'}]},
  'General Ledger':{title:'General Ledger',shortcuts:[{label:'Journal Register',href:'/dms/accounts/ledger'},{label:'Manual Journal',href:'/dms/accounts/ledger#manual-journal'},{label:'Recurring Journals',href:'/dms/accounts/recurring'},{label:'Financial Statements',href:'/dms/accounts/reports'}]},
  'Financial Statements':{title:'Financial Statements',shortcuts:[{label:'Profit & Loss',href:'/dms/accounts/reports#profit-loss'},{label:'Balance Sheet',href:'/dms/accounts/reports#balance-sheet'},{label:'Trial Balance',href:'/dms/accounts/reports#trial-balance'},{label:'General Ledger',href:'/dms/accounts/ledger'}]},
  'Stock Accounting':{title:'Stock Accounting',shortcuts:[{label:'Stock Valuation',href:'/dms/accounts/stock-accounting#valuation'},{label:'COGS',href:'/dms/accounts/stock-accounting#cogs'},{label:'Adjustments',href:'/dms/accounts/stock-accounting#adjustments'},{label:'Write Offs',href:'/dms/accounts/stock-accounting#write-offs'}]},
  'Fixed Assets':{title:'Fixed Assets',shortcuts:[{label:'Asset Register',href:'/dms/accounts/assets'},{label:'Add Asset',href:'/dms/accounts/assets#add-asset'},{label:'Depreciation',href:'/dms/accounts/assets#depreciation'},{label:'Disposals',href:'/dms/accounts/assets#disposals'}]},
  'Budgets & Forecasts':{title:'Budgets & Forecasts',shortcuts:[{label:'Budgets',href:'/dms/accounts/budgets'},{label:'Budget vs Actual',href:'/dms/accounts/budgets#variance'},{label:'Forecasts',href:'/dms/accounts/budgets#forecasts'},{label:'Cash Flow',href:'/dms/accounts/working-capital#cash-flow'}]},
  'Period Close':{title:'Period & Year End',shortcuts:[{label:'Close Checklist',href:'/dms/accounts/period-close'},{label:'Month End',href:'/dms/accounts/period-close#month-end'},{label:'Year End',href:'/dms/accounts/period-close#year-end'},{label:'Lock Dates',href:'/dms/accounts/period-close#lock-dates'}]}
};
const allActions:Shortcut[]=[
  {label:'Finance Control Centre',href:'/dms/accounts'},
  {label:'New Invoice',href:'/invoice/new'},
  {label:'Supplier Bills',href:'/dms/accounts/purchase-ledger'},
  {label:'Supplier Credits',href:'/dms/accounts/adjustments#supplier-credits'},
  {label:'Customer Credits',href:'/dms/accounts/adjustments#customer-credits'},
  {label:'Manual Journal',href:'/dms/accounts/ledger#manual-journal'},
  {label:'Payment Runs',href:'/dms/accounts/working-capital#payment-runs'},
  {label:'Aged Debtors',href:'/dms/accounts/working-capital#aged-debtors'},
  {label:'Aged Creditors',href:'/dms/accounts/working-capital#aged-creditors'},
  {label:'Bank Reconciliation',href:'/dms/accounts/banking#reconciliation'},
  {label:'Import Bank Statement',href:'/dms/accounts/banking#import'},
  {label:'VAT Return',href:'/dms/accounts/vat'},
  {label:'Profit & Loss',href:'/dms/accounts/reports#profit-loss'},
  {label:'Balance Sheet',href:'/dms/accounts/reports#balance-sheet'},
  {label:'Trial Balance',href:'/dms/accounts/reports#trial-balance'},
  {label:'Stock Valuation',href:'/dms/accounts/stock-accounting#valuation'},
  {label:'Fixed Assets',href:'/dms/accounts/assets'},
  {label:'Budgets & Forecasts',href:'/dms/accounts/budgets'},
  {label:'Dealership Profitability',href:'/dms/accounts/profitability'},
  {label:'Controls & Approvals',href:'/dms/accounts/controls'},
  {label:'Recurring Journals',href:'/dms/accounts/recurring'},
  {label:'Period Close',href:'/dms/accounts/period-close'}
];
const FAV='dealercore-finance-favourites-v1',REC='dealercore-finance-recent-v1';
export default function FinanceNav({active}:{active:string}){
  const section=config[active]||{title:active,shortcuts:[]};
  const [query,setQuery]=useState(''),[favourites,setFavourites]=useState<string[]>([]),[recent,setRecent]=useState<string[]>([]),[focus,setFocus]=useState(false);const inputRef=useRef<HTMLInputElement>(null);
  useEffect(()=>{try{setFavourites(JSON.parse(localStorage.getItem(FAV)||'[]'));setRecent(JSON.parse(localStorage.getItem(REC)||'[]'))}catch{}const key=(e:KeyboardEvent)=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();inputRef.current?.focus();setFocus(true)}if(e.key==='Escape'){setQuery('');setFocus(false);inputRef.current?.blur()}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[]);
  const results=useMemo(()=>query.trim()?allActions.filter(x=>x.label.toLowerCase().includes(query.toLowerCase())).slice(0,8):[],[query]);
  const favouriteActions=favourites.map(h=>allActions.find(x=>x.href===h)).filter(Boolean) as Shortcut[];const recentActions=recent.map(h=>allActions.find(x=>x.href===h)).filter(Boolean) as Shortcut[];
  function visit(href:string){const next=[href,...recent.filter(x=>x!==href)].slice(0,5);setRecent(next);localStorage.setItem(REC,JSON.stringify(next));setQuery('');setFocus(false)}
  function toggleFavourite(item:Shortcut){const next=favourites.includes(item.href)?favourites.filter(x=>x!==item.href):[...favourites,item.href].slice(0,5);setFavourites(next);localStorage.setItem(FAV,JSON.stringify(next))}
  return <div className="finance-module-bar">
    <div className="finance-module-bar-main"><Link href="/dms/accounts" className="finance-back">← Finance Control Centre</Link><div className="finance-module-name"><span>FINANCE MODULE</span><strong>{section.title}</strong></div><div className="finance-module-shortcuts">{section.shortcuts.map(item=><Link key={item.label} href={item.href} onClick={()=>visit(item.href)}>{item.label}</Link>)}</div></div>
    <div className="finance-speedbar"><div className="finance-action-finder"><span>⌕</span><input ref={inputRef} value={query} onChange={e=>setQuery(e.target.value)} onFocus={()=>setFocus(true)} placeholder="Find a finance action…  Ctrl/⌘ K"/>{focus&&query&&<div className="finance-action-results">{results.length?results.map(item=><div key={item.href}><Link href={item.href} onClick={()=>visit(item.href)}>{item.label}</Link><button onClick={()=>toggleFavourite(item)} title="Pin favourite">{favourites.includes(item.href)?'★':'☆'}</button></div>):<p>No finance actions found</p>}</div>}</div><div className="finance-pins"><span>Favourites</span>{favouriteActions.length?favouriteActions.slice(0,3).map(item=><Link key={item.href} href={item.href} onClick={()=>visit(item.href)}>★ {item.label}</Link>):<small>Use ☆ in search to pin actions</small>}</div><div className="finance-recents"><span>Recent</span>{recentActions.slice(0,3).map(item=><Link key={item.href} href={item.href} onClick={()=>visit(item.href)}>{item.label}</Link>)}</div></div>
  </div>
}
