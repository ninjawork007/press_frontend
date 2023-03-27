/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, UserIcon, XIcon, MenuIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import classNames from "classnames";
import { useState } from "react";

export default function Example({ isTransparent, isManager, logo, name }) {
  const { data: session } = useSession();
  const isWhitelabelOwner = session?.profile?.is_whitelabel;
  const isAffiliate = session?.profile?.is_affiliate;
  const isAdmin = session?.role === "Manager";

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
    <Disclosure
      as="nav"
      className={classNames(
        "border-b border-indigo-50",
        isTransparent
          ? "bg-transparent absolute z-10 top-0 right-0 left-0"
          : "bg-gradient-to-r from-[#3B2CBC] to-[#443BFD]",
        isManager && "!from-[#070033] !to-[#070033]"
      )}
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex h-16 justify-between">
              <div className="flex items-center">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/">
                    <a className="text-white">
                      {isManager ? (
                        <img
                          className="block h-8 w-auto max-w-[188px]"
                          src="/press-backend-logo.svg"
                          alt="Workflow"
                        />
                      ) : (
                        <>
                          {logo?.data?.attributes?.url ? (
                            <img
                              className="block h-8 w-auto max-w-[188px]"
                              src={logo?.data?.attributes?.url}
                              alt="Workflow"
                            />
                          ) : (
                            <h1 className="text-xl p-0 m-0">{name}</h1>
                          )}
                        </>
                      )}
                    </a>
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8 items-center">
                  {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}

                  {!isAdmin && !isAffiliate && (
                    <Link href="/publications">
                      <a className="navbar-link">Publications</a>
                    </Link>
                  )}

                  {session && (
                    <>
                      {isWhitelabelOwner || isAffiliate || (
                        <Link href="/dashboard">
                          <a className="navbar-link">Campaigns</a>
                        </Link>
                      )}

                      <Link href="/orders">
                        <a className="navbar-link">Orders</a>
                      </Link>
                      {(isWhitelabelOwner || isManager) && (
                        <Link href="/customers">
                          <a className="navbar-link">Customers</a>
                        </Link>
                      )}
                      {isWhitelabelOwner && (
                        <Link href="/settings">
                          <a className="navbar-link">Settings</a>
                        </Link>
                      )}
                      {isAffiliate && (
                        <Link href="/settings/company">
                          <a className="navbar-link">Settings</a>
                        </Link>
                      )}
                      {isAdmin && (
                        <Link href="/reports">
                          <a className="navbar-link">Reports</a>
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {/* Profile dropdown */}
                {session ? (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 p-2 items-center">
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
                          className={classNames(
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          <span className=" font-bold">
                            {session?.profile?.name}
                          </span>
                          <br />
                          {isAdmin && "Manager"}
                          {session?.profile?.is_whitelabel && "Whitelabel"}
                          {session?.profile?.is_affiliate && "Affiliate"}
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
                              href="/settings/payout"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Billing
                            </a>
                          )}
                        </Menu.Item>
                        {isAffiliate && (
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="/referrals"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Referrals
                              </a>
                            )}
                          </Menu.Item>
                        )}

                        <Menu.Item>
                          {({ active }) => (
                            <a
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
                ) : (
                  <>
                    <Link href="/login">
                      <a className="button-transparent large">Login</a>
                    </Link>
                    {}
                    <Link href="/register">
                      <a className="button large">Get Started</a>
                    </Link>
                  </>
                )}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel
            className={classNames(
              "sm:hidden",
              isTransparent && "bg-indigo-500"
            )}
          >
            <div className="space-y-1 pt-2 pb-3">
              {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
              <Disclosure.Button
                as="a"
                href="/publications"
                className="block text-white py-2 px-4 text-base font-medium"
              >
                Publications
              </Disclosure.Button>
              {session && (
                <>
                  <Disclosure.Button
                    as="a"
                    href="/dashboard"
                    className="block py-2 px-4 text-base font-medium text-white hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                  >
                    Campaigns
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="a"
                    href="/orders"
                    className="block  py-2 px-4 text-base font-medium text-white hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                  >
                    Orders
                  </Disclosure.Button>
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
                    className="block px-4 py-2 text-base font-medium text-white hover:bg-gray-100 hover:text-gray-800"
                  >
                    Account Details
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="a"
                    href="/account/billing"
                    className="block px-4 py-2 text-base font-medium text-white hover:bg-gray-100 hover:text-gray-800"
                  >
                    Billing
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="a"
                    href="/account/referrals"
                    className="block px-4 py-2 text-base font-medium text-white hover:bg-gray-100 hover:text-gray-800"
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
                    className="block px-4 py-2 text-base font-medium text-white hover:bg-gray-100 hover:text-gray-800"
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
                  className="block px-4 py-2 text-base font-medium text-white hover:bg-gray-100 hover:text-gray-800"
                >
                  Login
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="/register"
                  className="block px-4 py-2 text-base font-medium text-white hover:bg-gray-100 hover:text-gray-800"
                >
                  Sign up
                </Disclosure.Button>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
