import { useState, useEffect } from "react";
import API from "@/lib/api";
import SiteWrapper from "@/components/siteWrapper";
import AlertMessage from "@/components/alertMessage";
import { ArrowNarrowLeftIcon } from "@heroicons/react/outline";

import Link from "next/link";
import DateHandler from "@/lib/date-handler";

import { getSession, useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { MoonLoader } from "react-spinners";
import * as fbq from "@/lib/tracking/facebook-pixel";
import * as klaviyo from "@/lib/tracking/klaviyo";
import * as priceFormatter from "@/lib/price-formatter";
import OrderModel from "@/lib/models/order-model";
import CartManager from "@/lib/cart-manager";
import LoadingOverlay from "@/components/loadingOverlay";

function OrderConfirmation({ siteData }) {
  const { data: session } = useSession();
  const router = useRouter();

  const [redirectedFromCheckout, setRedirectedFromCheckout] = useState(false);

  const [order, setOrder] = useState({});

  const [checkoutData, setCheckoutData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    //clear list from local storage
    localStorage.removeItem("list");
  }, []);

  useEffect(() => {
    const order_id = router.query.order_id;
    // if (!order_id) {
    //   // redirect to dashboard if no order id
    //   router.push("/dashboard");
    // }
    if (!order.items) {
      fetchOrder();
    }
  }, [router]);

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
      coupon = await API.coupons.get(order.coupon).then(function (result) {
        return result.data;
      });
    }

    const { total, subtotal, discount, processingFee, credits } =
      CartManager.calcTotal({
        items: order.items,
        coupon,
        creditTotal: order.creditsApplied,
      });

    setCheckoutData({
      total,
      subtotal,
      processingFee,
      discount,
      credits,
    });
    setOrder(order);

    // check if we were redirected from checkout and handle tracking

    const redirect_status = router.query.redirect_status;

    if (redirect_status === "succeeded") {
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
    }
  };

  const handleTracking = ({
    total,
    email,
    items,
    order_id,
    discountCode,
    discount,
  }) => {
    if (siteData?.attributes?.facebook_pixel_id) {
      fbq.event("Purchase", { currency: "USD", value: order.total });
    }

    if (siteData?.attributes?.klaviyo_public_key) {
      klaviyo.trackPurchase({
        total: total,
        items,
        email,
        order_id,
        discountCode,
        discountValue: discount ? discount / 100 : 0,
      });
    }

    setRedirectedFromCheckout(true);

    // clear query params from url except for order_id so we dont track again on refresh
    router.replace(
      {
        pathname: "/confirmation",
        query: { order_id: order_id },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <SiteWrapper siteData={siteData}>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        {isLoading && (
          <LoadingOverlay title={"Fetching Your Order Details..."} />
        )}

        <div className="max-w-2xl w-full space-y-8">
          <div className="">
            {redirectedFromCheckout && (
              <AlertMessage
                status="default"
                title="Your purchase was successful!"
              ></AlertMessage>
            )}

            <h2 className="mt-6 text-4xl text-gray-900">
              Thanks for Your Order
            </h2>
            <p className="mt-4">
              {"We’ve"} sent you confirmation to <b>{order.email}</b>. You can
              also find your order details below. Now, {"you’re"} all set to use
              your publication credits in a new or existing campaign (if you
              have one). In case you have any questions or need help on creating
              or managing your campaigns, please{" "}
              <a
                className="underline font-bold"
                href={`mailto:${siteData.attributes.email}`}
              >
                contact us
              </a>
              .
            </p>
          </div>
          <div className="p-6 bg-white rounded-3xl">
            <div className="flex justify-between items-center">
              <p className="text-xl font-bold mt-2">Order #{order.id}</p>
              <p className="text-xl font-bold mt-2">
                {priceFormatter.formatDefaultPrice(order.total)}
              </p>
            </div>
            <p className="text-xl text-gray-700 mt-2">
              {DateHandler.formatDate(order.createdAt)}
            </p>
            <div className="mt-3 pt-3 space-y-2">
              {order.items &&
                order.items.map((item, key) => {
                  return (
                    <div key={`order-${key}`} className="flex justify-between">
                      <p className="">{item?.name}</p>
                      <p className="">
                        <b>
                          {priceFormatter.formatDefaultPrice(item?.price / 100)}
                        </b>{" "}
                        x {item?.quantity}
                      </p>
                    </div>
                  );
                })}
            </div>
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
              {checkoutData.credits ? (
                <div className="flex justify-between text-base font-medium text-primary">
                  <p className="font-bold">Credits</p>
                  <p className="font-bold">
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
                  {priceFormatter.formatDefaultPrice(checkoutData.total / 100)}
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-white rounded-3xl">
            <img src="/PubCredits.png" className="w-24 mx-auto" />
            <h2 className="mt-6 text-4xl text-gray-900 text-center">
              Next Step: Use Your Publication Credits
            </h2>
            <p className="mt-4 text-center">
              Go ahead and create a new campaign. If you already have existing
              ones, you can also go to your dashboard, open a campaign, and add
              the new articles there.
            </p>
            <div className="flex gap-2 items-center py-3 mt-6">
              <Link href="/dashboard">
                <button className="button-secondary large w-full uppercase">
                  Go to dashboard
                </button>
              </Link>
              <Link href="/campaigns/new">
                <button className="button large w-full uppercase">
                  Create new campaign
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SiteWrapper>
  );
}

export const getServerSideProps = async (context) => {
  const { params } = context;
  const { site } = params;
  const session = await getSession(context);

  let siteData;
  if (!session) {
    return {
      redirect: {
        destination: `/login?return_url=/confirmation`,
        permanent: false,
      },
    };
  }
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

export default OrderConfirmation;
