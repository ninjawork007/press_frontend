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
  ExternalLinkIcon,
} from "@heroicons/react/outline";
import { MinusIcon, StarIcon as StarIconSolid } from "@heroicons/react/solid";
import classNames from "classnames";
import Image from "next/image";

export default function PublicationCard({
  publication,
  canViewPricing,
  isWhitelabelOwner,
  handleFeaturedUpdate,
  handlePublicationSelect,
  viewOptions,
  handlePriceEdit,
  canViewDoFollowAndSponsored,
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
            <div className="flex flex-wrap">
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

  const CTAButton = () => {
    return (
      <button
        className="button large w-full"
        onClick={() => handlePublicationSelect(publication)}
      >
        {canViewPricing ? (
          <>
            {isWhitelabelOwner ? (
              <>
                {publication.isHidden ? (
                  <>
                    <PlusIcon className="block h-4 w-4" aria-hidden="true" />
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
                    <PlusIcon className="block h-4 w-4" aria-hidden="true" />

                    <span className="ml-2">Apply</span>
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
    );
  };

  return (
    <div className="bg-white rounded-3xl">
      <div className="items-center justify-center">
        <div className="w-full flex-col pl-4 pr-3 py-4 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6  ">
          <div className="flex gap-2 md:gap-4 items-start sm:items-center">
            {publication.logo && (
              <Image
                className="object-contain rounded-full"
                src={publication.logo?.attributes?.url}
                alt={publication.name}
                width={44}
                height={44}
              />
            )}

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
              <div className="flex flex-col md:flex-row items-start md:items-center gap-1">
                <a
                  className="text-gray-400"
                  href={publication.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <p className="break-words w-[250px] md:w-full max-w-[250px] md:max-w-[auto]">
                    {publication.websiteUrl}
                  </p>
                </a>
                {publication.exampleScreenshot.data && (
                  <button
                    className="relative whitespace-nowrap inline-flex items-center justify-center text-gray-500 hover:text-gray-600 font-bold gap-1 ring-0 outline-none"
                    onClick={() => handlePublicationSelect(publication)}
                  >
                    <ExternalLinkIcon
                      className="h-5 w-5 text-gray-600 inline"
                      aria-hidden="true"
                    />
                    View Example
                  </button>
                )}
              </div>
            </div>
            <div className={classNames("ml-auto font-bold")}>
              {canViewPricing && (
                <>
                  {isWhitelabelOwner ? (
                    <div
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => handlePriceEdit(publication)}
                    >
                      <p>{`${publication.getFormattedPrice()}`}</p>{" "}
                      <PencilIcon
                        className="block h-4 w-4"
                        aria-hidden="true"
                      />
                    </div>
                  ) : (
                    <p>{`${publication.getFormattedPrice()}`}</p>
                  )}
                </>
              )}
            </div>
            <div className="hidden sm:flex justify-end gap-2">
              <CTAButton />
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
        <div className="flex flex-col sm:flex-row px-6  gap-2 sm:gap-8 border-y border-[#F0F4FF] py-4">
          <div className="text-sm text-gray-500  capitalize  flex-wrap max-w-[250px]">
            {renderCategoriesForPublication(publication)}
          </div>
          <div className="text-sm text-gray-500  ">
            <TurnaroundTimeLabel turnaroundTime={publication.turnaroundTime} />
          </div>
          {(showDomainAuthority || showDomainRanking) && (
            <div className="flex sm:block lg:flex gap-2">
              {showDomainAuthority && (
                <div className="text-sm text-gray-500  ">
                  <p>
                    Domain Authority{" "}
                    <span className="font-bold">
                      {publication.domainAuthority}
                    </span>
                  </p>
                </div>
              )}
              {showDomainRanking && (
                <div className="text-sm text-gray-500  ">
                  <p>
                    Domain Rating{" "}
                    <span className="font-bold">
                      {publication.domainRanking}
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="text-sm text-gray-500  ">
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

              {showDoFollow && canViewDoFollowAndSponsored && (
                <IsDoFollowLabel
                  isDoFollow={publication.isDoFollow}
                  doFollowLinksAllowed={publication.doFollowLinksAllowed}
                />
              )}
              {showImageRequirement && (
                <ImageLabel imageRequired={publication.image} />
              )}
              {canViewDoFollowAndSponsored && (
                <SponsorLabel isSponsored={publication.isSponsored} />
              )}
              {showGoogleNews && <NewsLabel news={publication.news} />}
              {showIndexed && <IndexLabel indexed={publication.isIndexed} />}
            </div>
          </div>
        </div>
        <div className="sm:hidden text-sm text-gray-500 flex p-6">
          <CTAButton />
        </div>
      </div>
    </div>
  );
}
