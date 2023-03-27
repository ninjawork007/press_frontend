/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ExclamationIcon,
  UploadIcon,
  DocumentIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
export default function Example({
  files,
  setFiles,
  feedbackRef,
  uploadRevisedArticle,
  selectedArticle,
  setIsOpen,
  isOpen,
  isManager,
  isUpload,
  approvedForPublishingRef,
}) {
  const cancelButtonRef = useRef(null);

  const FeedbackProvider = () => {
    return (
      <>
        <textarea
          className="form-textarea mt-4 w-full p-4 rounded-lg"
          name="feedback"
          rows="5"
          ref={feedbackRef}
          placeholder="Enter feedback here"
          required={!isManager}
        />
      </>
    );
  };

  const FileUpload = () => {
    if (files && files.length > 0) {
      return (
        <>
          <DocumentIcon
            className="mx-auto h-12 w-12 text-indigo-400 "
            aria-hidden="true"
          />
          <div>{files[0].name}</div>
          <a
            className="text-red-400 mt-4 block text-sm font-medium cursor-pointer"
            onClick={() => setFiles()}
          >
            Remove
          </a>
        </>
      );
    } else {
      return (
        <label className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
          <span className="flex items-center flex-col justify-center space-y-2">
            <div className="rounded-full bg-gray-50 p-2">
              <div className="rounded-full bg-indigo-100 p-2">
                <UploadIcon
                  className="h-6 w-6 text-indigo-500"
                  aria-hidden="true"
                />
              </div>
            </div>
            <span className="font-medium text-gray-600">
              <span className="text-blue-600 underline">click to upload</span>
            </span>
          </span>
          <input
            accept=".doc,.docx"
            type="file"
            name="file_upload"
            className="hidden"
            onChange={(e) => setFiles(e.target.files)}
          />
        </label>
      );
    }
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
              <Dialog.Panel className="relative bg-indigo-50  rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full pt-8">
                <form onSubmit={uploadRevisedArticle} id={selectedArticle?.id}>
                  <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left space-y-4">
                        <Dialog.Title
                          as="h3"
                          className="text-4xl font-medium text-gray-900"
                        >
                          {isUpload ? "Upload" : "Revise"}
                        </Dialog.Title>

                        {isManager ? (
                          <>
                            <p>Please upload the draft below.</p>
                            <FileUpload />
                            <p className="text-sm">
                              <span className="font-bold">Optional:</span>{" "}
                              Provide comments in the box below for the customer
                              to have more context on the draft.
                            </p>
                            <FeedbackProvider />
                          </>
                        ) : (
                          <>
                            <p>
                              Please provide feedback in the textbox below. Once
                              you submit your feedback, our writers will send an
                              updated draft in 2-3 days.
                            </p>
                            <FeedbackProvider />
                            <p className="text-sm">
                              <span className="font-bold">Optional:</span> To
                              make an edit, please download the document, open
                              in Word Doc and make changes there. Once done,
                              please upload the updated document below
                            </p>
                            <FileUpload />
                          </>
                        )}
                      </div>
                    </div>
                    {files && files.length > 0 && !isManager && (
                      <div className="relative flex items-start mt-4 ml-4">
                        <div className="flex items-center h-5">
                          <input
                            id="approved_for_publishing"
                            aria-describedby="approved_for_publishing-description"
                            name="approved_for_publishing"
                            type="checkbox"
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            ref={approvedForPublishingRef}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="approved_for_publishing"
                            className="font-medium text-gray-700"
                          >
                            Publish my articles automatically if approved
                          </label>
                          <p
                            id="approved_for_publishing-description"
                            className="text-gray-500"
                          >
                            I agree with the{" "}
                            <Link href="/terms">
                              <a target="_blank">
                                <span className="font-bold">
                                  Terms and Conditions
                                </span>
                              </a>
                            </Link>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                    <input
                      className="button"
                      type="submit"
                      value="Submit"
                      // onClick={() => setIsOpen(false)}
                    />

                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => setIsOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
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
