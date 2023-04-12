/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect } from "react";
import {
  Dialog,
  Disclosure,
  Menu,
  Popover,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon, AdjustmentsIcon } from "@heroicons/react/outline";
import { Switch } from "@headlessui/react";
import { useState } from "react";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function FilterOptions({
  handleFilter,
  canViewDoFollowAndSponsored,
}) {
  // const handleClick = (e, sort) => {
  //   e.preventDefault();
  //   console.log('clicked')
  //   handleSort(sort)
  // }
  const [options, setOptions] = useState([
    { name: "is_indexed", label: "Indexed", value: "Y" },
    { name: "news", label: "Google News", value: "Y" },
  ]);

  useEffect(() => {
    if (canViewDoFollowAndSponsored) {
      // add is_sponsored and is_do_follow to options
      setOptions([
        { name: "is_indexed", label: "Indexed", value: "Y" },
        { name: "is_sponsored", label: "Non-Sponsored", value: "N" },
        { name: "is_do_follow", label: "Do Follow", value: "Y" },
      ]);
    }
  }, [canViewDoFollowAndSponsored]);

  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (e) => {
    e.preventDefault();
    let name = e.target.name;
    let value = options.find((option) => option.name === name).value;
    if (selectedOptions.includes(name)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== name));
    } else {
      setSelectedOptions([...selectedOptions, name]);
    }
    handleFilter({ name, value });
  };

  return (
    <Popover.Group className="flex sm:items-baseline sm:space-x-8">
      <Popover
        as="div"
        id={`desktop-menu`}
        className="relative inline-block text-left"
      >
        <div>
          <Popover.Button className="inline-flex justify-center w-full rounded-full border border-gray-300 shadow-sm px-3 py-3 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 flex-none gap-2">
            <AdjustmentsIcon className="h-5 w-5 flex-none" aria-hidden="true" />
          </Popover.Button>
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
          <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none space-y-2 w-40">
            <p className="font-medium">Filter</p>
            {options.map((option, optionIdx) => (
              <div key={option.name} className="flex items-center">
                <input
                  id={`filter-mobile--${optionIdx}`}
                  name={`${option.name}`}
                  onChange={(e) => handleChange(e)}
                  checked={selectedOptions.includes(option.name)}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor={`filter-mobile--${optionIdx}`}
                  className="ml-3 text-sm text-gray-500"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </Popover.Panel>
        </Transition>
      </Popover>
    </Popover.Group>
  );
}
