import { useRouter } from "next/router";
import DateHandler from "@/lib/date-handler";
import Link from "next/link";
import StatusLabel from "@/components/statusLabel";
import StatusHandler from "@/lib/status-handler";
import CampaignManager from "@/lib/campaignManager";
import { DocumentIcon } from "@heroicons/react/outline";
import moment from "moment";

export default function PurchasedPublicationsTable({
  purchasedPublications,
  isManager,
  // handleUserClick,
  handleCompleteAccounting,
  handleCancel,
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
            Publish Date
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
                Total Due
              </th>
              {isManager && (
                <th
                  scope="col"
                  className="hidden px-3 text-left text-xs font-normal text-gray-600 sm:table-cell"
                >
                  Reseller Owed
                </th>
              )}
              {isManager && (
                <th
                  scope="col"
                  className="hidden px-3 text-left text-xs font-normal text-gray-600 sm:table-cell"
                >
                  Publisher Owed
                </th>
              )}
            </>
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {purchasedPublications.map((purchasedPublication) => (
          <tr key={purchasedPublication.id}>
            <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6 min-w-[150px]">
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
              <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell min-w-[150px]">
                {/* <Link href='/customer'
                  // onClick={() => router.push('/app/customer-profile', purchasedPublication?.profile, isManager)}
                >
                  <a className=" text-indigo-600 cursor-pointer">{purchasedPublication?.profile?.name}</a>
                </Link> */}
                <Link href={`/customers/${purchasedPublication?.profile?.id}`}>
                  <a className="text-indigo-600 cursor-pointer">
                    {purchasedPublication?.profile?.name}
                  </a>
                </Link>
                {purchasedPublication.site?.name !== "Waverly Press" && (
                  <p className="text-xs font-bold">
                    {purchasedPublication.site?.name}
                  </p>
                )}
              </td>
            )}

            <td
              id="purchased-date"
              className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell min-w-[100px]"
            >
              {DateHandler.formatDateByDay(purchasedPublication?.createdAt)}
            </td>
            <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell  min-w-[180px]">
              {!isWhitelabelOwner && (
                <>
                  {purchasedPublication.article?.name && (
                    <p className="text-xs">
                      {purchasedPublication.article?.name}
                    </p>
                  )}
                  <Link
                    href={`/campaigns/${purchasedPublication.article?.campaign?.id}`}
                  >
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-900 flex gap-1 items-center font-bold"
                    >
                      <DocumentIcon className="h-4 w-4" />
                      <span>View Campaign</span>
                    </a>
                  </Link>
                  <Link
                    href={`/campaigns/${purchasedPublication.article?.campaign?.id}/articles/${purchasedPublication?.article.id}`}
                  >
                    <a
                      href="#"
                      className="text-indigo-600 hover:text-indigo-900 flex gap-1 items-center font-bold"
                    >
                      <DocumentIcon className="h-4 w-4" />
                      <span>View Article</span>
                    </a>
                  </Link>

                  {purchasedPublication?.article?.url && (
                    <a
                      href={purchasedPublication?.article?.url}
                      className="font-bold flex gap-1 items-center cursor-pointer text-green-500 hover:text-green-900"
                    >
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
                      View Published
                    </a>
                  )}
                </>
              )}
            </td>

            <td
              id="status"
              className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell"
            >
              {purchasedPublication?.getOverallStatus() === "completed" && (
                <div className="mt-1">
                  {DateHandler.formatDate(
                    purchasedPublication?.article?.publishDate
                  )}
                </div>
              )}
            </td>

            <td
              id="sale-price"
              className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell min-w-[80px]"
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
                  {purchasedPublication?.status === "canceled" ? (
                    <>$0</>
                  ) : (
                    <>
                      <span className="font-bold">
                        $
                        {isManager
                          ? purchasedPublication?.price
                          : purchasedPublication?.price -
                            purchasedPublication?.publication?.price}
                      </span>
                      {purchasedPublication?.isAccountingCompleted ? (
                        <p className="text-green-500">
                          Paid{" "}
                          {moment(
                            purchasedPublication.accountingCompletionDate
                          ).format("MM/DD/YY")}
                        </p>
                      ) : (
                        <p className="text-yellow-500">
                          {purchasedPublication?.article?.publishDate ? (
                            <>
                              By{" "}
                              {DateHandler.calculateLatestDueDate(
                                "10 days",
                                purchasedPublication?.article?.publishDate
                              )}
                            </>
                          ) : (
                            "Pending"
                          )}
                        </p>
                      )}
                      {isManager &&
                        purchasedPublication?.article?.publishDate &&
                        !purchasedPublication?.isAccountingCompleted && (
                          <button
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() =>
                              handleCompleteAccounting(purchasedPublication?.id)
                            }
                          >
                            Mark as Paid
                          </button>
                        )}
                    </>
                  )}
                </td>
                {isManager && (
                  <td
                    id="reseller-owed"
                    className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell min-w-[100px]"
                  >
                    {purchasedPublication?.status === "canceled" ? (
                      <>$0</>
                    ) : (
                      <>
                        <span className="font-bold">
                          $
                          {purchasedPublication?.price -
                            purchasedPublication?.publication?.price}
                        </span>
                        {purchasedPublication?.isAccountingCompleted ? (
                          <p className="text-green-500">
                            Paid{" "}
                            {moment(
                              purchasedPublication.accountingCompletionDate
                            ).format("MM/DD/YY")}
                          </p>
                        ) : (
                          <p className="text-yellow-500">
                            {purchasedPublication?.article?.publishDate ? (
                              <>
                                By{" "}
                                {DateHandler.calculateLatestDueDate(
                                  "10 days",
                                  purchasedPublication?.article?.publishDate
                                )}
                              </>
                            ) : (
                              "Pending"
                            )}
                          </p>
                        )}
                      </>
                    )}
                  </td>
                )}
                {isManager && (
                  <td
                    id="accounting"
                    className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell min-w-[100px]"
                  >
                    {purchasedPublication?.status === "canceled" ? (
                      <>$0</>
                    ) : (
                      <>
                        <span className="font-bold">
                          $
                          {purchasedPublication?.price -
                            purchasedPublication?.publication?.internalCost}
                        </span>
                        {purchasedPublication?.isAccountingCompleted ? (
                          <p className="text-green-500">
                            Paid{" "}
                            {moment(
                              purchasedPublication.accountingCompletionDate
                            ).format("MM/DD/YY")}
                          </p>
                        ) : (
                          <p className="text-yellow-500">
                            {purchasedPublication?.article?.publishDate ? (
                              <>
                                By{" "}
                                {DateHandler.calculateLatestDueDate(
                                  "10 days",
                                  purchasedPublication?.article?.publishDate
                                )}
                              </>
                            ) : (
                              "Pending"
                            )}
                          </p>
                        )}
                      </>
                    )}
                  </td>
                )}
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
