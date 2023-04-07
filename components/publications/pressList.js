import { SearchIcon } from "@heroicons/react/outline";

import classNames from "classnames";

import { useEffect, useState, useContext } from "react";

import PublicationsSort from "./publications-sort";
import ViewOptions from "./view-options";
import FilterOptions from "./filter-options";
import PublicationCardLarge from "./publicationCardLarge";
import ScrollableTabs from "../scrollableTabs";

import InfiniteScroll from "react-infinite-scroll-component";
import { BarLoader, MoonLoader } from "react-spinners";
import { Switch } from "@headlessui/react";
import CartContext from "@/components/CartContext";

// const tabs = [
//   { name: "All Outlets", query: null, current: false },
//   { name: "Lifestyle", query: ["lifestyle"], current: false },
//   { name: "Luxury", query: ["luxury"], current: false },
//   { name: "Entertainment", query: ["entertainment"], current: true },

//   { name: "Fashion", query: ["fashion"], current: false },
//   { name: "News", query: ["news"], current: false },
//   { name: "Business", query: ["business"], current: false },
//   { name: "Logo Worthy", query: ["logo worthy"], current: false },
//   { name: "Crypto", query: ["crypto"], current: false },

//   { name: "Music", query: ["music"], current: true },
//   { name: "Real estate", query: ["real estate"], current: true },

//   { name: "Technology", query: ["technology"], current: false },
//   { name: "Gaming", query: ["gaming"], current: true },
//   { name: "Location Specific", query: ["location specific"], current: true },
// ];

export default function PressList({
  publications,
  paginationData,
  nextPage,
  prevPage,
  handleSearch,
  handleCategory,
  handleSort,
  isLoadingPublications,
  handleRequirementsOpen,
  handlePublicationInquiryOpen,
  isWhitelabelOwner,
  handlePriceEdit,
  categories,
  handleToggleCategory,
  site_categories,
  handleFilter,
  canViewDoFollowAndSponsored,
}) {
  let tabs = categories
    ? categories.map((category) => {
        return {
          id: category.id,
          name: category.attributes.name,
          query: [category.attributes.name],
          current: false,
        };
      })
    : [];
  tabs.unshift({ name: "All Outlets", query: null, current: false });
  const [category, setCategory] = useState(tabs[0]);
  const [isCategoryEnabled, setIsCategoryEnabled] = useState(false);
  const {
    handleAddItem,
    handleRemoveItem,
    canViewPricing,
    handleFeaturedUpdate,
  } = useContext(CartContext);
  const [viewOptions, setViewOptions] = useState({
    showDoFollow: isWhitelabelOwner,
    showImageRequirement: false,
    showDomainAuthority: true,
    showDomainRanking: true,
    showIndexed: true,
    showGoogleNews: false,
  });

  const toggleView = (type) => {
    const localStorageViewOptions =
      JSON.parse(localStorage.getItem("viewOptions")) || {};

    if (type == "do-follow-toggle") {
      localStorageViewOptions.showDoFollow = !viewOptions.showDoFollow;
      setViewOptions({
        ...viewOptions,
        showDoFollow: !viewOptions.showDoFollow,
      });
    } else if (type == "image-requirement-toggle") {
      localStorageViewOptions.showImageRequirement =
        !viewOptions.showImageRequirement;
      setViewOptions({
        ...viewOptions,
        showImageRequirement: !viewOptions.showImageRequirement,
      });
    } else if (type == "google-news-toggle") {
      localStorageViewOptions.showGoogleNews = !viewOptions.showGoogleNews;
      setViewOptions({
        ...viewOptions,
        showGoogleNews: !viewOptions.showGoogleNews,
      });
    } else if (type == "indexed-toggle") {
      localStorageViewOptions.showIndexed = !viewOptions.showIndexed;
      setViewOptions({
        ...viewOptions,
        showIndexed: !viewOptions.showIndexed,
      });
    } else if (type == "domain-ranking-toggle") {
      localStorageViewOptions.showDomainRanking =
        !viewOptions.showDomainRanking;
      setViewOptions({
        ...viewOptions,
        showDomainRanking: !viewOptions.showDomainRanking,
      });
    } else if (type == "domain-authority-toggle") {
      localStorageViewOptions.showDomainAuthority =
        !viewOptions.showDomainAuthority;
      setViewOptions({
        ...viewOptions,
        showDomainAuthority: !viewOptions.showDomainAuthority,
      });
    }

    localStorage.setItem(
      "viewOptions",
      JSON.stringify(localStorageViewOptions)
    );
  };

  useEffect(() => {
    const localStorageViewOptions = JSON.parse(
      localStorage.getItem("viewOptions")
    );

    if (localStorageViewOptions) {
      setViewOptions(localStorageViewOptions);
    }
  }, []);

  const handlePublicationSelect = (publication) => {
    if (
      canViewPricing &&
      publication.requiresInquiry &&
      !isWhitelabelOwner &&
      !publication?.requirements
    ) {
      handlePublicationInquiryOpen(publication);
      return;
    }
    if (
      canViewPricing &&
      !isWhitelabelOwner &&
      (publication?.requirements || publication?.exampleScreenshot.data)
    ) {
      handleRequirementsOpen(publication);
    } else if (isWhitelabelOwner && !publication.isHidden) {
      handleRemoveItem(publication, "isHidden");
    } else if (isWhitelabelOwner && publication.isHidden) {
      handleAddItem(publication, "isHidden");
    } else {
      handleAddItem(publication);
    }
  };

  useEffect(() => {
    if (isWhitelabelOwner) {
      const isCategoryEnabled = site_categories?.some(
        (c) => c.id == category.id
      );
      setIsCategoryEnabled(isCategoryEnabled);
    }
  }, [site_categories, category]);

  return (
    <div className="">
      <div className="mt-8 ring-opacity-5 sm:-mx-6 md:mx-0">
        <ScrollableTabs
          tabs={tabs}
          selectedTab={category}
          handleTabClick={(tab) => {
            handleCategory(tab.query);
            setCategory(tab);
          }}
        />
        {isWhitelabelOwner && category?.id && (
          <div className="flex items-center gap-2 justify-end font-bold">
            {isCategoryEnabled ? "Hide Category" : "Show Category"}
            <Switch
              checked={isCategoryEnabled}
              onChange={(e) =>
                handleToggleCategory({
                  is_removing: isCategoryEnabled,
                  category_id: category?.id,
                })
              }
              className={classNames(
                isCategoryEnabled ? "bg-indigo-600" : "bg-gray-200",
                "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
              )}
            >
              <span className="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                className={classNames(
                  isCategoryEnabled ? "translate-x-5" : "translate-x-0",
                  "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                )}
              ></span>
            </Switch>
          </div>
        )}
        <div className="flex flex-col sm:flex-row justify-between items-end mt-2 gap-2">
          <div className="flex items-center space-x-2 sm:space-x-4 mt-1 max-w-xl">
            <div className="relative mt-1 shadow-sm border border-[#D9D4FF] rounded-full bg-white  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:max-wnone">
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
                placeholder="Search"
                onChange={handleSearch}
                className="ml-4 border-none focus:outline-none focus:ring-0 bg-transparent appearance-none block px-6 py-3  placeholder-gray-500 text-gray-900  sm:text-sm  max-w-[135px]"
              />
            </div>
            <PublicationsSort handleSort={handleSort} />

            <ViewOptions
              toggleView={toggleView}
              viewOptions={viewOptions}
              canViewDoFollowAndSponsored={
                canViewDoFollowAndSponsored || isWhitelabelOwner
              }
            />
            <FilterOptions
              handleFilter={handleFilter}
              canViewDoFollowAndSponsored={
                canViewDoFollowAndSponsored || isWhitelabelOwner
              }
            />
          </div>

          <p className="text-sm text-center text-gray-700">
            {/* <span className="font-medium">{(paginationData.pageSize * (paginationData.page - 1) + 1)} to {(paginationData.pageSize * (paginationData.page - 1)) + publications.length} of <b>{paginationData.total} results</b></span>
             */}
            {publications.length > 0 ? (
              <span className="font-medium">
                {publications.length} of <b>{paginationData.total} results</b>
              </span>
            ) : (
              <span className="font-medium">
                {isLoadingPublications ? (
                  <span className="flex items-center gap-1">
                    Fetching{" "}
                    <MoonLoader size={16} loading={isLoadingPublications} />{" "}
                  </span>
                ) : (
                  "No results"
                )}
              </span>
            )}
          </p>
        </div>

        {publications.length > 0 ? (
          <>
            {/* <thead className="">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 font-normal text-left text-sm  text-[#736F87] sm:pl-6">
                Publication
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-normal text-[#736F87] lg:table-cell"
              >
              Price

              </th>
              <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-normal text-[#736F87] sm:table-cell">
                Genre
              </th>
              <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-normal text-[#736F87] sm:table-cell">
                Turnaround Time
              </th>
              <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-normal text-[#736F87] sm:table-cell">
                Sponsored
              </th>
              <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-normal text-[#736F87] sm:table-cell">
              Follow / Do Not Follow
              </th>

            </tr>
          </thead> */}

            <InfiniteScroll
              className="table w-full  min-w-full border-spacing-6 mt-6 sm:mt-12 space-y-2"
              dataLength={publications.length} //This is important field to render the next data
              next={nextPage}
              hasMore={paginationData.page < paginationData.pageCount}
              loader={
                <div className="flex items-center gap-2 w-full justify-center text-center">
                  <MoonLoader size={16} loading={isLoadingPublications} />
                  <p className="text-center py-4">
                    Fetching more publications...
                  </p>
                </div>
              }
              // endMessage={
              //   <p style={{ textAlign: 'center' }}>
              //     <b>Yay! You have seen it all</b>
              //   </p>
              // }
            >
              {publications.map((publication, index) => (
                <PublicationCardLarge
                  key={index}
                  publication={publication}
                  isWhitelabelOwner={isWhitelabelOwner}
                  handleFeaturedUpdate={handleFeaturedUpdate}
                  handlePublicationSelect={handlePublicationSelect}
                  canViewPricing={canViewPricing}
                  handlePriceEdit={handlePriceEdit}
                  viewOptions={viewOptions}
                  canViewDoFollowAndSponsored={
                    canViewDoFollowAndSponsored || isWhitelabelOwner
                  }
                />
              ))}
            </InfiniteScroll>

            <nav className="px-4 flex items-center justify-center sm:px-0 mt-8 sm:mt-12">
              {/* <div className="-mt-px w-0 flex-1 flex">
      <a
        href="#"
        onClick={prevPage}
       className={classNames("relative inline-flex items-center pl-3 rounded-full py-2 border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50", paginationData.page > 1 ? "opacity-100" : "opacity-30")} disabled={paginationData.page <= 1}
      >
        <ArrowNarrowLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
      </a>
    </div> */}
              {/*
            <div className="hidden md:-mt-px md:flex">

      {(() => {
          let td = [];
          for (let i = 1; i <= paginationData.pageCount; i++) {
            td.push(<a
              href="#"
              className={classNames("border-transparent pt-4 px-4 inline-flex items-center text-sm", paginationData.page == i ? "text-indigo-500 hover:text-indigo-700 font-bold" : "text-gray-500 hover:text-gray-700  font-medium")}
            >
              {i}
            </a>);
          }
          return td;
        })()}
              </div>

      */}

              {/* Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" */}
              <p className="text-sm text-center text-gray-700">
                {/* <span className="font-medium">{(paginationData.pageSize * (paginationData.page - 1) + 1)} to {(paginationData.pageSize * (paginationData.page - 1)) + publications.length} of <b>{paginationData.total} results</b></span>
                 */}

                <span className="font-medium">
                  {publications.length} of <b>{paginationData.total} results</b>
                </span>
              </p>

              {/* <div className="-mt-px w-0 flex-1 flex justify-end">
      <button
                 onClick={nextPage}

        className={classNames("ml-3 relative inline-flex items-center pr-3 rounded-full py-2 border border-gray-300 text-sm font-medium text-gray-700  bg-white hover:bg-gray-50", paginationData.page < paginationData.pageCount ? "opacity-100" : "opacity-30")}
        disabled={paginationData.page == paginationData.pageCount}
      >
        <ArrowNarrowRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
      </button>
    </div> */}
            </nav>
          </>
        ) : (
          <div className="text-center w-full pt-36">
            {isLoadingPublications ? (
              <div className="flex flex-col items-center w-full justify-cente py-24 space-y-6">
                <p>Fetching publications</p>
                <BarLoader color={"#3B2CBC"} loading={isLoadingPublications} />
              </div>
            ) : (
              <>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No results
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Please try changing your filters
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
