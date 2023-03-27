/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  BellIcon,
  UserIcon,
  XIcon,
  MenuIcon,
  LockClosedIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import classNames from "classnames";
import { useState } from "react";

export default function SiteNavBar({
  isTransparent,
  logo,
  name,
  isCheckout,
  handlePublicationInquiryOpen,
  isInternalSite,
}) {
  const { data: session } = useSession();

  useEffect(() => {
    //TEMPORARY FIX TO MAKE SURE EXISTING USERS WILL HAVE PROFILE IN THEIR SESSIONS
    //TEMPORARY FIX TO MAKE SURE EXISTING USERS WILL HAVE PROFILE IN THEIR SESSIONS
    //TEMPORARY FIX TO MAKE SURE EXISTING USERS WILL HAVE PROFILE IN THEIR SESSIONS
    //TEMPORARY FIX TO MAKE SURE EXISTING USERS WILL HAVE PROFILE IN THEIR SESSIONS
    //TEMPORARY FIX TO MAKE SURE EXISTING USERS WILL HAVE PROFILE IN THEIR SESSIONS
    //TEMPORARY FIX TO MAKE SURE EXISTING USERS WILL HAVE PROFILE IN THEIR SESSIONS

    if (session && !session.profile) {
      //TEMPORARY FIX TO MAKE SURE EXISTING USERS WILL HAVE PROFILE IN THEIR SESSIONS
      signOut();
    }
  }, [session]);

  return (
    <>
      <Disclosure
        as="nav"
        className={classNames(
          isTransparent
            ? "bg-transparent fixed z-10 top-0 right-0 left-0"
            : "border-b border-indigo-100 fixed z-10 w-full bg-white h-[80px]"
        )}
      >
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-5">
              <div className="flex justify-between">
                <div className="flex items-center h-[80px]">
                  <div className="flex flex-shrink-0 items-center">
                    <Link href="/">
                      <a className="text-gray-600">
                        {logo?.data?.attributes?.url ? (
                          <img
                            className="block h-10 sm:h-14 w-auto max-w-[188px]"
                            src={logo?.data?.attributes?.url}
                            alt="Workflow"
                          />
                        ) : (
                          <h1 className="text-xl p-0 m-0">{name}</h1>
                        )}
                      </a>
                    </Link>
                  </div>
                  {!isCheckout && (
                    <div className="hidden sm:flex items-center">
                      {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}

                      <Link href="/publications">
                        <a className="button-secondary !py-4 !px-6 !border-0 hover:!bg-slate-200 hover:text-indigo-600 h-[56px]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5 mr-2 text-indigo-400"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                            />
                          </svg>
                          <span>Publications</span>
                        </a>
                      </Link>

                      {session && (
                        <>
                          <Link href="/dashboard">
                            <a className="button-secondary !py-4 !px-6 !border-0 hover:!bg-slate-200 hover:text-indigo-600 h-[56px]">
                              Campaigns
                            </a>
                          </Link>

                          <Link href="/orders">
                            <a className="button-secondary !py-4 !px-6 !border-0 hover:!bg-slate-200 hover:text-indigo-600 h-[56px]">
                              Orders
                            </a>
                          </Link>
                        </>
                      )}
                    </div>
                  )}
                </div>
                {isCheckout ? (
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-gray-600 font-bold text-sm">
                      <LockClosedIcon className="inline h-4" /> Secure Checkout
                    </p>

                    <p className="text-gray-600">
                      Powered by{"  "}
                      <img src="stripe.svg" className="w-10 mb-[2px] inline" />
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center px-3 rounded-full space-x-3">
                      {/* Profile dropdown */}
                      {session ? (
                        <>
                          {/* <Link href="/login">
                      <a className="button-secondary  !py-4 !px-6">
                        Talk to Sales
                      </a>
                    </Link> */}
                          <a
                            className="button-secondary  !py-4 !px-6 h-[56px]"
                            onClick={() => handlePublicationInquiryOpen()}
                          >
                            Talk to Sales
                          </a>
                          <Menu as="div" className="relative ml-3">
                            <div>
                              <Menu.Button className="flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 p-2 items-center">
                                <span className="sr-only">Open user menu</span>
                                <UserIcon
                                  className="h-6 w-6 text-gray-600"
                                  aria-hidden="true"
                                />
                                {/* <ChevronDownIcon className="h-5 w-5 text-gray-600" aria-hidden="true" /> */}
                              </Menu.Button>
                            </div>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-200"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <p
                                  href="#"
                                  className={classNames(
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  <span className=" font-bold">
                                    {session?.profile?.name}
                                  </span>
                                </p>

                                <hr />

                                <Menu.Item>
                                  {({ active }) => (
                                    <a
                                      href="/account"
                                      className={classNames(
                                        active ? "bg-gray-100" : "",
                                        "block px-4 py-2 text-sm text-gray-700"
                                      )}
                                    >
                                      Account Details
                                    </a>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <a
                                      href="/account/billing"
                                      className={classNames(
                                        active ? "bg-gray-100" : "",
                                        "block px-4 py-2 text-sm text-gray-700"
                                      )}
                                    >
                                      Billing
                                    </a>
                                  )}
                                </Menu.Item>

                                <Menu.Item>
                                  {({ active }) => (
                                    <a
                                      href="#"
                                      className={classNames(
                                        active ? "bg-gray-100" : "",
                                        "block px-4 py-2 text-sm text-gray-700"
                                      )}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        signOut();
                                      }}
                                    >
                                      Sign Out
                                    </a>
                                  )}
                                </Menu.Item>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </>
                      ) : (
                        <>
                          <Link href="/login">
                            <a className="button-secondary !py-4 !px-6 !border-0 !text-[#736F87] hover:!bg-slate-200 h-[56px]">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="#7B86FE"
                                className="w-5 h-5 mr-2 text-indigo-400"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                                />
                              </svg>

                              <span>Login</span>
                            </a>
                          </Link>
                          {isInternalSite || (
                            <a
                              className="button-secondary  !py-4 !px-6 h-[56px]"
                              onClick={() => handlePublicationInquiryOpen()}
                            >
                              Talk to Sales
                            </a>
                          )}

                          <Link href={isInternalSite ? "/start" : "/register"}>
                            <a className="button !py-4 !px-6 h-[56px]">
                              <span>Get Started</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-5 h-5 ml-2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                                />
                              </svg>
                            </a>
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="-mr-2 gap-4 flex items-center sm:hidden">
                      {/* Mobile menu button */}
                      <Link href={isInternalSite ? "/start" : "/register"}>
                        <a className="button !py-4 !px-6 h-[56px]">
                          <span>Get Started</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5 ml-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                            />
                          </svg>
                        </a>
                      </Link>
                      <Disclosure.Button className="inline-flex items-center justify-center rounded-full border border-gray-200 p-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none">
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XIcon className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                          <MenuIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Disclosure.Button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <Disclosure.Panel
              className={classNames(
                "sm:hidden bg-white",
                isTransparent && "bg-indigo-500"
              )}
            >
              <div className="space-y-1 pt-2 pb-3">
                {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
                <Disclosure.Button
                  as="a"
                  href="/publications"
                  className="block text-gray-600 py-2 px-4 text-base font-medium"
                >
                  Publications
                </Disclosure.Button>
                {session && (
                  <>
                    <Disclosure.Button
                      as="a"
                      href="/dashboard"
                      className="block py-2 px-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                    >
                      Campaigns
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="a"
                      href="/orders"
                      className="block  py-2 px-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                    >
                      Orders
                    </Disclosure.Button>
                    {/* <Disclosure.Button
                      as="a"
                      href="javascript:void(0);"
                      className="block  py-2 px-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                      onClick={() => handlePublicationInquiryOpen()}
                    >
                      Talk to Sales
                    </Disclosure.Button> */}
                  </>
                )}
              </div>
              {session ? (
                <div className="border-t border-gray-200 pt-4 pb-3">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0"></div>
                    <div className="">
                      <div className="text-base font-medium text-gray-400">
                        {session.profile?.name}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <Disclosure.Button
                      as="a"
                      href="/account"
                      className="block px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                    >
                      Account Details
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="a"
                      href="/account/billing"
                      className="block px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                    >
                      Billing
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="a"
                      href="/account/referrals"
                      className="block px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                    >
                      Referrals
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="a"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        signOut();
                      }}
                      className="block px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                    >
                      Sign out
                    </Disclosure.Button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4 pb-3">
                  <Disclosure.Button
                    as="a"
                    href="/login"
                    className="block px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Login
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="a"
                    href="/register"
                    className="block px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Sign up
                  </Disclosure.Button>
                </div>
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}
