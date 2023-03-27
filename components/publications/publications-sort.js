/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, SwitchVerticalIcon } from "@heroicons/react/solid";
import { useState } from "react";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example({ handleSort }) {
  // const handleClick = (e, sort) => {
  //   e.preventDefault();
  //   console.log('clicked')
  //   handleSort(sort)
  // }

  const [selected, setSelected] = useState("publication.popularity_rank:desc");

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex justify-center w-full rounded-full border border-gray-300 shadow-sm px-6 py-3 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 flex-none gap-2">
          <SwitchVerticalIcon
            className="h-5 w-5 flex-none"
            aria-hidden="true"
          />
          <span className="flex-none">Sort</span>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1">
            {/* <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Most Popular
                </a>
              )}
            </Menu.Item> */}
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={(e) => {
                    handleSort(e);
                    setSelected("publication.popularity_rank:desc");
                  }}
                  data-sort="publication.popularity_rank:desc"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm user-select-none",
                    selected === "publication.popularity_rank:desc"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700"
                  )}
                >
                  Most Popular
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={(e) => {
                    handleSort(e);
                    setSelected("publication.price:asc");
                  }}
                  data-sort="publication.price:asc"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm user-select-none",
                    selected === "publication.price:asc"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700"
                  )}
                >
                  Lowest to Highest Price
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={(e) => {
                    handleSort(e);
                    setSelected("publication.price:desc");
                  }}
                  data-sort="publication.price:desc"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm user-select-none",
                    selected === "publication.price:desc"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700"
                  )}
                >
                  Highest to Lowest Price
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={(e) => {
                    handleSort(e);
                    setSelected("publication.name:asc");
                  }}
                  data-sort="publication.name:asc"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm",
                    selected === "publication.name:asc"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700"
                  )}
                >
                  A-Z
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={(e) => {
                    handleSort(e);
                    setSelected("publication.name:desc");
                  }}
                  data-sort="publication.name:desc"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm",
                    selected === "publication.name:desc"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700"
                  )}
                >
                  Z-A
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={(e) => {
                    handleSort(e);
                    setSelected("publication.domain_authority:desc");
                  }}
                  data-sort="publication.domain_authority:desc"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm user-select-none",
                    selected === "publication.domain_authority:desc"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700"
                  )}
                >
                  Domain Authority
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  onClick={(e) => {
                    handleSort(e);
                    setSelected("publication.domain_ranking:desc");
                  }}
                  data-sort="publication.domain_ranking:desc"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm user-select-none",
                    selected === "publication.domain_ranking:desc"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700"
                  )}
                >
                  Domain Rating
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
