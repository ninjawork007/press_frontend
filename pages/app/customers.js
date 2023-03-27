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
import ProfileModel from "@/lib/models/profile-model";
import CustomersTable from "@/components/dashboard/customersTable";
import { SearchIcon } from "@heroicons/react/outline";

function Example({ role, site }) {
  const router = useRouter();
  const { data: session } = useSession();

  const [customers, setCustomers] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const pageNumberRef = useRef(1);
  const [isUserDetailSlideoverOpen, setIsUserDetailSlideoverOpen] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const isManager = role === "Manager";
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

  useEffect(() => {
    if (session) {
      pageNumberRef.current = 1;
      setCustomers([]);
      fetchCustomers();
    }
  }, [session, selectedTab]);

  useEffect(() => {
    if (session) {
      pageNumberRef.current = 1;
      setCustomers([]);
      fetchCustomers();
    }
  }, [searchQuery, session]);

  const fetchCustomers = async () => {
    setIsLoading(true);
    let findPromise;
    if (isManager) {
      findPromise = API.profiles.findAllProfiles({
        pageNumber: pageNumberRef.current,
        status: selectedTab.value,
        searchQuery,
      });
    } else {
      findPromise = API.profiles.findSiteProfiles({
        pageNumber: pageNumberRef.current,
        status: selectedTab.value,
        site_id: site ? site.id : null,
        searchQuery,
      });
    }
    const response = await findPromise.then(function (result) {
      let profileModels = result.data.data.map((profileModel) => {
        return new ProfileModel(profileModel);
      });

      setCustomers(profileModels);
      setPaginationData(result.data.meta.pagination);
      setIsLoading(false);
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    let query = e.target.value;

    pageNumberRef.current = 1;
    setSearchQuery(query);
  };

  const nextPage = () => {
    pageNumberRef.current += 1;
    fetchCustomers();
  };

  const prevPage = () => {
    pageNumberRef.current -= 1;
    fetchCustomers();
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
            <h2 className="text-4xl text-gray-900">Customers</h2>
            {/* <ScrollableTabs
              tabs={tabs}
              selectedTab={selectedTab}
              handleTabClick={(tab) => setSelectedTab(tab)}
            /> */}

            <div className="w-full flex flex-col gap-2">
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
                  placeholder="Search"
                  onChange={handleSearch}
                  className="ml-4 border-none focus:outline-none focus:ring-0 bg-transparent appearance-none block px-6 py-3  placeholder-gray-500 text-gray-900  sm:text-sm w-full"
                />
              </div>
              {customers?.length > 0 ? (
                <>
                  <div className="overflow-x-scroll bg-white rounded-3xl">
                    <CustomersTable
                      customers={customers}
                      isManager={isManager}
                      isWhitelabelOwner={session?.profile?.is_whitelabel}
                      handleUserClick={(profile) => {
                        setSelectedUser(profile);
                        setIsUserDetailSlideoverOpen(true);
                      }}
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
                          customers.length}{" "}
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
                  <p className="text-2xl text-gray-400">No customers found</p>
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
      // customers: customers,
      site,
      role: role,
    },
  };
};

export default Example;
