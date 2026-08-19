export const LEGACY_OPERATIONAL_KEYS=['dealercore-v1','dealercore-v2'];

const LEGACY_OPERATIONAL_PATTERN=/^dealercore-(customers|machines|equipment|quotes|invoices|payments|workshop|diary|stock|suppliers|orders|sales-orders)(-|$)/i;

export function findLegacyOperationalKeys(){
 if(typeof window==='undefined')return [] as string[];
 const found:string[]=[];
 for(let i=0;i<window.localStorage.length;i++){
  const key=window.localStorage.key(i);
  if(!key)continue;
  if(LEGACY_OPERATIONAL_KEYS.includes(key)||LEGACY_OPERATIONAL_PATTERN.test(key))found.push(key);
 }
 return Array.from(new Set(found)).sort();
}

export function clearLegacyOperationalData(){
 if(typeof window==='undefined')return [] as string[];
 const keys=findLegacyOperationalKeys();
 for(const key of keys)window.localStorage.removeItem(key);
 return keys;
}
