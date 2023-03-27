import DateHandler from "@/lib/date-handler";
import Link from "next/link";
export default function AbandonedOrders({ orders }) {
  return (
    <table className="min-w-full">
      <thead className="">
        <tr>
          <th
            scope="col"
            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
          >
            Date
          </th>
          <th
            scope="col"
            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
          >
            Items
          </th>
          <th
            scope="col"
            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
          >
            Email
          </th>
          <th
            scope="col"
            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
          >
            Total
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {orders.map((order) => (
          <tr key={order.id}>
            <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
              {DateHandler.daysSince(order?.updatedAt)}
              <dl className="font-normal lg:hidden">
                <dt className="sr-only">Title</dt>
                <dd className="mt-1 truncate text-gray-700">
                  {" "}
                  {DateHandler.daysSince(order?.updatedAt)}
                </dd>
                <dt className="sr-only sm:hidden">Total</dt>
                <dd className="mt-1 truncate text-gray-500 sm:hidden">
                  {order.amount}
                </dd>
                <dd className="mt-1 truncate text-gray-500 sm:hidden">
                  {order.email}
                </dd>
              </dl>
            </td>

            <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
              {order.items?.map((item) => (
                <div key={item.id}>
                  {item.quantity} x {item.name}
                </div>
              ))}
            </td>
            <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
              {order.email}
            </td>
            <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
              ${order.total}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
