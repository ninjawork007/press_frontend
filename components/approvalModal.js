/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";
import Link from "next/link";
import DateHandler from "../lib/date-handler";
export default function Example({
  confirmAction,
  selectedArticle,
  setIsOpen,
  isOpen,
  purchasedPublications,
}) {
  const confirmButtonRef = useRef(null);
  const [selectedPublication, setSelectedPublication] = useState(null);

  const handlePublicationChange = (e) => {
    const publication = purchasedPublications.find((publication) => {
      return parseInt(publication.id) === parseInt(e.target.value);
    });

    setSelectedPublication(publication);
  };
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={confirmButtonRef}
        onClose={setIsOpen}
      >
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
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="pt-8 relative bg-indigo-50 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
                <form onSubmit={(e) => confirmAction(e)}>
                  <div className=" px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-4xl font-medium text-gray-900"
                        >
                          Approve and submit for publishing
                        </Dialog.Title>
                        <div className="mt-2">
                          {/* <p className="text-base  text-gray-500 mt-2">
                            To submit for publishing, please select an outlet
                            for the article.
                          </p> */}
                          <p className="text-base text-gray-500 font-bold mt-2">
                            Warning: Once you submit, you cannot make any
                            edits/changes to the article.
                          </p>
                        </div>
                        {/* <div className="mt-4 space-y-2">
                          <label
                            htmlFor="publication"
                            className="block text-sm font-bold text-gray-700"
                          >
                            Select Outlet
                          </label>
                          {purchasedPublications.length > 0 ? (

                          <select
                            id="publication"
                            name="publication"
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Select an outlet"
                            defaultValue="Select an outlet"
                            onChange={handlePublicationChange}
                          >
                            <option value="">Select a publication</option>
                              purchasedPublications.map(
                                (purchasedPublication) => (
                                  <option
                                    key={purchasedPublication.id}
                                    value={purchasedPublication.id}
                                  >
                                    {
                                      purchasedPublication.attributes
                                        ?.publication?.data?.attributes?.name
                                    }
                                  </option>
                                )
                              )
                      
                          </select>
                          ) : (
                            <p>No purchases found</p>
                          )}
                          {selectedPublication?.attributes?.publication?.data
                            ?.attributes?.turnaround_time && (
                            <p className="">
                              <span className="text-indigo-600">
                                Est publish date:&nbsp;
                                {DateHandler.calculateLatestDueDate(
                                  selectedPublication?.attributes?.publication
                                    ?.data?.attributes?.turnaround_time
                                )}
                              </span>
                            </p>
                          )}
                        </div> */}
                      </div>
                    </div>
                    <div className="relative flex items-start mt-4 ml-4">
                      <div className="flex items-center h-5">
                        <input
                          id="agreedToTerms"
                          aria-describedby="agreedToTerms-description"
                          name="agreedToTerms"
                          type="checkbox"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="agreedToTerms"
                          className="font-medium text-gray-700 select-none"
                        >
                          By approving this article for publishing, I agree with
                          the{" "}
                          <Link href="/terms">
                            <a target="_blank">
                              <span className="font-bold">
                                Terms and Conditions
                              </span>
                            </a>
                          </Link>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="button"
                      ref={confirmButtonRef}
                    >
                      Confirm
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
