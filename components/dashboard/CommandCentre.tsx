import { CheckCircle2, AlertTriangle, CircleDollarSign } from "lucide-react";
import Button from "@/components/ui/Button";
export default function CommandCentre() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">
        Good Morning, Jonathan 👋
      </h2>

      <p className="mt-1 text-slate-500">
        Here's what's happening in your business today.
      </p>

      <div className="mt-6 space-y-4">

        <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4">
          <CheckCircle2 className="text-green-600" />
          <span>Workshop has capacity available today.</span>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-amber-50 p-4">
          <AlertTriangle className="text-amber-600" />
          <span>3 customer quotes are awaiting follow-up.</span>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-4">
          <CircleDollarSign className="text-blue-600" />
          <span>Today's expected revenue: <strong>£0.00</strong></span>
        </div>

      </div>
      <div className="mt-6 flex justify-end">
  <Button>
    View All Tasks
  </Button>
</div>
    </div>
  );
}