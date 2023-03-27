/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ExclamationIcon,
  PlusIcon,
  DocumentIcon,
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
export default function Example({
  setIsOpen,
  isOpen,
  publication,
  handleAddToCart,
  handlePublicationInquiryOpen,
  canViewPricing,
}) {
  const cancelButtonRef = useRef(null);

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
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-indigo-50  rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full py-8">
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left space-y-4">
                      <div className="flex p-6 bg-white rounded-xl">
                        <div className="flex flex-1 flex-col">
                          <div className="">
                            <div className="flex items-center gap-1">
                              <p className="font-bold">{publication?.name}</p>
                              {publication?.isExclusive && (
                                <Tooltip content="We are the only authorized resellers for this outlet">
                                  <StatusLabel status={5} title="Exclusive" />
                                </Tooltip>
                              )}
                            </div>
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

                          <dl className="font-normal ">
                            <dt className="sr-only">Title</dt>
                            <dd className="mt-1 text-gray-700 capitalize">
                              {publication?.category} ·{" "}
                              <TurnaroundTimeLabel
                                turnaroundTime={publication?.turnaroundTime}
                              />
                            </dd>
                            <dd></dd>
                            <dt className="sr-only ">Email</dt>
                            <dd className="mt-2 text-gray-500  flex gap-2 flex-wrap">
                              {/* <IsDoFollowLabel
                                isDoFollow={publication?.isDoFollow}
                              /> */}

                              {/* <SponsorLabel
                                isSponsored={publication?.isSponsored}
                              /> */}

                              <NewsLabel news={publication?.news} />

                              <IndexLabel indexed={publication?.indexed} />

                              <IndexLabel indexed={publication?.image} />
                            </dd>
                          </dl>
                        </div>
                      </div>
                      {publication?.requirements && (
                        <>
                          <Dialog.Title
                            as="h3"
                            className="text-2xl font-medium text-gray-900"
                          >
                            The article selected has the following restrictions:
                          </Dialog.Title>
                          <ReactMarkdown className="text-red-600 prose">
                            {publication?.requirements}
                          </ReactMarkdown>
                        </>
                      )}

                      <div className="flex flex-col gap-4 ">
                        {publication.requiresInquiry ? (
                          <button
                            className="button-secondary"
                            onClick={() =>
                              handlePublicationInquiryOpen(publication)
                            }
                          >
                            <span className="ml-2">Inquire</span>
                          </button>
                        ) : (
                          <button
                            className="button-secondary"
                            onClick={handleAddToCart}
                          >
                            <PlusIcon
                              className="block h-4 w-4"
                              aria-hidden="true"
                            />

                            <span className="ml-2">Add to cart</span>
                          </button>
                        )}

                        <button className="" onClick={() => setIsOpen(false)}>
                          <span className="font-bold uppercase text-gray-500 text-sm">
                            Dismiss
                          </span>
                        </button>
                      </div>
                    </div>
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
