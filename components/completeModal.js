/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ExclamationIcon,
  PlusIcon,
  DocumentIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
export default function Example({
  setIsOpen,
  isOpen,
  submitArticleUrl,
  articleUrlFieldRef,
  selectedArticle,
}) {
  const [isInvalidUrl, setIsInvalidUrl] = useState(false);
  const checkUrl = () => {
    const url = articleUrlFieldRef.current.value;
    var urlreg =
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    setIsInvalidUrl(true);
    if (urlreg.test(url)) {
      setIsInvalidUrl(false);
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
                <form onSubmit={submitArticleUrl} id={selectedArticle?.id}>
                  <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left space-y-4 w-full">
                        <Dialog.Title
                          as="h3"
                          className="text-4xl font-medium text-gray-900"
                        >
                          Complete
                        </Dialog.Title>
                        <p>Enter the published url and complete this order</p>
                        <input
                          className="input"
                          name="article_url"
                          ref={articleUrlFieldRef}
                          placeholder="Enter website url here"
                          required
                          onChange={checkUrl}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="px-4 sm:px-6 sm:flex sm:flex-row gap-2 absolute">
                    {isInvalidUrl && (
                      <p className="sm:ml-4 text-red-500">
                        Please provide a valid URL
                      </p>
                    )}
                  </div>

                  <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                    <input
                      className="button"
                      type="submit"
                      value="Submit"
                      // onClick={() => setIsOpen(false)}
                      disabled={isInvalidUrl}
                    />

                    <button
                      type="button"
                      className="button-secondary"
                      onClick={() => setIsOpen(false)}
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
