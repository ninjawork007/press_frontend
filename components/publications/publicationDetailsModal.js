/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useRef, useState, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ExclamationIcon,
  PlusIcon,
  DocumentIcon,
  XMarkIcon,
} from "@heroicons/react/outline";
import ReactMarkdown from "react-markdown";
import {
  IsDoFollowLabel,
  ImageLabel,
  SponsorLabel,
  NewsLabel,
  IndexLabel,
  TurnaroundTimeLabel,
} from "../labels";
import Tooltip from "../tooltip";
import StatusLabel from "../statusLabel";
import classNames from "classnames";
import CartContext from "@/components/CartContext";

export default function PublicationDetailsModal({
  setIsOpen,
  isOpen,
  publication,
  handlePublicationInquiryOpen,
  canViewPricing,
  canViewDoFollowAndSponsored,
}) {
  const cancelButtonRef = useRef(null);
  const { handleAddItem } = useContext(CartContext);

  const handleAddToCart = () => {
    handleAddItem(publication);
    setIsOpen(false);
  };
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full sm:p-4 xl:p-4">
            {publication?.exampleScreenshot?.data && (
              <button
                className="button buy large w-[80%] lg:w-[350px] shadow-sm !fixed !bottom-[40px] max-w-[350px] mx-auto z-10 sm:flex lg:hidden"
                onClick={handleAddToCart}
              >
                <PlusIcon className="block h-4 w-4" aria-hidden="true" />

                <span className="ml-2">Accept and apply</span>
              </button>
            )}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-indigo-50 rounded-none text-left overflow-hidden shadow-xl transform transition-all max-w-[390px] sm:max-w-[390px] md:max-w-[490px] xl:max-w-[1512px] sm:max-h-full xl:max-h-[926px]">
                <div
                  className={`flex flex-col xl:flex-row-reverse gap-8 justify-between px-[20px] xl:px-[56px] pt-[20px] xl:pt-[56px] ${
                    publication?.exampleScreenshot?.data
                      ? "pb-16"
                      : "pb-[20px] xl:pb-[56px] max-w-[680px]"
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex flex-row justify-end">
                      <button onClick={() => setIsOpen(false)}>
                        <span className="text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </span>
                      </button>
                    </div>
                    <h2 className="text-[32px] xl:text-[44px] leading-[32px] xl:leading-[52px]">
                      {publication?.name}
                    </h2>
                    {publication?.isExclusive && (
                      <Tooltip
                        content="We are the only authorized resellers for this outlet"
                        className="max-w"
                      >
                        <StatusLabel status={5} title="Exclusive" />
                      </Tooltip>
                    )}
                    <p className="my-4">
                      Please carefully review the restrictions and the example
                      article before applying.
                    </p>
                    <div
                      className={`flex flex-col bg-white rounded-xl sm:min-w-full ${
                        publication?.exampleScreenshot?.data
                          ? "xl:min-w-[568px]"
                          : "xl:min-w-[568px]"
                      }`}
                    >
                      <div className="flex flex-col">
                        <div className="flex flex-col xs:flex-row justify-between gap-4 px-6 py-6">
                          <img
                            src={
                              publication?.logo
                                ? publication.logo?.attributes?.url
                                : "https://via.placeholder.com/56"
                            }
                            className="rounded-full"
                            width={"56px"}
                            height={"56px"}
                          />
                          <div className="flex flex-col grow">
                            <p className="font-bold">{publication?.name}</p>
                            <a
                              className="text-gray-400 focus:outline-none"
                              href={publication?.websiteUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <p>{publication?.websiteUrl}</p>
                            </a>
                          </div>
                          <div className={classNames("font-bold")}>
                            {canViewPricing && (
                              <p>{publication?.getFormattedPrice()}</p>
                            )}
                          </div>
                        </div>
                        <hr className="border-1" />
                        <dl className="font-normal px-6 py-6">
                          <dt className="sr-only">Title</dt>
                          <dd className="text-gray-700 capitalize flex flex-col">
                            <div className="flex mb-[16px]">
                              <span className="bg-gray-100 rounded-full px-[8px] py-[2px] mr-1">
                                {publication?.category}
                              </span>
                            </div>
                            <TurnaroundTimeLabel
                              turnaroundTime={publication?.turnaroundTime}
                            />
                          </dd>
                          <dd></dd>
                          <dt className="sr-only ">Email</dt>
                          <dd className="mt-2 text-gray-500  flex gap-2 flex-wrap">
                            {canViewDoFollowAndSponsored && (
                              <>
                                <IsDoFollowLabel
                                  isDoFollow={publication?.isDoFollow}
                                  doFollowLinksAllowed={
                                    publication.doFollowLinksAllowed
                                  }
                                />

                                <SponsorLabel
                                  isSponsored={publication?.isSponsored}
                                />
                              </>
                            )}

                            {/* <NewsLabel news={publication?.news} /> */}

                            <IndexLabel indexed={publication?.isIndexed} />
                          </dd>
                        </dl>
                        {publication?.requirements && (
                          <>
                            <hr className="border-1" />
                            <div className="flex flex-row justify-between gap-4 px-6 py-6">
                              <div
                                className="p-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 w-full border border-yellow-300 max-w-[520px]"
                                role="alert"
                              >
                                <span className="flex flex-row gap-3.5 items-start text-orange-700">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                                    />
                                  </svg>
                                  <div className="flex flex-col">
                                    <span className="font-bold">
                                      The publication selected has restrictions:
                                    </span>
                                    <p className="font-base">
                                      {publication?.requirements}
                                    </p>
                                  </div>
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                        <hr className="border-1 hidden lg:flex" />
                        <div className="hidden xl:flex flex-row justify-between gap-4 px-6 py-6">
                          {publication.requiresInquiry ? (
                            <button
                              className="button-secondary blue large w-full shadow-sm"
                              onClick={() =>
                                handlePublicationInquiryOpen(publication)
                              }
                            >
                              <span className="ml-2">Inquire</span>
                            </button>
                          ) : (
                            <button
                              className="button-secondary blue large w-full shadow-sm"
                              onClick={handleAddToCart}
                            >
                              <PlusIcon
                                className="block h-4 w-4"
                                aria-hidden="true"
                              />

                              <span className="ml-2">Accept and apply</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {publication.exampleScreenshot.data && (
                    <div className="max-w-[776px] sm:h-auto xl:h-[926px] sm:max-h-full xl:max-h-[926px] sm:overflow-visible xl:overflow-x-scroll pb-20">
                      <img
                        src={
                          publication?.exampleScreenshot?.data?.attributes?.url
                        }
                      />
                    </div>
                  )}

                  <div className="flex xl:hidden flex-row justify-between gap-4 px-6 py-6">
                    {publication.requiresInquiry ? (
                      <button
                        className="button-secondary large w-full shadow-sm"
                        onClick={() =>
                          handlePublicationInquiryOpen(publication)
                        }
                      >
                        <span className="ml-2">Inquire</span>
                      </button>
                    ) : (
                      <>
                        {!publication?.exampleScreenshot?.data && (
                          <button
                            className="button buy large w-full shadow-sm"
                            onClick={handleAddToCart}
                          >
                            <PlusIcon
                              className="block h-4 w-4"
                              aria-hidden="true"
                            />

                            <span className="ml-2">Accept and apply</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
