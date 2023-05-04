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
import PurchasedPublicationsTable from "@/components/dashboard/purchasedPublicationsTable";
import { MoonLoader } from "react-spinners";
import { SearchIcon } from "@heroicons/react/outline";

function Example({ role, site }) {
  const router = useRouter();
  const { data: session } = useSession();

  const [purchasedPublications, setPurchasedPublications] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const pageNumberRef = useRef(1);
  // const [isUserDetailSlideoverOpen, setIsUserDetailSlideoverOpen] =
  //   useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const isManager = role === "Manager";
  // const isManager = true;
  const [searchQuery, setSearchQuery] = useState("");

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
      value: "requires-action",
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
  const currentTabRef = useRef(selectedTab);

  useEffect(() => {
    if (session && (isManager || (site && site.id)) && !isLoading) {
      //check if selectedTab changed and only reset page number if so
      if (selectedTab !== currentTabRef.current) {
        pageNumberRef.current = 1;
        currentTabRef.current = selectedTab;
      }

      setPurchasedPublications([]);
      fetchPurchasedPublications();

      //update url query params
      router.push(
        {
          pathname: "/orders",
          query: {
            status: selectedTab.name,
          },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [session, selectedTab]);

  useEffect(() => {
    if (router.query.status) {
      const tab = tabs.find((tab) => {
        return tab.name === router.query.status;
      });
      if (tab) {
        setSelectedTab(tab);
      }
    }
  }, [router.query.status]);
  useEffect(() => {
    if (window !== undefined) {
      const tabFromLocalStorage = JSON.parse(localStorage.getItem('tab'))
      tabFromLocalStorage && setSelectedTab(tabFromLocalStorage)
    }
  }, [])
  useEffect(() => {
    if (session) {
      pageNumberRef.current = JSON.parse(localStorage.getItem('returnToPage')) || 1
      setPurchasedPublications([]);
      fetchPurchasedPublications();
    }
  }, [searchQuery, session]);

  const fetchPurchasedPublications = async () => {
    setIsLoading(true);

    const response = await API.purchasedPublications
      .find({
        pageNumber: pageNumberRef.current,
        status: selectedTab.value,
        site_id: site ? site.id : null,
        searchQuery,
      })
      .then(function (result) {
        let purchasedPublicationModels = result.data.data.map(
          (purchasedPublication) => {
            return new PurchasedPublicationModel(purchasedPublication);
          }
        );
        // let sortByArticleLastUpdated = purchasedPublicationModels.sort(
        //   (a, b) => {
        //     return new Date(a.createdAt) - new Date(b.createdAt);
        //   }
        // );
        setPurchasedPublications(purchasedPublicationModels);
        setPaginationData(result.data.meta.pagination);
        setIsLoading(false);
      });
  };

  const nextPage = () => {
    pageNumberRef.current += 1;
    localStorage.setItem('returnToPage', JSON.stringify(pageNumberRef.current))
    fetchPurchasedPublications();
  };

  const prevPage = () => {
    pageNumberRef.current -= 1;
    localStorage.setItem('returnToPage', JSON.stringify(pageNumberRef.current))
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

  const handlePaidPublisher = async (purchasedPublicationId) => {
    const response = await API.purchasedPublications
      .update({
        id: purchasedPublicationId,

        data: {
          is_publisher_paid: true,
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

  const handlePaidReseller = async (purchasedPublicationId) => {
    const response = await API.purchasedPublications
      .update({
        id: purchasedPublicationId,

        data: {
          is_reseller_paid: true,
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
      `Are you sure you want to cancel ${purchasedPublication.publication.name
      } for ${purchasedPublication.profile.name}? They will be credited back $${purchasedPublication.price * 1.03
      } (Including the 3% Stripe Fee).`
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
        return API.credits.create({
          data: {
            amount: purchasedPublication.price * 1.03, // Refund 3% Stripe fee
            profile: purchasedPublication.profile.id,
            type: "credit",
          },
        });
      })
      .then(function (result) {
        fetchPurchasedPublications();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    let query = e.target.value;

    pageNumberRef.current = 1;
    setSearchQuery(query);
  };
  const handleTabClick = (tab) => {
    setSelectedTab(tab)
    localStorage.removeItem('returnToPage')
  }
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
            <h2 className="text-4xl text-gray-900">Orders</h2>
            <ScrollableTabs
              tabs={tabs}
              selectedTab={selectedTab}
              handleTabClick={handleTabClick}
            />

            <div className="relative mt-1 shadow-sm border border-[#D9D4FF] rounded-full bg-white  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:max-wnone max-w-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                id="search"
                name="search"
                placeholder="Search by publication"
                onChange={handleSearch}
                className="ml-4 border-none focus:outline-none focus:ring-0 bg-transparent appearance-none block px-6 py-3  placeholder-gray-500 text-gray-900  sm:text-sm w-full"
              />
            </div>

            <div className="w-full flex flex-col gap-2">
              {purchasedPublications?.length > 0 ? (
                <>
                  <div className="overflow-x-scroll bg-white rounded-3xl">
                    <PurchasedPublicationsTable
                      purchasedPublications={purchasedPublications}
                      isManager={isManager}
                      isWhitelabelOwner={session?.profile?.is_whitelabel}
                      handleCompleteAccounting={handleCompleteAccounting}
                      handlePaidReseller={handlePaidReseller}
                      handlePaidPublisher={handlePaidPublisher}
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
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center">
                      <MoonLoader size={20} color={"#000"} loading={true} />
                      <p className="text-xl text-gray-400">Loading orders...</p>
                    </div>
                  ) : (
                    <p className="text-2xl text-gray-400">No purchases found</p>
                  )}
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
        destination: `/login?return_url=${context.resolvedUrl}`,
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
