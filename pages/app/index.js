import { useSession, getSession, signIn, signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import { ArrowRightIcon, ClockIcon } from "@heroicons/react/outline";
import moment from "moment";
import API from "@/lib/api";
import Hero from "@/components/home/hero";
import Comparison from "@/components/home/comparison";
import Guarantees from "@/components/home/guarantees";
import Benefits from "@/components/home/benefits";
import HowItWorks from "@/components/howItWorks";
import WaverlyGuarantee from "@/components/home/waverly-guarantee";
import FAQs from "@/components/faqs";
import CTA from "@/components/cta-banner";
import Footer from "@/components/footer";
import Reviews from "@/components/home/reviews";
import SiteDetails from "@/components/dashboard/site-details";
import DateHandler from "@/lib/date-handler";
import ActionItems from "@/components/dashboard/action-items";
import PurchasedPublicationModel from "@/lib/models/purchased-publication-model";
import OrderModel from "@/lib/models/order-model";
import AbandonedOrders from "@/components/dashboard/abandoned-orders";

const IndexPage = ({ site, role }) => {
  const { data: session } = useSession();
  const [purchasedPublications, setPurchasedPublications] = useState([]);
  const [loadingPublications, setLoadingPublications] = useState(true);
  const [abandonedOrders, setAbandonedOrders] = useState([]);
  const [reviewingOrders, setReviewingOrders] = useState([]);
  const [publishingOrders, setPublishingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);

  const isManager = role === "Manager";
  useEffect(() => {
    if (session && (isManager || (site && site.id))) {
      fetchPurchasedPublications();
      if (isManager) {
        fetchAbandonedCarts();
      }
    }
  }, [session]);

  // useEffect(() => {
  //   if (purchasedPublications) {
  //     const reviewing = purchasedPublications.filter(
  //       (pub) => pub.status === "reviewing"
  //     );
  //     const publishing = purchasedPublications.filter(
  //       (pub) => pub.status === "publishing"
  //     );
  //     const completed = purchasedPublications.filter(
  //       (pub) => pub.status === "completed"
  //     );
  //     setReviewingOrders(reviewing);
  //     setPublishingOrders(publishing);
  //     setCompletedOrders(completed);
  //   }
  // }, [purchasedPublications]);

  const fetchPurchasedPublications = async () => {
    setLoadingPublications(true);

    const response = await API.purchasedPublications
      .find({
        pageNumber: 1,
        session,
        site_id: site?.id,
      })
      .then(function (result) {
        let purchasedPublicationModels = result.data.data.map(
          (purchasedPublication) => {
            return new PurchasedPublicationModel(purchasedPublication);
          }
        );

        setPurchasedPublications(purchasedPublicationModels);

        setLoadingPublications(false);
      });
  };

  const fetchSiteOrders = async () => {
    setLoadingPublications(true);

    const response = await API.orders
      .getSiteOrders({
        pageNumber: 1,
        session,
        site_id: site?.id,
      })
      .then(function (result) {
        let orderModels = result.data.data.map((orderModel) => {
          return new OrderModel(orderModel);
        });
        setOrders(orderModels);
      });
  };

  const fetchAbandonedCarts = async () => {
    setLoadingPublications(true);

    const response = await API.orders
      .getAbandonedOrders({
        pageNumber: 1,
        session,
      })
      .then(function (result) {
        let orderModels = result.data.data.map((orderModel) => {
          return new OrderModel(orderModel);
        });
        setAbandonedOrders(orderModels);
      });
  };

  return (
    <div className="bg-[#F8F7FC]">
      <Navbar name="Press Backend" isManager={true} />
      <section className="bg-[#F8F7FC]">
        <div className="min-h-full py-12 px-4 sm:px-6 lg:px-8 h-full max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center">
            <div className="w-full">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
                Dashboard
              </h1>
              <p id="welcome" className="text-lg text-gray-600 mt-4">
                Welcome {session?.profile?.name}!
              </p>
              {/* {session ? (
                <div></div>
              ) : (
                <div className="flex gap-2 justify-center py-4">
                  <Link href="/register">
                    <button className="button large">Sign up</button>
                  </Link>
                  <Link href="/login">
                    <button className="button-secondary large">Login</button>
                  </Link>
                </div>
              )} */}
              <div className="py-4 grid grid-cols-4 gap-6">
                {session?.profile?.is_whitelabel && (
                  <SiteDetails siteData={site} />
                )}
                <div className="col-span-3 space-y-4">
                  <div className="bg-white rounded-xl">
                    <div className="flex flex-col gap-4  p-8">
                      <h2 className="text-2xl font-bold text-gray-800">
                        {/* {isManager ? "Action Items" : "My Orders"}
                         */}
                        Orders
                      </h2>
                    </div>
                    <hr />
                    <div className="p-8 space-y-4">
                      {purchasedPublications.length > 0 ? (
                        <ActionItems items={purchasedPublications} />
                      ) : (
                        <div className="flex flex-col justify-center items-center gap-4">
                          <div className="rounded-full bg-gray-50 p-2">
                            <div className="rounded-full bg-indigo-100 p-2">
                              <ClockIcon
                                className="h-6 w-6 text-indigo-500"
                                aria-hidden="true"
                              />
                            </div>
                          </div>
                          <p className="font-bold text-gray-500">
                            Waiting for orders
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  {abandonedOrders.length > 0 && (
                    <div className="bg-white rounded-xl ">
                      <div className="flex flex-col gap-4  p-8">
                        <h2 className="text-2xl font-bold text-gray-800">
                          Abandoned Orders
                        </h2>
                      </div>
                      <hr />
                      <div className="p-8 space-y-4">
                        <AbandonedOrders orders={abandonedOrders} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export const getServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
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

  return {
    props: {
      site,
      session,
      role: session.role,
    },
  };
};

export default IndexPage;
