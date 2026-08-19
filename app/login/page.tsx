"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "../../lib/supabase/client";

export default function LoginPage(){
 const [mode,setMode]=useState<"login"|"signup">("login");
 const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [name,setName]=useState("");
 const [busy,setBusy]=useState(false); const [message,setMessage]=useState(""); const [error,setError]=useState(false);
 async function submit(e:FormEvent){e.preventDefault();setBusy(true);setMessage("");setError(false);const supabase=createClient();
  if(mode==="login"){
   const {error}=await supabase.auth.signInWithPassword({email,password});
   if(error){setError(true);setMessage(error.message);setBusy(false);return}
   const next=new URLSearchParams(window.location.search).get("next")||"/dms";window.location.href=next;return;
  }
  const {data,error}=await supabase.auth.signUp({email,password,options:{data:{display_name:name||email},emailRedirectTo:`${window.location.origin}/auth/callback?next=/dms`}});
  if(error){setError(true);setMessage(error.message);setBusy(false);return}
  if(data.session){window.location.href="/dms";return}
  setMessage("Account created. Check your email to confirm the account, then sign in.");setBusy(false);
 }
 return <main className="auth-shell"><section className="auth-card"><div className="auth-brand-panel"><div className="auth-lockup"><div className="auth-mark"><span>◇</span></div><div><strong>DEALER<em>CORE</em></strong><small>DEALER MANAGEMENT SOFTWARE</small></div></div><div className="auth-brand-copy"><p>SECURE DEALERSHIP OPERATIONS</p><h1>The core of your dealership.</h1><span>Sales, customers, machines, workshop, parts, purchasing and finance in one secure cloud operating system.</span></div><div className="auth-brand-foot">DealerCore · Risborough Group</div></div><div className="auth-form-panel"><p>DEALERCORE CLOUD</p><h2>{mode==="login"?"Sign in":"Create administrator"}</h2><span>{mode==="login"?"Use your dealership account to continue.":"The first DealerCore account becomes the initial system administrator."}</span><div className="auth-tabs"><button className={mode==="login"?"active":""} onClick={()=>{setMode("login");setMessage("")}}>Sign in</button><button className={mode==="signup"?"active":""} onClick={()=>{setMode("signup");setMessage("")}}>First-time setup</button></div><form className="auth-form" onSubmit={submit}>{mode==="signup"&&<label><span>Your name</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="Jonathan Quinton" required/></label>}<label><span>Email address</span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@dealership.co.uk" required autoComplete="email"/></label><label><span>Password</span><input type="password" minLength={8} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Minimum 8 characters" required autoComplete={mode==="login"?"current-password":"new-password"}/></label><button className="auth-submit" disabled={busy}>{busy?"Please wait…":mode==="login"?"Sign in to DealerCore":"Create administrator account"}</button></form>{message&&<div className={`auth-message ${error?"error":""}`}>{message}</div>}<div className="auth-links"><Link href="/forgot-password">Forgot password?</Link><span>Secure cloud access</span></div></div></section></main>
}
