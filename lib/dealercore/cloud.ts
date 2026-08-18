import { createClient } from '../supabase/client'

export type CloudContext={organizationId:string;depotId:string|null;role:string;userId:string}

export async function getCloudContext():Promise<CloudContext>{
 const supabase=createClient();
 const {data:{user},error:userError}=await supabase.auth.getUser();
 if(userError||!user) throw new Error('You are not signed in.');
 const {data:membership,error}=await supabase.from('memberships').select('organization_id,depot_id,role').eq('user_id',user.id).eq('active',true).limit(1).maybeSingle();
 if(error) throw error;
 if(!membership) throw new Error('Your DealerCore account does not have an active dealership membership.');
 return {organizationId:membership.organization_id,depotId:membership.depot_id,role:membership.role,userId:user.id};
}

export function mapCustomer(row:any){return {id:row.id,company:row.company_name||'',name:row.contact_name||'',email:row.email||'',phone:row.phone||'',address:[row.address_line1,row.address_line2,row.town].filter(Boolean).join(', '),postcode:row.postcode||'',notes:row.notes||'',creditLimit:+row.credit_limit||0,creditHold:!!row.credit_hold,customerType:row.customer_type||'retail'}}
export function mapMachine(row:any){return {id:row.id,customerId:row.customer_id||'',make:row.make||'',model:row.model||'',type:row.machine_type||'Machine',serial:row.serial_number||'',value:+row.value||0,saleDate:row.sale_date||'',warrantyUntil:row.warranty_until||'',status:({customer_owned:'Customer Owned',in_stock:'In Stock',demo:'Demo',trade_in:'Trade-In',sold_awaiting_delivery:'Sold / Awaiting Delivery',workshop_only:'Workshop Only'} as any)[row.status]||row.status,source:({manual:'Manual Entry',invoice:'Invoice',sales_order:'Sales Order',trade_in:'Trade-In',existing_customer:'Existing Customer Machine',dealer_stock:'Dealer Stock'} as any)[row.source]||row.source,registrationRef:row.internal_reference||'',notes:row.notes||'',createdAt:row.created_at}}
export const dbMachineStatus=(v:string)=>({"Customer Owned":'customer_owned',"In Stock":'in_stock',Demo:'demo',"Trade-In":'trade_in',"Sold / Awaiting Delivery":'sold_awaiting_delivery',"Workshop Only":'workshop_only'} as any)[v]||'customer_owned';
export const dbMachineSource=(v:string)=>({"Manual Entry":'manual',Invoice:'invoice',"Sales Order":'sales_order',"Trade-In":'trade_in',"Existing Customer Machine":'existing_customer',"Dealer Stock":'dealer_stock'} as any)[v]||'manual';
