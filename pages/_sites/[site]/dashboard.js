import Link from "next/link";

import { getSession, useSession, signIn, signOut } from "next-auth/react";
import API from "@/lib/api";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";

import moment from "moment";
import MessageList from "@/components/messageList";
import {
  SearchIcon,
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
} from "@heroicons/react/solid";
import SiteWrapper from "@/components/siteWrapper";
import CampaignModel from "@/lib/models/campaign-model";
import classNames from "classnames";
function Example({ role, siteData }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const isManager = role === "Manager";
  const [campaigns, setCampaigns] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const pageNumberRef = useRef(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session) {
      pageNumberRef.current = 1;
      setCampaigns([]);
      fetchCampaigns();
    }
  }, [searchQuery, session]);

  const fetchCampaigns = async () => {
    setIsLoading(true);

    const response = await API.campaigns
      .find({ pageNumber: pageNumberRef.current, searchQuery })
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
    <SiteWrapper siteData={siteData}>
      <div className="min-h-full py-12 px-4 sm:px-6 lg:px-8 h-full max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center border-b pb-14 border-indigo-100">
          <h2 className="text-5xl text-gray-900">My Campaigns</h2>

          <Link href="/campaigns/new">
            <a className="button large">
              <span className="">+ Create New Campaign</span>
            </a>
          </Link>
        </div>

        <div className="flex flex-col sm:grid grid-cols-3 gap-16 pt-12">
          <div className="space-y-4 col-span-2 w-full">
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
                  {" "}
                  {campaigns.map((campaign, index) => (
                    <Link href={`/campaigns/${campaign.id}`} key={index}>
                      <div className="p-6 bg-white rounded-2xl flex justify-between items-center cursor-pointer border hover:border-indigo-500">
                        <div>
                          <p className="font-bold capitalize">
                            {campaign.name}
                          </p>
                          <p className="capitalize text-gray-800">
                            {campaign.articles.length} articles
                          </p>
                          {/* {campaign.hasEnoughImages || (
                            <p className="capitalize text-amber-600 italic">
                              {isManager
                                ? "Missing images"
                                : "Please upload images"}
                            </p>
                          )} */}
                          {isManager && (
                            <p className="text-gray-500">
                              {campaign.profile?.name}
                            </p>
                          )}
                        </div>

                        <div className="text-right flex-col flex items-end gap-2">
                          {/* <div className="flex-none">
                        {StatusHandler.renderStatus(
                          campaign.attributes.status,
                          isManager
                        )}
                      </div> */}

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
          </div>
          {messages.length > 0 && <MessageList messages={messages} />}
        </div>
      </div>
    </SiteWrapper>
  );
}

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  const { params } = context;
  const { site } = params;
  // console.log("site params", site)
  let siteData;
  if (site.includes(".")) {
    siteData = await API.sites.get({ customDomain: site });
  } else {
    siteData = await API.sites.get({ subdomain: site });
  }
  // console.log("siteData", siteData);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login?return_url=/dashboard",
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
      siteData,
      // campaigns,
      role: session.role,
    },
  };
};

export default Example;
