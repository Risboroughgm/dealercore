import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase/server'

export default async function DmsLayout({children}:{children:React.ReactNode}){
  const supabase=await createClient()
  const {data:claims}=await supabase.auth.getClaims()
  if(!claims?.claims?.sub) redirect('/login')
  const {data:membership}=await supabase.from('memberships').select('id,role,active').eq('user_id',claims.claims.sub).eq('active',true).maybeSingle()
  if(!membership) redirect('/access-pending')
  return children
}
