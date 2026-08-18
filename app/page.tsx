import Link from "next/link";
import DealerCoreApp from "./DealerCoreApp";

export default function Home() {
  return (
    <>
      <DealerCoreApp />
      <Link
        href="/tools"
        className="fixed bottom-5 right-5 z-40 rounded-full border border-[#cbd6c9] bg-white px-4 py-2 text-sm font-semibold text-[#376f2b] shadow-lg hover:bg-[#f4f6f3] print:hidden"
      >
        Data & Test Tools
      </Link>
    </>
  );
}
