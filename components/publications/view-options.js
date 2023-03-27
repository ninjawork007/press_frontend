/* This example requires Tailwind CSS v2.0+ */
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, EyeIcon } from "@heroicons/react/outline";
import { Switch } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example({
  toggleView,
  viewOptions,
  canViewDoFollowAndSponsored,
}) {
  // const handleClick = (e, sort) => {
  //   e.preventDefault();
  //   console.log('clicked')
  //   handleSort(sort)
  // }
  const {
    showDoFollow,
    showImageRequirement,
    showDomainAuthority,
    showDomainRanking,
    showIndexed,
    showGoogleNews,
  } = viewOptions;

  const handleChange = (e, id) => {
    toggleView(id);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex justify-center w-full rounded-full border border-gray-300 shadow-sm px-3 py-3 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 flex-none gap-2">
          <EyeIcon className="h-5 w-5 flex-none" aria-hidden="true" />
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
          <p className="px-4 pt-4 font-medium">Show</p>
          <div className="py-1">
            {canViewDoFollowAndSponsored && (
              <Menu.Item>
                <a
                  onClick={(e) => {
                    toggleView(e);
                  }}
                  id="do-follow-toggle"
                  data-sort="publication.popularity_rank:desc"
                  className={classNames(
                    "text-gray-700 block px-4 py-2 text-sm user-select-none justify-between flex"
                  )}
                >
                  Do Follow
                  <Switch
                    checked={showDoFollow}
                    onChange={(e) => handleChange(e, "do-follow-toggle")}
                    className={classNames(
                      showDoFollow ? "bg-indigo-600" : "bg-gray-200",
                      "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                    )}
                  >
                    <span className="sr-only">Use setting</span>
                    <span
                      aria-hidden="true"
                      className={classNames(
                        showDoFollow ? "translate-x-5" : "translate-x-0",
                        "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                      )}
                    ></span>
                  </Switch>
                </a>
              </Menu.Item>
            )}

            <Menu.Item>
              <a
                onClick={(e) => {
                  toggleView(e);
                }}
                id="domain-authority-toggle"
                data-sort="publication.popularity_rank:desc"
                className={classNames(
                  "text-gray-700 block px-4 py-2 text-sm user-select-none justify-between flex"
                )}
              >
                Domain Authority
                <Switch
                  checked={showDomainAuthority}
                  onChange={(e) => handleChange(e, "domain-authority-toggle")}
                  className={classNames(
                    showDomainAuthority ? "bg-indigo-600" : "bg-gray-200",
                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                  )}
                >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      showDomainAuthority ? "translate-x-5" : "translate-x-0",
                      "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                    )}
                  ></span>
                </Switch>
              </a>
            </Menu.Item>
            <Menu.Item>
              <a
                onClick={(e) => {
                  toggleView(e);
                }}
                id="domain-ranking-toggle"
                data-sort="publication.popularity_rank:desc"
                className={classNames(
                  "text-gray-700 block px-4 py-2 text-sm user-select-none justify-between flex"
                )}
              >
                Domain Rating
                <Switch
                  checked={showDomainRanking}
                  onChange={(e) => handleChange(e, "domain-ranking-toggle")}
                  className={classNames(
                    showDomainRanking ? "bg-indigo-600" : "bg-gray-200",
                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                  )}
                >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      showDomainRanking ? "translate-x-5" : "translate-x-0",
                      "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                    )}
                  ></span>
                </Switch>
              </a>
            </Menu.Item>
            {/* 
            <Menu.Item>
              <a
                onClick={(e) => {toggleView(e)}}
                id="image-requirement-toggle"
                data-sort='publication.popularity_rank:desc'
                className={classNames(
                  'text-gray-700 block px-4 py-2 text-sm user-select-none justify-between flex'
                )}
              >
                Image Requirement

                <Switch
                  checked={showImageRequirement}
                  onChange={(e) => handleChange(e, "image-requirement-toggle")}
                  className={classNames(showImageRequirement ? 'bg-indigo-600' : 'bg-gray-200', 'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600')}
                  >
                    <span className="sr-only">Use setting</span>
                    <span
                      aria-hidden="true"
                      className={classNames(showImageRequirement ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200')}>
                    </span>
                  </Switch>
              </a>

              </Menu.Item> */}

            {/* <Menu.Item>
              <a
                onClick={(e) => {
                  toggleView(e);
                }}
                id="google-news-toggle"
                data-sort="publication.popularity_rank:desc"
                className={classNames(
                  "text-gray-700 block px-4 py-2 text-sm user-select-none justify-between flex"
                )}
              >
                Google News
                <Switch
                  checked={showGoogleNews}
                  onChange={(e) => handleChange(e, "google-news-toggle")}
                  className={classNames(
                    showGoogleNews ? "bg-indigo-600" : "bg-gray-200",
                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                  )}
                >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      showGoogleNews ? "translate-x-5" : "translate-x-0",
                      "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                    )}
                  ></span>
                </Switch>
              </a>
            </Menu.Item> */}

            <Menu.Item>
              <a
                onClick={(e) => {
                  toggleView(e);
                }}
                id="indexed-toggle"
                data-sort="publication.popularity_rank:desc"
                className={classNames(
                  "text-gray-700 block px-4 py-2 text-sm user-select-none justify-between flex"
                )}
              >
                Indexed
                <Switch
                  checked={showIndexed}
                  onChange={(e) => handleChange(e, "indexed-toggle")}
                  className={classNames(
                    showIndexed ? "bg-indigo-600" : "bg-gray-200",
                    "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                  )}
                >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className={classNames(
                      showIndexed ? "translate-x-5" : "translate-x-0",
                      "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                    )}
                  ></span>
                </Switch>
              </a>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
