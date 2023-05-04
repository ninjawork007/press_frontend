/*
  This example requires Tailwind CSS v2.0+

  This example requires some changes to your config:

  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import Navbar from "@/components/navbar";
import Link from "next/link";
import {
  SearchIcon,
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
} from "@heroicons/react/solid";
import { getSession, useSession, signIn, signOut } from "next-auth/react";
import API from "@/lib/api";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import StatusLabel from "@/components/statusLabel";
import moment from "moment";
import MessageList from "@/components/messageList";
import StatusHandler from "@/lib/status-handler";
import SiteWrapper from "@/components/siteWrapper";
import CampaignModel from "@/lib/models/campaign-model";
import classNames from "classnames";
function Dashboard({ role }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const pageNumberRef = useRef(0);
  const [isLoading, setIsLoading] = useState(false);

  const isManager = role === "Manager";
  // useEffect(() => {

  //   if (!session) {
  //     router.replace('/login');
  //   }
  // }, [])

  useEffect(() => {
    if (session) {
      pageNumberRef.current = 0;
      setCampaigns([]);
      fetchCampaigns();
    }
  }, [searchQuery, session]);

  const fetchCampaigns = async () => {
    setIsLoading(true);

    const response = await API.campaigns
      .findAll({ pageNumber: pageNumberRef.current, searchQuery })
      .then(function (result) {
        let campaignModels = result.data.data.map((campaign) => {
          return new CampaignModel(campaign);
        });
        // let sortByArticleLastUpdated = purchasedPublicationModels.sort(
        //   (a, b) => {
        //     return new Date(a.createdAt) - new Date(b.createdAt);
        //   }
        // );
        setCampaigns(campaignModels);
        setPaginationData(result.data.meta.pagination);
        setIsLoading(false);
      });
  };

  const nextPage = () => {
    pageNumberRef.current += 1;
    fetchCampaigns();
  };

  const prevPage = () => {
    pageNumberRef.current -= 1;
    fetchCampaigns();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    let query = e.target.value;

    pageNumberRef.current = 1;
    setSearchQuery(query);
  };

  useEffect(() => {
    if (!session) {
      return;
    }

    async function getMessages() {
      const user = await API.users.get(session);

      let messages = [];

      if (isManager) {
        messages = await API.messages
          .getAllClientMessages(session)
          .then(function (result) {
            return result.data?.data;
            // setMessages(sortedMessages)
          })
          .catch(function (error) {
            console.log(error);
            return [];
          });
      } else {
        let campaignIds = campaigns?.map((campaign) => campaign.id);

        if (campaignIds?.length > 0) {
          messages = await API.messages
            .getMessagesForCampaignsForClient(campaignIds, session)
            .then(function (result) {
              return result?.data?.data;
            })
            .catch(function (error) {
              console.log(error);
              return [];
            });
        }
      }
      setMessages(messages);
    }

    getMessages();
  }, [session, campaigns, isManager]);

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full">
        ```
      */}
      <Navbar name="Press Backend" isManager={true} />{" "}
      <div className="min-h-full py-12 px-4 sm:px-6 lg:px-8 h-full max-w-7xl mx-auto">
        <div className="flex flex-col sm:grid grid-cols-3 gap-16 mt-6 ">
          <div className="space-y-4 col-span-2 w-full">
            <h2 className="text-4xl text-gray-900">Campaigns</h2>
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
                placeholder="Search by campaign name"
                onChange={handleSearch}
                className="ml-4 border-none focus:outline-none focus:ring-0 bg-transparent appearance-none block px-6 py-3  placeholder-gray-500 text-gray-900  sm:text-sm w-full"
              />
            </div>

            <div className="w-full flex flex-col gap-2">
              {campaigns && (
                <>
                  {campaigns.map((campaign, index) => (
                    <Link href={`/campaigns/${campaign.id}`} key={index}>
                      <div className="p-6 bg-white rounded-2xl flex justify-between items-center cursor-pointer border hover:border-indigo-500">
                        <div>
                          <p className="font-bold capitalize">
                            {campaign.name}
                          </p>
                          <p className="capitalize text-gray-800">
                            {campaign?.articles?.length ?? 0} articles
                          </p>
                          {campaign.hasEnoughImages || (
                            <p className="capitalize text-amber-600 italic">
                              {isManager
                                ? "Missing images"
                                : "Please upload images"}
                            </p>
                          )}
                          {isManager && (
                            <p className="text-gray-500">
                              {campaign.profile?.data?.attributes?.name}
                            </p>
                          )}
                        </div>

                        <div className="text-right flex-col flex items-end gap-2">
                          <div className="flex-none">
                            {StatusHandler.renderStatus(
                              campaign.status,
                              isManager
                            )}
                          </div>

                          <p className="italic text-gray-600">
                            Last update:{" "}
                            {moment(campaign.updatedAt).format(
                              "MMM Do hh:mm a"
                            )}
                          </p>

                          {/* <Link href={`/campaigns/${campaign.id}`}><button className="relative whitespace-nowrap inline-flex items-center justify-center px-8 py-3 border border-[#D3CCFF] hover:bg-[#2302FD] hover:text-white font-medium text-black rounded-full">View</button></Link> */}
                        </div>
                      </div>
                    </Link>
                  ))}{" "}
                  <nav className="px-4 flex items-center justify-center sm:px-0 mt-8 sm:mt-12 pb-14">
                    <div className="-mt-px w-0 flex-1 flex">
                      <a
                        href="#"
                        onClick={prevPage}
                        className={classNames(
                          "relative inline-flex items-center pl-3 rounded-full py-2 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50",
                          paginationData.page > 0 ? "opacity-100" : "opacity-30"
                        )}
                        disabled={paginationData.page < 0}
                      >
                        <ArrowNarrowLeftIcon
                          className="mr-3 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </a>
                    </div>{" "}
                    <p className="text-sm text-center text-gray-700">
                      <span className="font-medium">
                        {paginationData.pageSize * (paginationData.page) +
                          1}{" "}
                        to{" "}
                        {paginationData.pageSize * (paginationData.page) +
                          campaigns.length}{" "}
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
              )}
            </div>

            {!isManager && (
              <Link href="/campaigns/new">
                <a className="w-full relative whitespace-nowrap inline-flex items-center justify-center px-8 py-3 border border-[#D3CCFF] hover:bg-[#2302FD] hover:text-white font-medium text-black rounded-full">
                  <span className="">+ Create Campaign</span>
                </a>
              </Link>
            )}
          </div>
          {messages.length > 0 && <MessageList messages={messages} />}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { resolvedUrl } = context
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: `/login?return_url=${resolvedUrl}`,
      },
    };
  }

  // var campaigns = [];

  // campaigns = await API.campaigns
  //   .find(session)
  //   .then(function (result) {
  //     return result.data?.data;
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     return [];
  //   });

  return {
    props: {
      // campaigns,
      role: session.role,
    },
  };
};

export default Dashboard;
