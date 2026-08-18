import Link from "next/link";
import DealerCoreApp from "../DealerCoreApp";

export default function LegacyOperations() {
  return (
    <>
      <DealerCoreApp />
      <div className="fixed bottom-5 right-5 z-40 flex flex-wrap justify-end gap-2 print:hidden">
        <Link href="/dms" className="rounded-full bg-[#111a14] px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-[#24521c]">
          Return to DealerCore DMS
        </Link>
        <Link href="/enterprise" className="rounded-full bg-[#173f1f] px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-[#24521c]">
          Enterprise CRM & Sales
        </Link>
        <Link href="/enterprise/operations" className="rounded-full bg-[#2d6135] px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-[#24521c]">
          Enterprise Operations
        </Link>
        <Link href="/tools" className="rounded-full border border-[#cbd6c9] bg-white px-4 py-2 text-sm font-semibold text-[#376f2b] shadow-lg hover:bg-[#f4f6f3]">
          Data & Test Tools
        </Link>
      </div>
    </>
  );
}
