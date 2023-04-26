import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Navbar from "@/components/navbar";
import CheckoutForm from "@/components/checkout/checkoutForm";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import API from "@/lib/api";
import SiteWrapper from "@/components/siteWrapper";
import CartManager from "@/lib/cart-manager";
import { ArrowNarrowLeftIcon } from "@heroicons/react/outline";
import * as priceFormatter from "@/lib/price-formatter";
import * as klaviyo from "@/lib/tracking/klaviyo";
import LoadingOverlay from "@/components/loadingOverlay";

import OrderModel from "@/lib/models/order-model";
// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);
function CheckoutPage({ siteData }) {
  const router = useRouter();
  const [clientSecret, setClientSecret] = React.useState();
  const [checkoutData, setCheckoutData] = React.useState({});
  const [coupon, setCoupon] = React.useState(null);
  const [trackedEvent, setTrackedEvent] = React.useState(false);
  const [order, setOrder] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  const { data: session } = useSession();

  useEffect(() => {
    const order_id = router.query.order_id;
    if (!order_id) {
      // redirect to dashboard if no order id
      router.push("/dashboard");
    }

    if (!order.items && session) {
      fetchOrder();
    }
  }, [router, session]);

  useEffect(() => {
    if (order && order.items) {
      setIsLoading(false);
    }
  }, [order]);

  const fetchOrder = async () => {
    setIsLoading(true);
    const order_id = router.query.order_id;
    let coupon;
    //fetch one order and if coupon exists, fetch coupon
    let order = await API.orders
      .getOne(order_id)
      .then((res) => {
        const data = res.data;
        return new OrderModel(data.data);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        alert("Error fetching order. Please try refreshing your page.");
      });

    if (order.coupon) {
      coupon = await API.coupons
        .get(order.coupon)
        .then(function (result) {
          return result.data;
        })
        .catch(function (err) {
          console.log(err);
          //TODO: coupon not found and need to let customer know
        });
    }

    const result = await API.credits.calcTotal({ session });
    const creditTotal = result.data;

    const { total, subtotal, discount, processingFee, credits } =
      CartManager.calcTotal({
        items: order.items,
        coupon,
        creditTotal: creditTotal,
      });

    setCheckoutData({
      total,
      subtotal,
      credits,
      processingFee,
      discount,
    });

    setOrder(order);
    setClientSecret(order.clientSecret);

    handleTracking({
      total,
      subtotal,
      discount,
      processingFee,
      items: order.items,
      email: order.email,
      order_id: order.id,
      discountCode: order.coupon,
    });
  };

  const handleTracking = ({
    total,
    discount,
    items,
    email,
    order_id,
    discountCode,
  }) => {
    if (siteData?.attributes?.klaviyo_public_key && !trackedEvent) {
      klaviyo.trackStartedCheckout({
        total: total / 100,
        items,
        email,
        order_id,
        discountCode,
        discountValue: discount ? discount / 100 : 0,
        checkout_url: `${window.location.origin}/checkout?order_id=${order_id}`,
      });
      setTrackedEvent(true);
    }
  };

  const appearance = {
    theme: "flat",
    variables: {
      colorPrimary: siteData.attributes.primary_color
        ? siteData.attributes.primary_color
        : "#2302FD",
    },
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <SiteWrapper siteData={siteData} isCheckout={true}>
      <section className="bg-[#F8F7FC] relative">
        {isLoading && <LoadingOverlay title={"Loading Checkout"} />}
        <div className="h-screen">
          <div className="flex flex-col sm:grid grid-cols-2 h-full">
            <div className="max-w-lg w-full px-4 mr-20 ml-auto flex flex-col justify-between py-10">
              <div>
                <div className="flex items-start">
                  <span
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => router.back()}
                  >
                    <ArrowNarrowLeftIcon className="w-5 text-gray-500" />
                    <p>Go Back</p>
                  </span>
                </div>

                <div className="mt-10">
                  <p className="text-lg text-gray-500">Pay {siteData?.name}</p>
                  <p className="text-4xl font-medium mt-2">
                    {priceFormatter.formatDefaultPrice(
                      checkoutData.total / 100
                    )}
                  </p>
                </div>

                <div className="mt-10 space-y-2">
                  {order.items &&
                    order.items.map((item, key) => {
                      return (
                        <div
                          key={`order-${key}`}
                          className="flex justify-between"
                        >
                          <p className="">{item?.name}</p>
                          <p>
                            <b>
                              {priceFormatter.formatDefaultPrice(
                                item?.price / 100
                              )}
                            </b>{" "}
                            x {item?.quantity}
                          </p>
                        </div>
                      );
                    })}
                  <div className="mt-3 pt-3 space-y-2 border-t">
                    <div className="flex justify-between">
                      <p className="">Subtotal</p>
                      <p className="font-bold">
                        {priceFormatter.formatDefaultPrice(
                          checkoutData.subtotal / 100
                        )}
                      </p>
                    </div>
                    {checkoutData.discount ? (
                      <div className="flex justify-between text-base font-medium text-red-500">
                        <p className="font-bold">Discount</p>
                        <p>
                          -
                          {priceFormatter.formatDefaultPrice(
                            checkoutData.discount / 100
                          )}
                        </p>
                      </div>
                    ) : (
                      <></>
                    )}
                    {checkoutData.credits && checkoutData.credits > 0 ? (
                      <div className="flex justify-between text-base font-medium text-primary">
                        <p className="font-bold">Credits</p>
                        <p>
                          -
                          {priceFormatter.formatDefaultPrice(
                            checkoutData.credits / 100
                          )}
                        </p>
                      </div>
                    ) : (
                      <></>
                    )}
                    <div className="flex justify-between">
                      <p className="">Processing Fee (3%)</p>
                      <p className="font-bold">
                        {priceFormatter.formatDefaultPrice(
                          checkoutData.processingFee / 100
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 space-y-2 border-t">
                    <div className="flex justify-between">
                      <p className="font-bold">Total</p>
                      <p className="font-bold">
                        {priceFormatter.formatDefaultPrice(
                          checkoutData.total / 100
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-10">
                  <div className="flex justify-between gap-6 bg-indigo-50 p-6 rounded-3xl items-center">
                    <img src="Shields.png" className="w-[88px] h-[88px]" />
                    <div className="">
                      <p className="text-gray-700 text-sm font-bold">
                        Our 100% Money Back Guarantee
                      </p>
                      <p className="text-gray-700 text-sm">
                        If for any reason, we are unable to publish your
                        article, you will receive your money back, no questions
                        asked.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="py-10">
              <div className="sm:max-w-sm w-full p-8 sm:ml-20 sm:mr-auto bg-white rounded-3xl space-y-6">
                <h1 className="text-4xl">Checkout</h1>
                {clientSecret && (
                  <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm total={checkoutData.total} />
                  </Elements>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteWrapper>
  );
}

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: `/login?return_url=/checkout?order_id=${context.query.order_id}`,
        permanent: false,
      },
    };
  }
  const { params } = context;
  const { site } = params;
  // console.log("site params", site)
  let siteData;
  if (site.includes(".")) {
    siteData = await API.sites.get({ customDomain: site });
  } else {
    siteData = await API.sites.get({ subdomain: site });
  }

  return {
    props: {
      siteData,
    },
  };
};

export default CheckoutPage;
