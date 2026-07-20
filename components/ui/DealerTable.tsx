import DealerCard from "./DealerCard";
import Button from "./Button";

export default function DealerTable() {
  return (
    <DealerCard>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Recent Customers
        </h2>

        <Button>Add Customer</Button>
      </div>

      <table className="w-full">

        <thead className="border-b">

          <tr className="text-left text-slate-500">

            <th className="pb-3">Customer</th>
            <th className="pb-3">Machine</th>
            <th className="pb-3">Phone</th>
            <th className="pb-3">Status</th>

          </tr>

        </thead>

        <tbody>

          <tr className="border-b">

            <td className="py-4">John Smith</td>
            <td>KR236E</td>
            <td>07700 123456</td>

            <td>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                Active
              </span>
            </td>

          </tr>

          <tr className="border-b">

            <td className="py-4">Peter Jones</td>
            <td>RTKn</td>
            <td>07888 654321</td>

            <td>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-700">
                Waiting
              </span>
            </td>

          </tr>

          <tr>

            <td className="py-4">Mary Brown</td>
            <td>Luba 2</td>
            <td>07999 123123</td>

            <td>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                Service Due
              </span>
            </td>

          </tr>

        </tbody>

      </table>
    </DealerCard>
  );
}