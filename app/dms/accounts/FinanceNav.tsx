import Link from 'next/link';
const items=[['Command Centre','/dms/accounts'],['Purchase Ledger','/dms/accounts/purchase-ledger'],['General Ledger','/dms/accounts/ledger'],['Financial Statements','/dms/accounts/reports'],['Fixed Assets','/dms/accounts/assets'],['Budgets & Forecasts','/dms/accounts/budgets'],['Period Close','/dms/accounts/period-close']];
export default function FinanceNav({active}:{active:string}){return <div className="finance-subnav">{items.map(([name,href])=><Link key={name} href={href} className={active===name?'active':''}>{name}</Link>)}</div>}
