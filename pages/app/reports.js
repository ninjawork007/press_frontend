import Navbar from "@/components/navbar";

import Link from "next/link";
import {
  LockClosedIcon,
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
} from "@heroicons/react/solid";
import { getSession, useSession, signIn, signOut } from "next-auth/react";
import API from "@/lib/api";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import StatusLabel from "@/components/statusLabel";
import moment from "moment";
import DateHandler from "@/lib/date-handler";
import StatusHandler from "@/lib/status-handler";
import ScrollableTabs from "@/components/scrollableTabs";
import { useRef } from "react";
import classNames from "classnames";
import UserDetailSlideover from "@/components/users/UserDetailSlideover";
import PurchasedPublicationModel from "@/lib/models/purchased-publication-model";
import CompletedArticlesTable from "@/components/dashboard/completedArticlesTable";
import DateTimeRange from "@/components/dateTimeRange";
import "react-datetime/css/react-datetime.css";
import * as priceFormatter from "@/lib/price-formatter";
import { CSVLink } from "react-csv";
import ProfileSearch from "@/components/dashboard/profile-search";

function Example({ role, site }) {
  const router = useRouter();
  const { data: session } = useSession();

  const [purchasedPublications, setPurchasedPublications] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [totals, setTotals] = useState({});
  const pageNumberRef = useRef(1);
  const [periodFrom, setPeriodFrom] = useState(moment().subtract(7, "day"));
  const [periodTo, setPeriodTo] = useState(moment().startOf("day"));
  const [selectedStatus, setSelectedStatus] = useState("completed");
  const [csvData, setCsvData] = useState({ data: [], headers: [] });
  const [selectedProfile, setSelectedProfile] = useState(null);
  // const [isUserDetailSlideoverOpen, setIsUserDetailSlideoverOpen] =
  //   useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const isManager = role === "Manager";
  // const isManager = true;

  const tabs = [
    {
      name: "all",
      value: null,
    },
    {
      name: "action required",
      value: "reviewing",
    },
    {
      name: "reviewing",
      value: "action-required",
    },
    {
      name: "publishing",
      value: "publishing",
    },
    {
      name: "completed",
      value: "completed",
    },
  ];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  // useEffect(() => {
  //   if (session && periodFrom && periodTo && (isManager || (site && site.id))) {
  //     pageNumberRef.current = 1;
  //     setPurchasedPublications([]);
  //     fetchPurchasedPublications();
  //   }
  // }, [session, selectedTab]);

  useEffect(() => {
    if (periodFrom && periodTo) {
      fetchPurchasedPublications();
    }
  }, [periodFrom, periodTo, selectedStatus, selectedProfile]);

  const handleCSVExport = () => {
    // const csvRows = publications.reduce((result, publication) => {
    //   let row = publication.getCSVData();
    //   if (row) {
    //     return result.push(row);
    //   }
    //   return result;
    // }, []);

    const csvRows = purchasedPublications.map((purchasedPublication) => {
      return purchasedPublication.getCSVData();
    });

    const headers = csvRows[0]
      ? Object.keys(csvRows[0]).map((key) => {
          return { label: key, key: key };
        })
      : [];
    const csvData = {
      data: csvRows,
      headers: headers,
    };
    setCsvData(csvData);
  };

  const fetchPurchasedPublications = async () => {
    setIsLoading(true);

    const response = await API.purchasedPublications
      .getReports({
        pageNumber: pageNumberRef.current,
        session,
        startDate: periodFrom.format("YYYY-MM-DD"), // seems to be the only acceptable date for strapi date filter
        endDate: periodTo.format("YYYY-MM-DD"), // seems to be the only acceptable date for strapi date filter
        site_id: site ? site.id : null,
        status: selectedStatus,
        profile_id: selectedProfile,
      })
      .then(function (result) {
        let purchasedPublicationModels = result.data.purchasedPublications.map(
          (purchasedPublication) => {
            const purchasedPublicationModel = new PurchasedPublicationModel(
              purchasedPublication
            );
            console.log({ purchasedPublicationModel, purchasedPublication });
            return purchasedPublicationModel;
          }
        );
        // let sortByArticleLastUpdated = purchasedPublicationModels.sort(
        //   (a, b) => {
        //     return new Date(a.createdAt) - new Date(b.createdAt);
        //   }
        // );
        setTotals(result.data.totals);
        setPurchasedPublications(purchasedPublicationModels);
        // setPaginationData(result.data.meta.pagination);
        setIsLoading(false);
      });
  };

  const nextPage = () => {
    pageNumberRef.current += 1;
    fetchPurchasedPublications();
  };

  const prevPage = () => {
    pageNumberRef.current -= 1;
    fetchPurchasedPublications();
  };

  const handleCompleteAccounting = async (purchasedPublicationId) => {
    const response = await API.purchasedPublications
      .update({
        id: purchasedPublicationId,

        data: {
          is_accounting_completed: true,
          accounting_completion_date: new Date(),
        },
        session,
      })
      .then(function (result) {
        fetchPurchasedPublications();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleCancel = async (purchasedPublicationId) => {
    const purchasedPublication = purchasedPublications.find(
      (purchasedPublication) => {
        return purchasedPublication.id === purchasedPublicationId;
      }
    );

    window.confirm(
      `Are you sure you want to cancel ${purchasedPublication.publication.name} for ${purchasedPublication.profile.name}?`
    );

    const response = await API.purchasedPublications
      .update({
        id: purchasedPublicationId,

        data: {
          status: "canceled",
        },
        session,
      })
      .then(function (result) {
        fetchPurchasedPublications();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleDateRangeChange = ({ startDate, endDate }) => {
    setPeriodFrom(startDate);
    setPeriodTo(endDate);
  };

  const onProfileSelected = (profile_id) => {
    setSelectedProfile(profile_id);
  };

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full">
        ```
      */}
      <Navbar isManager={true} name="Press Backend" />
      {/* <UserDetailSlideover
        open={isUserDetailSlideoverOpen}
        setOpen={setIsUserDetailSlideoverOpen}
        name={selectedUser?.name}
        email={selectedUser?.email}
        company_type={selectedUser?.companyType}
      /> */}
      <div className="min-h-full py-12 px-4 sm:px-6 lg:px-8 h-full max-w-7xl mx-auto">
        <div className="flex flex-col gap-16 mt-6 ">
          <div className="space-y-4 col-span-2 w-full">
            <h2 className="text-4xl text-gray-900">Completed Orders</h2>
            {/* <ScrollableTabs
              tabs={tabs}
              selectedTab={selectedTab}
              handleTabClick={(tab) => setSelectedTab(tab)}
            /> */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                defaultValue="completed"
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option>completed</option>
                <option>pending</option>
                <option>purchased</option>
              </select>
            </div>
            <ProfileSearch onProfileSelected={onProfileSelected} />
            <DateTimeRange
              startDate={periodFrom}
              endDate={periodTo}
              onDatesChange={handleDateRangeChange}
            />
            {csvData.data.length > 0 ? (
              <CSVLink
                data={csvData.data}
                headers={csvData.headers}
                className="button"
              >
                Download CSV
              </CSVLink>
            ) : (
              <button
                className="items-center flex gap-2 text-lg text-indigo-500"
                onClick={() => handleCSVExport()}
              >
                Export{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </button>
            )}
            <div className="w-full flex flex-col gap-2">
              {purchasedPublications?.length > 0 ? (
                <>
                  <p>
                    <span className="font-bold">
                      {purchasedPublications?.length}
                    </span>{" "}
                    articles
                  </p>
                  {totals && (
                    <div>
                      <div className="flex gap-2">
                        <p>
                          <span className="font-bold">
                            {priceFormatter.formatDefaultPrice(totals?.total)}
                          </span>{" "}
                          total
                        </p>
                        <p>
                          <span className="font-bold">
                            {priceFormatter.formatDefaultPrice(
                              totals?.reseller_cost
                            )}
                          </span>{" "}
                          reseller cost
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <p>
                          <span className="font-bold">
                            {priceFormatter.formatDefaultPrice(
                              totals?.internal_cost
                            )}
                          </span>{" "}
                          cost
                        </p>
                        <p>
                          <span className="font-bold">
                            {priceFormatter.formatDefaultPrice(
                              totals?.publisher_paid
                            )}
                          </span>{" "}
                          Publisher Paid
                        </p>
                        <p>
                          <span className="font-bold">
                            {priceFormatter.formatDefaultPrice(
                              totals?.reseller_paid
                            )}
                          </span>{" "}
                          Reseller Paid
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="overflow-x-scroll bg-white rounded-3xl">
                    <CompletedArticlesTable
                      purchasedPublications={purchasedPublications}
                      isManager={isManager}
                      isWhitelabelOwner={session?.profile?.is_whitelabel}
                      handleCompleteAccounting={handleCompleteAccounting}
                      handleCancel={handleCancel}
                      // handleUserClick={() => {
                      //   setSelectedUser(profile);
                      //   setIsUserDetailSlideoverOpen(true);
                      // }}
                    />
                  </div>

                  <nav className="px-4 flex items-center justify-center sm:px-0 mt-8 sm:mt-12 pb-14">
                    <div className="-mt-px w-0 flex-1 flex">
                      <a
                        href="#"
                        onClick={prevPage}
                        className={classNames(
                          "relative inline-flex items-center pl-3 rounded-full py-2 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50",
                          paginationData.page > 1 ? "opacity-100" : "opacity-30"
                        )}
                        disabled={paginationData.page <= 1}
                      >
                        <ArrowNarrowLeftIcon
                          className="mr-3 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </a>
                    </div>{" "}
                    <p className="text-sm text-center text-gray-700">
                      <span className="font-medium">
                        {paginationData.pageSize * (paginationData.page - 1) +
                          1}{" "}
                        to{" "}
                        {paginationData.pageSize * (paginationData.page - 1) +
                          purchasedPublications.length}{" "}
                        of <b>{paginationData.total} results</b>
                      </span>
                    </p>
                    <div className="-mt-px w-0 flex-1 flex justify-end">
                      <button
                        onClick={nextPage}
                        className={classNames(
                          "ml-3 relative inline-flex items-center pr-3 rounded-full py-2 border border-gray-300 text-sm font-medium text-gray-700  bg-white hover:bg-gray-50",
                          paginationData.page < paginationData.pageCount
                            ? "opacity-100"
                            : "opacity-30"
                        )}
                        disabled={
                          paginationData.page == paginationData.pageCount
                        }
                      >
                        <ArrowNarrowRightIcon
                          className="ml-3 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </nav>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <p className="text-2xl text-gray-400">No purchases found</p>
                  <Link href="/publications">
                    <button className="relative whitespace-nowrap inline-flex items-center justify-center px-8 py-3 border border-[#D3CCFF] hover:bg-[#2302FD] hover:text-white font-medium text-black rounded-full">
                      Buy publications
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  let site = null;
  if (session.profile.is_whitelabel) {
    site = await API.sites.get({ profile_id: session.profile.id });
  }
  let role;
  if (session.profile.is_whitelabel) {
    role = "Whitelabel";
  } else if (session.profile.is_affiliate) {
    role = "Affiliate";
  } else if (session.role == "Manager") {
    role = "Manager";
  } else {
    role = "User";
  }
  return {
    props: {
      // purchasedPublications: purchasedPublications,
      site,
      role: role,
    },
  };
};

export default Example;
