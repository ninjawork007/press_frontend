/* This example requires Tailwind CSS v2.0+ */
import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { DownloadIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import moment from "moment";
import Modal from "./modal";
export default function DocViewerModalQuestionnaire({
  selectedQuestionnaire,
  setIsOpen,
  isOpen,
}) {
  const downloadURI = (uri, name) => {
    var link = document.createElement("a");
    link.download = name;
    link.href = `${uri}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal isOpen={isOpen} onClose={setIsOpen}>
      <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mt-3 sm:mt-0 sm:ml-4 space-y-4">
            <Dialog.Title
              as="h3"
              className="text-3xl font-medium text-gray-900"
            >
              Questionnaire
            </Dialog.Title>
            <div className="flex flex-col sm:grid grid-cols-2 gap-16">
              <div
                className={classNames(
                  "space-y-4",
                  selectedQuestionnaire ? "col-span-2" : "col-span-3"
                )}
              >
                {selectedQuestionnaire && (
                  <div className="flex justify-end items-center">
                    <button
                      className="button"
                      onClick={() =>
                        downloadURI(
                          selectedQuestionnaire.attributes.url,
                          selectedQuestionnaire.attributes.name
                        )
                      }
                    >
                      <DownloadIcon className="h-6 w-6" aria-hidden="true" />{" "}
                      Download
                    </button>
                  </div>
                )}

                <iframe
                  id="msdoc-iframe"
                  title="msdoc-iframe"
                  className={classNames(
                    "max-w-full aspect-auto h-[680px]",
                    selectedQuestionnaire ? "w-[780px]" : "w-[1200px]"
                  )}
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                    selectedQuestionnaire?.attributes?.url
                  )}`}
                  frameBorder="0"
                />
                <div className="flex justify-between mt-4">
                  <p>
                    <span className="">
                      {selectedQuestionnaire?.attributes?.name}
                    </span>
                    <br />
                    <span className="text-gray-500">
                      {selectedQuestionnaire?.attributes?.createdAt &&
                        moment(
                          selectedQuestionnaire?.attributes?.createdAt
                        ).format("MMMM D, hh:mm a")}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
