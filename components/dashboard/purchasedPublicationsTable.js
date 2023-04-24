import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import DateHandler from "@/lib/date-handler";
import Link from "next/link";
import StatusLabel from "@/components/statusLabel";
import StatusHandler from "@/lib/status-handler";
import CampaignManager from "@/lib/campaignManager";
import {
  DocumentTextIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  PlusIcon,
} from "@heroicons/react/outline";
import moment from "moment";
import * as priceFormatter from "@/lib/price-formatter";

export default function PurchasedPublicationsTable({
  purchasedPublications,
  isManager,
  // handleUserClick,
  handleCompleteAccounting,
  handlePaidPublisher,
  handlePaidReseller,
  handleCancel,
  isWhitelabelOwner,
}) {
  const router = useRouter();
  // console.log('Manager: ', isManager);
  // console.log(purchasedPublications)
  const positionRef = useRef(0)
  useEffect(() => {
    const scrollPosition = localStorage.getItem('scrollTo')
    positionRef.current = scrollPosition || 0
    if (window !== undefined && scrollPosition) {
      window.scrollTo(0, scrollPosition)
      localStorage.removeItem('scrollTo')
    }
  }, [])
  return (
    <table className="min-w-full table-auto mt-4">
      <thead className="">
        <tr>
          {isManager && (
            <th
              scope="col"
              className="pl-4 pr-3 text-left text-xs font-normal text-gray-600 sm:pl-6"
            >
              ID
            </th>
          )}

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
                {isManager ? "Publisher Owed" : "Total Due"}
              </th>
              {isManager && (
                <th
                  scope="col"
                  className="hidden px-3 text-left text-xs font-normal text-gray-600 sm:table-cell"
                >
                  Reseller Owed
                </th>
              )}
            </>
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {purchasedPublications.map((purchasedPublication) => (
          <tr key={purchasedPublication.id} ref={positionRef}>
            {isManager && (
              <td className="hidden py-4 px-4 text-sm text-gray-500 lg:table-cell">
                {purchasedPublication.id}
              </td>
            )}
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
                {!purchasedPublication.site?.isInternal && (
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
            {!isWhitelabelOwner && (
              <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell  min-w-[180px]">
                {purchasedPublication.article &&
                  purchasedPublication.article.campaign ? (
                  <>
                    {purchasedPublication.article?.name && (
                      <p>{purchasedPublication.article?.name}</p>
                    )}

                    <div className="flex gap-2" onClick={() => localStorage.setItem('scrollTo', positionRef.current.offsetTop)}>
                      <Link
                        href={`/campaigns/${purchasedPublication.article?.campaign?.id}/articles/${purchasedPublication.article?.id}`}
                      >
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900 flex gap-1 items-center font-bold"
                        >
                          <DocumentTextIcon className="h-4 w-4" />
                          <span>View Article</span>
                        </a>
                      </Link>
                      <Link
                        href={`/campaigns/${purchasedPublication.article?.campaign?.id}`}
                      >
                        <a
                          href="#"
                          className="text-gray-600 hover:text-gray-900 flex gap-1 items-center font-bold"
                        >
                          <DocumentDuplicateIcon className="h-4 w-4" />
                          <span>View Campaign</span>
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
                    </div>
                    {purchasedPublication?.article?.images?.length > 0 || (
                      <span className="text-amber-500">Needs more images</span>
                    )}
                  </>
                ) : (
                  <div onClick={() => localStorage.setItem('scrollTo', positionRef.current.offsetTop)}>
                    {isManager ? (
                      <p className="text-gray-400">Not created</p>
                    ) : (
                      <Link href={`/campaigns/new`}>
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900 flex gap-1 items-center font-bold"
                        >
                          <PlusIcon className="h-4 w-4" />
                          <span>Create Campaign</span>
                        </a>
                      </Link>
                    )}
                  </div>
                )}
              </td>
            )}

            <td
              id="last-activity"
              className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell"
            >
              <span className="font-bold">
                {purchasedPublication.getLastActivity()}
              </span>
              <br />

              {DateHandler.daysSince(purchasedPublication?.getLastUpdate())}
            </td>
            <td
              id="status"
              className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell min-w-[180px]"
            >
              {StatusHandler.renderStatus(
                purchasedPublication?.getOverallStatus(),
                isManager
              )}
              {purchasedPublication?.getOverallStatus() === "completed" && (
                <div className="mt-1">
                  Published{" "}
                  {DateHandler.formatDate(
                    purchasedPublication?.article?.publishDate
                  )}
                </div>
              )}
              {isManager &&
                purchasedPublication?.article?.publishDate &&
                !purchasedPublication?.isAccountingCompleted && (
                  <p className="text-green-600">
                    Accounting completed{" "}
                    <CheckIcon className="h-4 w-4 inline" />
                  </p>
                )}
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
                      {DateHandler.checkIfDateIsOverdue(
                        purchasedPublication?.publication?.turnaroundTime,
                        purchasedPublication?.article?.approvalDate
                      ) && (
                          <span className="text-amber-500 font-bold">
                            {" "}
                            (Overdue)
                          </span>
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
              className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell min-w-[80px]"
            >
              {priceFormatter.formatDefaultPrice(purchasedPublication?.price)}
            </td>
            {(isManager || isWhitelabelOwner) && (
              <>
                <td
                  id="cost"
                  className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell min-w-[80px]"
                >
                  {priceFormatter.formatDefaultPrice(
                    isManager
                      ? purchasedPublication?.publication?.internalCost
                      : purchasedPublication?.publication?.price
                  )}
                </td>
                <td
                  id="accounting"
                  className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell min-w-[100px]"
                >
                  {purchasedPublication?.status === "canceled" ? (
                    <>$0</>
                  ) : (
                    <>
                      <p className="font-bold">
                        {priceFormatter.formatDefaultPrice(
                          isManager
                            ? purchasedPublication?.publicationInternalCost
                            : purchasedPublication?.price -
                            purchasedPublication?.publicationSalePrice
                        )}
                      </p>
                      {isManager && purchasedPublication?.isPublisherPaid && (
                        <p className="text-green-500">
                          Paid{" "}
                          {moment(
                            purchasedPublication.accountingCompletionDate
                          ).format("MM/DD/YY")}
                        </p>
                      )}

                      {isManager &&
                        purchasedPublication?.article?.publishDate &&
                        !purchasedPublication?.isPublisherPaid && (
                          <button
                            className="text-indigo-600 hover:text-indigo-900 text-left"
                            onClick={() =>
                              handlePaidPublisher(purchasedPublication?.id)
                            }
                          >
                            Mark as Publisher Paid
                          </button>
                        )}

                      {isManager &&
                        !purchasedPublication?.isAccountingCompleted && (
                          <button
                            className="text-red-600 hover:text-indigo-900"
                            onClick={() =>
                              handleCancel(purchasedPublication?.id)
                            }
                          >
                            Cancel
                          </button>
                        )}
                    </>
                  )}
                </td>
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
                          {priceFormatter.formatDefaultPrice(
                            purchasedPublication?.price -
                            purchasedPublication?.publicationSalePrice
                          )}
                        </span>
                      </>
                    )}
                    {purchasedPublication?.article?.publishDate &&
                      !purchasedPublication?.isResellerPaid &&
                      !purchasedPublication.site?.isInternal && (
                        <button
                          className="text-indigo-600 hover:text-indigo-900 text-left"
                          onClick={() =>
                            handlePaidReseller(purchasedPublication?.id)
                          }
                        >
                          Mark as Reseller Paid
                        </button>
                      )}
                    {isManager && purchasedPublication?.isResellerPaid && (
                      <p className="text-green-500">Paid</p>
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
