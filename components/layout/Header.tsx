import { Bell, Search, ChevronDown } from "lucide-react";

export default function Header() {
  return (
    <header className="h-20 border-b border-slate-200 bg-white px-8 flex items-center justify-between">

      <div className="flex items-center gap-6">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search DealerCore..."
            className="w-96 rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-green-500 focus:bg-white"
          />

        </div>

      </div>

      <div className="flex items-center gap-6">

        <button className="relative rounded-xl bg-slate-100 p-3 hover:bg-slate-200 transition">

          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>

        </button>

        <button className="flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-2 hover:bg-slate-200 transition">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 font-bold text-white">
            J
          </div>

          <div className="text-left">

            <p className="font-semibold text-slate-800">
              Jonathan
            </p>

            <p className="text-xs text-slate-500">
              Administrator
            </p>

          </div>

          <ChevronDown size={18} />

        </button>

      </div>

    </header>
  );
}