"use client";
import {ReactNode} from 'react';

export default function FinanceTransactionModal({open,title,subtitle,onClose,children,footer}:{open:boolean;title:string;subtitle?:string;onClose:()=>void;children:ReactNode;footer?:ReactNode}){
 if(!open)return null;
 return <div className="finance-modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
  <div className="finance-modal-shell">
   <header className="finance-modal-head"><div><small>DEALERCORE FINANCE</small><h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div><button type="button" className="finance-modal-close" onClick={onClose} aria-label="Close">×</button></header>
   <div className="finance-modal-body">{children}</div>
   {footer&&<footer className="finance-modal-foot">{footer}</footer>}
  </div>
 </div>
}
