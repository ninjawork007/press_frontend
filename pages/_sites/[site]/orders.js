import SiteWrapper from "@/components/siteWrapper";
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

function SiteOrders({ role, siteData }) {
  const router = useRouter();
  const { data: session } = useSession();

  const [purchasedPublications, setPurchasedPublications] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const pageNumberRef = useRef(1);
  const [isUserDetailSlideoverOpen, setIsUserDetailSlideoverOpen] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const isManager = role === "Manager";
  const tabs = [
    {
      name: "all",
      value: null,
    },
    {
      name: "reviewing",
      value: "reviewing",
    },
    {
      name: "action required",
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

  useEffect(() => {
    if (session) {
      pageNumberRef.current = JSON.parse(localStorage.getItem('returnToPage')) || 1
      setPurchasedPublications([]);
      fetchPurchasedPublications();
    }
  }, [session, selectedTab]);
  useEffect(() => {
    if (window !== undefined) {
      const tabFromLocalStorage = JSON.parse(localStorage.getItem('tab'))
      tabFromLocalStorage && setSelectedTab(tabFromLocalStorage)
    }
  }, [])

  const fetchPurchasedPublications = async () => {
    setIsLoading(true);

    const response = await API.purchasedPublications
      .getForProfile({
        pageNumber: pageNumberRef.current,
        status: selectedTab.value,
        profile_id: session?.profile?.id,
      })
      .then(function (result) {
        let purchasedPublicationModels = result.data.data.map(
          (purchasedPublication) => {
            return new PurchasedPublicationModel(purchasedPublication);
          }
        );
        purchasedPublicationModels.sort((a, b) => {
          return new Date(b.getLastUpdate()) - new Date(a.getLastUpdate());
        });
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
  const handleTabClick = (tab) => {
    setSelectedTab(tab)
    localStorage.removeItem('returnToPage')
  }
  return (
    <SiteWrapper siteData={siteData}>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full">
        ```
      */}

      <UserDetailSlideover
        open={isUserDetailSlideoverOpen}
        setOpen={setIsUserDetailSlideoverOpen}
        name={selectedUser?.name}
        email={selectedUser?.email}
        company_type={selectedUser?.companyType}
      />
      <div className="min-h-full py-12 px-4 sm:px-6 lg:px-8 h-full max-w-7xl mx-auto">
        <div className="flex flex-col gap-16 mt-6 ">
          <div className="space-y-4 col-span-2 w-full">
            <h2 className="text-4xl text-gray-900">Orders</h2>
            <ScrollableTabs
              tabs={tabs}
              selectedTab={selectedTab}
              handleTabClick={handleTabClick}
            />

            <div className="w-full flex flex-col gap-2">
              {purchasedPublications?.length > 0 ? (
                <>
                  <div className="overflow-x-scroll bg-white rounded-3xl">
                    <PurchasedPublicationsTable
                      purchasedPublications={purchasedPublications}
                      isManager={isManager}
                      handleUserClick={(profile) => {
                        setSelectedUser(profile);
                        setIsUserDetailSlideoverOpen(true);
                      }}
                    ></PurchasedPublicationsTable>
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
    </SiteWrapper>
  );
}

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  const { params } = context;

  const { site } = params;

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login?return_url=/orders",
      },
    };
  }

  let siteData;
  if (site.includes(".")) {
    siteData = await API.sites.get({ customDomain: site });
  } else {
    siteData = await API.sites.get({ subdomain: site });
  }
  return {
    props: {
      // purchasedPublications: purchasedPublications,
      siteData,
      role: session.role,
    },
  };
};

export default SiteOrders;
