import DateHandler from "@/lib/date-handler";
import Link from "next/link";
import StatusLabel from "@/components/statusLabel";
import StatusHandler from "@/lib/status-handler";
import CampaignManager from "@/lib/campaignManager";

export default function CustomersTable({
  customers,
  isManager,
  handleUserClick,
  isWhitelabelOwner,
}) {
  return (
    <table className="min-w-full table-auto mt-4">
      <thead className="">
        <tr>
          <th
            scope="col"
            className="hidden px-3 text-left text-xs font-normal text-gray-600 lg:table-cell"
          >
            Client
          </th>
          <th
            scope="col"
            className="hidden px-3 text-left text-xs font-normal text-gray-600 sm:table-cell"
          >
            Email
          </th>

          <th
            scope="col"
            className="hidden px-3 text-left text-xs font-normal text-gray-600 sm:table-cell"
          >
            Created
          </th>

          <th
            scope="col"
            className="hidden px-3 text-left text-xs font-normal text-gray-600 sm:table-cell"
          >
            Orders
          </th>
          {isManager && (
            <th
              scope="col"
              className="hidden px-3 text-left text-xs font-normal text-gray-600 sm:table-cell"
            >
              Site
            </th>
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {customers.map((customer) => (
          <tr key={customer.id}>
            <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none min-w-[160px]">
              <Link href={`/customers/${customer?.id}`}>
                <a className="text-indigo-600 cursor-pointer">
                  {customer?.name}
                </a>
              </Link>
              <dl className="font-normal lg:hidden">
                <dt className="sr-only">Title</dt>
                <dd className="mt-1 truncate text-gray-700">
                  {" "}
                  {customer?.name}
                </dd>
                <dt className="sr-only sm:hidden">Email</dt>
                <dd className="mt-1 truncate text-gray-500 sm:hidden">
                  {customer.email}
                </dd>
                <dt className="sr-only sm:hidden">Created</dt>
                <dd className="mt-1 truncate text-gray-500 sm:hidden">
                  {DateHandler.formatDateByDay(customer?.createdAt)}
                </dd>
                <dt className="sr-only sm:hidden">Orders</dt>
                <dd className="mt-1 truncate text-gray-500 sm:hidden">
                  {customer.orders.length}
                </dd>
              </dl>
            </td>

            <td
              id="purchased-date"
              className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell min-w-[100px]"
            >
              {customer.email}
            </td>

            <td
              id="purchased-date"
              className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell min-w-[100px]"
            >
              {DateHandler.formatDateByDay(customer?.createdAt)}
            </td>

            <td
              id="published-url"
              className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell min-w-[180px]"
            >
              {customer.orders.length}
            </td>
            {isManager && (
              <td
                id="published-url"
                className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell min-w-[180px]"
              >
                {customer.site?.name}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
