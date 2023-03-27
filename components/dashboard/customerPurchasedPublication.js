import { useRouter } from "next/router";
import DateHandler from "@/lib/date-handler";
import Link from "next/link";
import StatusLabel from "@/components/statusLabel";
import StatusHandler from "@/lib/status-handler";
import CampaignManager from "@/lib/campaignManager";
import moment from "moment";

export default function CustomerPurchasedPublicationsTable({
  purchasedPublications,
  isManager,
  // handleUserClick,
  isWhitelabelOwner,
}) {
  const router = useRouter();
  // console.log('Manager: ', isManager);
  // console.log(purchasedPublications)
  return (
    <table className="min-w-full table-auto mt-4">
      <thead className="">
        <tr>
          <th
            scope="col"
            className="pl-4 pr-3 text-left text-xs font-normal text-gray-600 sm:pl-6"
          >
            Publication
          </th>
          {isManager && (
            <th
              scope="col"
              className="hidden px-3 text-left text-xs font-normal text-gray-600 lg:table-cell"
            >
              Client
            </th>
          )}

          <th
            scope="col"
            className="hidden px-3 text-left text-xs font-normal text-gray-600 sm:table-cell"
          >
            Purchased
          </th>
          {!isWhitelabelOwner && (
            <th
              scope="col"
              className="px-3 text-left text-xs font-normal text-gray-600"
            >
              Article
            </th>
          )}

          <th
            scope="col"
            className="hidden px-3 text-left text-xs font-normal text-gray-600 sm:table-cell"
          >
            Last Update
          </th>
          <th
            scope="col"
            className="hidden px-3 text-left text-xs font-normal text-gray-600 sm:table-cell"
          >
            Last Activity
          </th>
          <th
            scope="col"
            className="hidden px-3 text-left text-xs font-normal text-gray-600 sm:table-cell"
          >
            Status
          </th>
          <th
            scope="col"
            className="hidden px-3 text-left text-xs font-normal text-gray-600 sm:table-cell"
          >
            Published URL
          </th>
          <th
            scope="col"
            className="hidden px-3 text-left text-xs font-normal text-gray-600 sm:table-cell"
          >
            Due Date
          </th>
          <th
            scope="col"
            className="hidden px-3 text-left text-xs font-normal text-gray-600 sm:table-cell"
          >
            Sale Price
          </th>
          {(isManager || isWhitelabelOwner) && (
            <>
              <th
                scope="col"
                className="hidden px-3 text-left text-xs font-normal text-gray-600 sm:table-cell"
              >
                Cost
              </th>
              <th
                scope="col"
                className="hidden px-3 text-left text-xs font-normal text-gray-600 sm:table-cell"
              >
                Paid Out
              </th>
              <th
                scope="col"
                className="hidden px-3 text-left text-xs font-normal text-gray-600 sm:table-cell"
              >
                Date Paid
              </th>
            </>
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {purchasedPublications.map((purchasedPublication) => (
          <tr key={purchasedPublication.id}>
            <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6 min-w-[160px]">
              {purchasedPublication.publication?.name}
              <dl className="font-normal lg:hidden">
                <dt className="sr-only">Title</dt>
                <dd className="mt-1 truncate text-gray-700">
                  {" "}
                  {purchasedPublication.publication?.name}
                </dd>
                <dt className="sr-only sm:hidden">Email</dt>
                <dd className="mt-1 truncate text-gray-500 sm:hidden">
                  Last Activity{" "}
                  {DateHandler.daysSince(
                    purchasedPublication?.article?.updatedAt
                  )}{" "}
                  Days Ago
                </dd>
              </dl>
            </td>
            {isManager && (
              <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                <div>{purchasedPublication?.profile?.name}</div>
              </td>
            )}

            <td
              id="purchased-date"
              className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell min-w-[100px]"
            >
              {DateHandler.formatDateByDay(purchasedPublication?.createdAt)}
            </td>
            {!isWhitelabelOwner && (
              <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell min-w-[100px]">
                {purchasedPublication.article?.campaign?.id ? (
                  <>
                    {purchasedPublication.article?.name && (
                      <p>{purchasedPublication.article?.name}</p>
                    )}
                    <Link
                      href={`/campaigns/${purchasedPublication.article?.campaign?.id}`}
                    >
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-900 flex gap-1 items-center"
                      >
                        <span>View </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                          />
                        </svg>
                      </a>
                    </Link>
                    {purchasedPublication?.article?.campaign
                      ?.hasEnoughImages || (
                      <span className="text-amber-500">Needs more images</span>
                    )}
                  </>
                ) : (
                  <p className="text-gray-400">Not created</p>
                )}
              </td>
            )}
            <td
              id="last-update"
              className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell min-w-[100px]"
            >
              {DateHandler.daysSince(purchasedPublication?.getLastUpdate())}
            </td>
            <td
              id="last-activity"
              className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell min-w-[180px]"
            >
              {purchasedPublication.getLastActivity()}
            </td>
            <td
              id="status"
              className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell min-w-[180px]"
            >
              {StatusHandler.renderStatus(
                purchasedPublication?.getOverallStatus(),
                isManager
              )}
            </td>

            <td
              id="published-url"
              className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell min-w-[180px]"
            >
              {purchasedPublication?.article
                ? purchasedPublication?.article?.url
                : "N/A"}
            </td>

            <td
              id="due-date"
              className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell min-w-[100px]"
            >
              {purchasedPublication?.article?.status == "publishing" ? (
                <>
                  {isManager ? (
                    <>
                      {DateHandler.calculateDueDateRange(
                        purchasedPublication?.publication?.turnaroundTime,
                        purchasedPublication?.article?.approvalDate
                      )}
                    </>
                  ) : (
                    <>
                      {DateHandler.calculateLatestDueDate(
                        purchasedPublication?.publication?.turnaroundTime,
                        purchasedPublication?.article?.approvalDate
                      )}
                    </>
                  )}
                </>
              ) : (
                "N/A"
              )}
            </td>

            <td
              id="sale-price"
              className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell min-w-[90px]"
            >
              ${purchasedPublication?.price}
            </td>
            {(isManager || isWhitelabelOwner) && (
              <>
                <td
                  id="cost"
                  className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell min-w-[80px]"
                >
                  $
                  {isManager
                    ? purchasedPublication?.publication?.internalCost
                    : purchasedPublication?.publication?.price}
                </td>
                <td
                  id="accounting"
                  className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell min-w-[100px]"
                >
                  {purchasedPublication?.isAccountingCompleted ? (
                    <p className="text-green-500">Yes</p>
                  ) : (
                    <p className="text-yellow-500">
                      {purchasedPublication?.publishDate
                        ? DateHandler.calculateLatestDueDate(
                            "10 days",
                            purchasedPublication?.publishDate
                          )
                        : "Pending"}
                    </p>
                  )}
                </td>
                {/* Paid out date */}
                <td
                  id="paid-out-date"
                  className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell min-w-[100px]"
                >
                  {purchasedPublication.isAccountingCompleted ? (
                    <p className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                      {moment(
                        purchasedPublication.accountingCompletionDate
                      ).format("MMM DD YYYY")}
                    </p>
                  ) : (
                    <p className="">N/A</p>
                  )}
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
