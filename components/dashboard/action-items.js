import DateHandler from "@/lib/date-handler";
import Link from "next/link";
export default function ActionItems({ items }) {
  return (
    <table className="min-w-full">
      <thead className="">
        <tr>
          <th
            scope="col"
            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
          >
            Publication
          </th>
          <th
            scope="col"
            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
          >
            Client
          </th>
          <th
            scope="col"
            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
          >
            Last Update
          </th>
          <th
            scope="col"
            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
          >
            Last Activity
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Article
          </th>
          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
            <span className="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {items.map((item) => (
          <tr key={item.id}>
            <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
              {item.publication?.name}
              <dl className="font-normal lg:hidden">
                <dt className="sr-only">Title</dt>
                <dd className="mt-1 truncate text-gray-700">
                  {" "}
                  {item.publication?.name}
                </dd>
                <dt className="sr-only sm:hidden">Email</dt>
                <dd className="mt-1 truncate text-gray-500 sm:hidden">
                  Last Activity {DateHandler.daysSince(item?.updatedAt)} Days
                  Ago
                </dd>
              </dl>
            </td>
            <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
              {item.profile?.name}
            </td>
            <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
              {DateHandler.daysSince(item?.article?.updatedAt)}
            </td>
            <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
              {item?.article?.getLastActivity()}
            </td>
            <td className="py-4 pl-3 pr-4 text-sm font-medium sm:pr-6">
              {item.article?.campaign?.id ? (
                <Link href={`/campaigns/${item.article?.campaign?.id}`}>
                  <a href="#" className="text-indigo-600 hover:text-indigo-900">
                    View
                  </a>
                </Link>
              ) : (
                <p className="text-gray-400">Not created</p>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
