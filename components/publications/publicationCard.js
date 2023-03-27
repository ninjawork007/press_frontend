import Tooltip from "../tooltip";
import StatusLabel from "../statusLabel";
import {
  IsDoFollowLabel,
  ImageLabel,
  SponsorLabel,
  NewsLabel,
  IndexLabel,
  TurnaroundTimeLabel,
} from "../labels";
import {
  PlusIcon,
  LockOpenIcon,
  PencilIcon,
  StarIcon,
  InformationCircleIcon,
} from "@heroicons/react/outline";
import { MinusIcon, StarIcon as StarIconSolid } from "@heroicons/react/solid";
import classNames from "classnames";

export default function PublicationCard({
  publication,
  canViewPricing,
  isWhitelabelOwner,
  handleFeaturedUpdate,
  handlePublicationSelect,
  viewOptions,
  handlePriceEdit,
}) {
  const {
    showDoFollow,
    showImageRequirement,
    showDomainAuthority,
    showDomainRanking,
    showIndexed,
    showGoogleNews,
  } = viewOptions;

  const renderCategoriesForPublication = (publication) => {
    if (publication.publicationCategories?.length > 0) {
      return (
        <Tooltip
          content={
            <div className="">
              {publication.publicationCategories?.map((category) => (
                <span
                  key={category.id}
                  className="inline-flex items-center px-2.5 py-0.5 my-1 mx-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {category.attributes.name}
                </span>
              ))}
            </div>
          }
        >
          <span className="flex gap-1 items-center">
            {publication.publicationCategories?.length} Categories{" "}
            <InformationCircleIcon className="h-4 w-4" />
          </span>
        </Tooltip>
      );
    } else {
      return publication.category;
    }
  };

  return (
    <div className="table-row-group">
      <div className="table-row items-center justify-center">
        <div className="table-cell align-middle w-full max-w-0 flex-col pl-4 pr-3 py-4 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6 bg-white sm:rounded-l-full sm:rounded-r-none rounded-l-xl rounded-r-xl border-t-4 border-l-4 border-b-4 border-[#F8F7FC]">
          <div className="flex gap-2 md:gap-4 items-start sm:items-center">
            {/* {publication.logo && (
              <img
                className="h-11 w-11 object-contain rounded-full"
                src={publication.logo?.attributes?.url}
              />
            )} */}

            <div className="">
              <div className="flex items-center gap-1">
                <p className="font-bold">{publication.name}</p>
                {publication.isExclusive && (
                  <Tooltip
                    content={
                      "We are the only authorized resellers for this outlet"
                    }
                  >
                    <StatusLabel status={5} title={"Exclusive"} />
                  </Tooltip>
                )}
              </div>

              <a
                className="text-gray-400"
                href={publication.websiteUrl}
                target="_blank"
                rel="noreferrer"
              >
                <p>{publication.websiteUrl}</p>
              </a>
            </div>
            <div className={classNames("ml-auto sm:hidden font-bold")}>
              {canViewPricing && <p>{`${publication.price}`}</p>}
            </div>

            {/*
        <button className="ml-auto sm:hidden relative whitespace-nowrap inline-flex items-center justify-center px-3 py-3 border border-[#D3CCFF] hover:bg-[#2302FD] hover:text-white text-[#2302FD] font-bold uppercase rounded-full" onClick={() => handleAddItem(publication)}>
          <PlusIcon className="block h-4 w-4" aria-hidden="true" />
        </button>
                  */}
          </div>

          <dl className="font-normal lg:hidden space-y-2">
            <dt className="sr-only">Title</dt>
            <dd className="mt-1 capitalize">
              <span className="text-gray-500">Category: </span>
              <span className="text-gray-700">
                {renderCategoriesForPublication(publication)}
              </span>
            </dd>

            <dd className="capitalize">
              <span className="text-gray-500">Turnaround Time: </span>
              <span className="text-gray-700">
                <TurnaroundTimeLabel
                  turnaroundTime={publication.turnaroundTime}
                />
              </span>
            </dd>
            <dd className="mt-1 text-gray-700 capitalize flex gap-2">
              {/* <a
                  onClick={() => handleRequirementsOpen(publication)}
                  className="text-gray-700"
                  href="#"
                >
                  <b>Requirements</b>
                </a> */}
              {showDomainAuthority && (
                <p>
                  <span className="font-bold">
                    {publication.domainAuthority}
                  </span>{" "}
                  DA
                </p>
              )}
              {showDomainRanking && (
                <p>
                  <span className="font-bold">{publication.domainRanking}</span>{" "}
                  DR
                </p>
              )}
            </dd>
            <dt className="sr-only sm:hidden">Email</dt>
            <dd className="mt-2 text-gray-500 sm:hidden flex flex-wrap gap-2">
              {/* {showDoFollow && (
                <span className="rounded-xl">
                  <IsDoFollowLabel isDoFollow={publication.isDoFollow} />
                </span>
              )} */}
              {/* <span className="rounded-xl">
                <SponsorLabel isSponsored={publication.isSponsored} />
              </span> */}
              {/* {showGoogleNews && (
                <span className="rounded-xl">
                  <NewsLabel news={publication.news} />
                </span>
              )} */}
              {showIndexed && (
                <span className="rounded-xl">
                  <IndexLabel indexed={publication.isIndexed} />
                </span>
              )}
              {showImageRequirement && (
                <span className="rounded-xl">
                  <IndexLabel indexed={publication.image} />
                </span>
              )}
            </dd>

            <button
              className="button-secondary large w-full"
              onClick={() => handlePublicationSelect(publication)}
            >
              {canViewPricing ? (
                <>
                  {isWhitelabelOwner ? (
                    <>
                      <PlusIcon className="block h-4 w-4" aria-hidden="true" />
                      <span className="ml-2">Add</span>
                    </>
                  ) : (
                    <>
                      {publication.requiresInquiry ? (
                        <span className="ml-2">Inquire</span>
                      ) : (
                        <>
                          <PlusIcon
                            className="block h-4 w-4"
                            aria-hidden="true"
                          />
                          <span className="ml-2">Add to cart</span>
                        </>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  <LockOpenIcon className="block h-4 w-4" aria-hidden="true" />
                  <span className="ml-2">Access</span>
                </>
              )}
            </button>
          </dl>
        </div>
        <div
          className={classNames(
            "border-t-4 border-b-4 border-[#F8F7FC] hidden px-3 py-4 text-sm text-gray-500 sm:table-cell align-middle bg-white font-bold"
          )}
        >
          {canViewPricing && (
            <>
              {isWhitelabelOwner ? (
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handlePriceEdit(publication)}
                >
                  <p>{`${publication.price}`}</p>{" "}
                  <PencilIcon className="block h-4 w-4" aria-hidden="true" />
                </div>
              ) : (
                <p>{`${publication.price}`}</p>
              )}
            </>
          )}
        </div>
        <div className="border-t-4 border-b-4 border-[#F8F7FC] hidden px-3 py-4 text-sm text-gray-500 sm:table-cell  align-middle capitalize bg-white flex-wrap max-w-[250px]">
          {renderCategoriesForPublication(publication)}
        </div>
        <div className="border-t-4 border-b-4 border-[#F8F7FC] hidden px-3 py-4 text-sm text-gray-500 sm:table-cell  align-middle bg-white">
          <TurnaroundTimeLabel turnaroundTime={publication.turnaroundTime} />
        </div>
        {showDomainAuthority && (
          <div className="border-t-4 border-b-4 border-[#F8F7FC] hidden px-3 py-4 text-sm text-gray-500 sm:table-cell  align-middle bg-white">
            <p>
              <span className="font-bold">{publication.domainAuthority}</span>{" "}
              DA
            </p>
          </div>
        )}
        {showDomainRanking && (
          <div className="border-t-4 border-b-4 border-[#F8F7FC] hidden px-3 py-4 text-sm text-gray-500 sm:table-cell  align-middle bg-white">
            <p>
              <span className="font-bold">{publication.domainRanking}</span> DR
            </p>
          </div>
        )}
        <div className="border-t-4 border-b-4 border-[#F8F7FC] hidden px-3 py-4 text-sm text-gray-500 sm:table-cell  align-middle bg-white">
          <div className="flex gap-2 items-start flex-wrap">
            {/* {publication.requirements && (
                <a
                  onClick={() => handleRequirementsOpen(publication)}
                  className="text-gray-500 font-bold flex items-center gap-1"
                  href="#"
                >
                  Requirements{" "}
                  <QuestionMarkCircleIcon className="h-4 w-4" />
                </a>
              )} */}

            {/* {showDoFollow && (
              <IsDoFollowLabel isDoFollow={publication.isDoFollow} />
            )} */}
            {showImageRequirement && (
              <ImageLabel imageRequired={publication.image} />
            )}
            {/* <SponsorLabel isSponsored={publication.isSponsored} /> */}
            {/* {showGoogleNews && <NewsLabel news={publication.news} />} */}
            {showIndexed && <IndexLabel indexed={publication.isIndexed} />}
          </div>
        </div>
        <div className="border-t-4 border-b-4 border-[#F8F7FC] hidden px-3 py-4 text-sm text-gray-500 sm:table-cell  align-middle bg-white rounded-r-full text-right">
          <div className="flex justify-end gap-2">
            <button
              className="button-secondary large"
              onClick={() => handlePublicationSelect(publication)}
            >
              {canViewPricing ? (
                <>
                  {isWhitelabelOwner ? (
                    <>
                      {publication.isHidden ? (
                        <>
                          <PlusIcon
                            className="block h-4 w-4"
                            aria-hidden="true"
                          />
                          <span className="ml-2">Add</span>
                        </>
                      ) : (
                        <>
                          <MinusIcon className="block h-4 w-4 text-red-600" />
                          <span className="ml-2 text-red-600">Remove</span>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {publication.requiresInquiry ? (
                        <span className="ml-2">Inquire</span>
                      ) : (
                        <>
                          <PlusIcon
                            className="block h-4 w-4"
                            aria-hidden="true"
                          />

                          <span className="ml-2">Add to cart</span>
                        </>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  <LockOpenIcon className="block h-4 w-4" aria-hidden="true" />
                  <span className="ml-2">Access</span>
                </>
              )}
            </button>
            {isWhitelabelOwner && (
              <div className="flex flex-col justify-center items-center">
                {publication.isFeatured ? (
                  <>
                    <Tooltip content={"Remove from featured"}>
                      <StarIconSolid
                        className="block h-6 w-6 text-purple-600"
                        aria-hidden="true"
                        onClick={() =>
                          handleFeaturedUpdate(publication, "isFeatured")
                        }
                      />
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Tooltip content={"Set as featured"}>
                      <StarIcon
                        className="block h-6 w-6 text-purple-600"
                        aria-hidden="true"
                        onClick={() =>
                          handleFeaturedUpdate(publication, "isFeatured")
                        }
                      />
                    </Tooltip>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
