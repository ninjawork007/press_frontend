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
import moment from "moment";
import ScrollableTabs from "@/components/scrollableTabs";
import { useRef } from "react";
import classNames from "classnames";
import UserDetailSlideover from "@/components/users/UserDetailSlideover";

function Example({ role }) {
  const router = useRouter();
  const { data: session } = useSession();
  const profile = session?.profile;
  const [referrals, setReferrals] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const isManager = role === "Manager";
  const pageNumberRef = useRef(1);
  const [isUserDetailSlideoverOpen, setIsUserDetailSlideoverOpen] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [affiliateURL, setAffiliateURL] = useState(null);

  useEffect(() => {
    if (profile) {
      setAffiliateURL(`https://${location.host}?aff=${profile.id}`);
    }
  }, [profile]);
  const tabs = [
    {
      name: "all",
      value: null,
    },
    {
      name: "action required",
      value: isManager ? "reviewing" : "action-required",
    },
    {
      name: "reviewing",
      value: isManager ? "action-required" : "reviewing",
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
      setReferrals([]);
      fetchReferrals();
    }
  }, [session, selectedTab]);

  const fetchReferrals = async () => {
    setIsLoading(true);

    const response = await API.referrals
      .find({
        pageNumber: pageNumberRef.current,
        status: selectedTab.value,
        session,
      })
      .then(function (result) {
        setReferrals(result.data.data);
        setPaginationData(result.data.meta.pagination);
        setIsLoading(false);
      });
  };

  const nextPage = () => {
    pageNumberRef.current += 1;
    fetchReferrals();
  };

  const prevPage = () => {
    pageNumberRef.current -= 1;
    fetchReferrals();
  };

  const handleUrlCopy = (e) => {
    navigator.clipboard.writeText(affiliateURL);
    e.target.innerText = "Copied!";
    // e.target.style.backgroundColor = "#4F46E5";
    setTimeout(() => {
      e.target.innerText = "Copy";
      // e.target.style.backgroundColor = "#000";
    }, 1000);
  };

  return (
    <>
      <Navbar isManager={isManager} />
      <UserDetailSlideover
        open={isUserDetailSlideoverOpen}
        setOpen={setIsUserDetailSlideoverOpen}
        name={selectedUser?.attributes.name}
        email={selectedUser?.attributes.email}
        company_type={selectedUser?.attributes.company_type}
      />
      <div className="min-h-full py-12 px-4 sm:px-6 lg:px-8 h-full max-w-7xl mx-auto">
        <div className="flex flex-col gap-16 mt-6 ">
          <div className="space-y-4 col-span-2 w-full">
            <h2 className="text-4xl text-gray-900">Referrals</h2>
            {/* <ScrollableTabs
              tabs={tabs}
              selectedTab={selectedTab}
              handleTabClick={(tab) => setSelectedTab(tab)}
            /> */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-xl text-gray-900">Your Referral Link</h3>
                <p className="text-gray-500">
                  Share this link with your friends and family to earn rewards.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2">
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md px-4 py-2 w-full"
                    value={affiliateURL}
                    readOnly
                  />
                  <button
                    className="bg-blue-500 text-white rounded-md px-4 py-2"
                    onClick={handleUrlCopy}
                  >
                    Copy
                  </button>
                </div>
                {/* <p className="text-gray-500">You have earned <span className="font-bold">${profile?.affiliate_earnings}</span> in rewards.</p> */}
              </div>
            </div>
            {profile?.is_affiliate && <h1>IS affiliate</h1>}

            <div className="w-full flex flex-col gap-2">
              {referrals?.length > 0 ? (
                <>
                  <div className="grid grid-cols-3 gap-2 px-6 rounded-2xl justify-between items-center text-gray-600">
                    <p>Name</p>
                    <p>Signup Date</p>
                  </div>

                  {referrals?.map((referral, index) => (
                    <div
                      className="grid grid-cols-3 gap-2 p-6 bg-white rounded-2xl justify-between items-center border"
                      key={referral.id}
                    >
                      <div>
                        <p className="font-bold">
                          {referral.attributes?.profile?.data?.attributes?.name}
                        </p>
                      </div>

                      <p>
                        {moment(referral?.attributes?.signup_date).format(
                          "MMM DD YYYY"
                        )}
                      </p>
                    </div>
                  ))}

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
                          referrals.length}{" "}
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
                  <p className="text-2xl text-gray-400">No referrals found</p>
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

  return {
    props: {
      role: session.role,
    },
  };
};

export default Example;
