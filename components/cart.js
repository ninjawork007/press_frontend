/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import API from "../lib/api";
import { useRouter } from "next/router";
import CartManager from "@/lib/cart-manager";
import * as priceFormatter from "@/lib/price-formatter";

export default function Cart({
  open,
  setOpen,
  list,
  handleRemoveItem,
  site_url, // this is passed in manager for creating a custom order link
  site_id,
  profile_id, // this is passed in manager is creating custom order
  isManager,
}) {
  const { data: session } = useSession();
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [couponError, setCouponError] = useState("");

  const [processingFee, setProcessingFee] = useState(0);
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const { total, subtotal, discount, processingFee } = CartManager.calcTotal({
      items: list,
      coupon,
      convertToDollars: true,
    });

    setDiscount(discount);
    setProcessingFee(processingFee);
    setTotal(total);
    setSubtotal(subtotal);
  }, [coupon, list]);

  const applyDiscount = (e) => {
    e.preventDefault();
    let code = e.target.discount.value;
    code = code.toUpperCase();

    return API.coupons
      .get(code)
      .then(function (result) {
        setCoupon(result.data);
        setCouponError("");
      })
      .catch((err) => {
        console.log(err);

        setCoupon(null);
        setCouponError("Coupon not found");
      });
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    setIsCheckingOut(true);
    return API.orders
      .create(
        {
          data: {
            status: "created",
            items: list,
            coupon,
            total,
            processing_fee: processingFee,
            site: site_id,
            profile_id,
          },
        },
        session
      )
      .then(function (result) {
        if (result.data.order) {
          if (isManager) {
            alert(`Order was added to Client`);
            setIsCheckingOut(false);
            setOpen(false);
          } else {
            router.push({
              pathname: `/confirmation`,
              query: {
                redirect_status: "succeeded",
                order_id: result.data.order.id,
              },
            });
          }
        } else {
          // const clientSecret = result.data?.client_secret;
          // const stringifiedData = JSON.stringify({
          //   clientSecret,
          //   items: list,
          //   coupon,
          // });
          // if (clientSecret) {
          if (profile_id) {
            //create checkout link and show as alert message
            const checkoutLink = `https://${site_url}/checkout?order_id=${result.data.id}`;
            alert(`Checkout link: ${checkoutLink}`);
            setIsCheckingOut(false);
            setOpen(false);
          } else {
            router.push({
              pathname: "/checkout",
              query: { order_id: result.data.id },
            });
          }

          // }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addCreditsAndCheckout = async (e) => {
    e.preventDefault();
    setIsCheckingOut(true);
    await API.credits.create({
      data: {
        amount: total, // Refund 3% Stripe fee
        profile: profile_id,
        type: "credit",
      },
    });

    handleCheckout(e);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-[#F8F7FC] shadow-xl">
                    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-xl font-medium text-gray-900">
                          {" "}
                          Campaign cart
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flow-root">
                          <ul role="list" className=" space-y-2">
                            {list.map((item) => (
                              <li
                                key={item.id}
                                className="flex p-6 bg-white rounded-xl"
                              >
                                {/* <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img
                                    src={item.logo?.attributes?.url}
                                    alt={item.name}
                                    className="h-full w-full object-contain object-center"
                                  />
                                </div> */}

                                <div className="flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <p className="font-bold">
                                        <a href={item.websiteUrl}>
                                          {" "}
                                          {item.name}{" "}
                                        </a>
                                      </p>
                                      <p className="ml-4">
                                        {/* {item.getFormattedPrice()} */}
                                      </p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                      {item.websiteUrl}
                                    </p>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <p className="text-gray-500">
                                      Qty {item.quantity}
                                    </p>

                                    <div className="flex">
                                      <button
                                        type="button"
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                        onClick={() => handleRemoveItem(item)}
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                      {list.length > 0 ? (
                        <>
                          {coupon && (
                            <>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <p className="font-bold">Subtotal</p>
                                <p>
                                  {priceFormatter.formatDefaultPrice(subtotal)}
                                </p>
                              </div>
                              <div className="flex justify-between text-base font-medium text-red-500">
                                <p className="font-bold">Discount</p>
                                <p>
                                  -{priceFormatter.formatDefaultPrice(discount)}
                                </p>
                              </div>
                            </>
                          )}

                          {processingFee > 0 && (
                            <>
                              <div className="flex justify-between text-base">
                                <p className="">Processing Fee (3%)</p>
                                <p>
                                  {priceFormatter.formatDefaultPrice(
                                    processingFee
                                  )}
                                </p>
                              </div>
                            </>
                          )}

                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <p className="font-bold">Total</p>
                            <p>{priceFormatter.formatDefaultPrice(total)}</p>
                          </div>
                          <p className="mt-0.5 text-sm text-gray-500">
                            Fees and taxes calculated at checkout.
                          </p>
                          <div className="mt-6">
                            <form onSubmit={applyDiscount}>
                              <label
                                htmlFor="discount-code"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Discount code
                              </label>
                              <div className="flex space-x-4 mt-1">
                                <input
                                  type="text"
                                  id="discount"
                                  name="discount"
                                  className="uppercase appearance-none rounded-none relative block w-full px-3 py-2 border border-[#D9D4FF] placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                />
                                <button
                                  type="submit"
                                  className="bg-gray-200 text-sm font-medium text-gray-600 rounded-md px-4 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                                >
                                  Apply
                                </button>
                              </div>
                            </form>
                            <p className="text-red-500">{couponError}</p>
                          </div>
                          <div className="mt-6">
                            {isCheckingOut ? (
                              <button className="button w-full !cursor-not-allowed">
                                <span className="">
                                  <svg
                                    aria-hidden="true"
                                    className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-white"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                      fill="currentFill"
                                    />
                                  </svg>
                                  <span className="sr-only">Loading...</span>
                                </span>
                              </button>
                            ) : (
                              <form onSubmit={handleCheckout}>
                                <input
                                  type="submit"
                                  id="checkout-button"
                                  value={
                                    isManager ? "Get Checkout Link" : "Checkout"
                                  }
                                  className="cursor-pointer w-full inline-flex items-center px-8 py-5 border border-transparent text-sm font-bold rounded-full shadow-sm text-white bg-[#2302FD] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 justify-center"
                                />
                              </form>
                            )}
                          </div>
                          {isManager ? (
                            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                              <p>
                                or{" "}
                                <button
                                  type="button"
                                  className="font-medium text-indigo-600 hover:text-indigo-500"
                                  onClick={addCreditsAndCheckout}
                                >
                                  Credit Client ${total} and Apply To Order
                                  <span aria-hidden="true"> &rarr;</span>
                                </button>
                              </p>
                            </div>
                          ) : (
                            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                              <p>
                                or{" "}
                                <button
                                  type="button"
                                  className="font-medium text-indigo-600 hover:text-indigo-500"
                                  onClick={() => setOpen(false)}
                                >
                                  Continue Shopping
                                  <span aria-hidden="true"> &rarr;</span>
                                </button>
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="space-y-4">
                          <div className="space-y-2 text-center">
                            <h1 className="text-xl">
                              No Publications Added Yet
                            </h1>
                            <p className="text-gray-600">
                              Looks like you {"haven't"} added any publications
                              to your campaign yet. To get started, browse
                              publications and select ones to apply to.
                            </p>
                          </div>
                          <Link href="/publications">
                            <button className="cursor-pointer w-full inline-flex items-center px-8 py-5 border border-transparent text-sm font-bold rounded-full shadow-sm text-white bg-[#2302FD] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 justify-center">
                              View Publications
                            </button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
