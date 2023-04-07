/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ExclamationIcon,
  PaperAirplaneIcon,
  DownloadIcon,
  PencilAltIcon,
  CheckCircleIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
import classNames from "classnames";
import moment from "moment";
import Modal from "./modal";
export default function Example({
  setIsOpen,
  isOpen,
  selectedArticle,
  messages,
  messageTextareaRef,
  handleSendMessage,
  handleSubmitForReview,
  handleApproveFlow,
  isManager,
}) {
  const [selectedDraft, setSelectedDraft] = useState();
  const [allDocuments, setAllDocuments] = useState([]);
  const [canSendMessage, setCanSendMessage] = useState(false);
  const pressTeamReviewing = (status) => status == "reviewing";
  const requiresClientAction = (status) => status == "requires-action";
  const articleIsPublished = (status) => status == "completed";
  const awaitingPublishing = (status) => status == "publishing";

  useEffect(() => {
    const unsortedDrafts = selectedArticle?.drafts || [];
    const draftsSortedByDate = unsortedDrafts.sort(
      (a, b) => moment(a.createdAt) - moment(b.createdAt)
    );
    const drafts =
      draftsSortedByDate.length > 0
        ? draftsSortedByDate.map((draft, index) => ({
            ...draft,
            type: "draft",
            number: index + 1,
          }))
        : [];

    const unsortedRevisions = selectedArticle?.revisions || [];
    const revisionsSortedByDate = unsortedRevisions.sort(
      (a, b) => moment(a.createdAt) - moment(b.createdAt)
    );

    const revisions =
      revisionsSortedByDate.length > 0
        ? revisionsSortedByDate.map((draft, index) => ({
            ...draft,
            type: "revision",
            number: index + 1,
          }))
        : [];

    const documents = [...drafts, ...revisions];

    const documentsSortedByDate = documents.sort(
      (a, b) => moment(b.createdAt) - moment(a.createdAt)
    );

    setAllDocuments(documents);
    setSelectedDraft(documents[0]);
  }, [selectedArticle]);

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
              Doc Viewer
            </Dialog.Title>
            {selectedArticle?.googleDocUrl && (
              <>
                {((requiresClientAction(selectedArticle?.status) &&
                  !isManager) ||
                  (pressTeamReviewing(selectedArticle?.status) &&
                    isManager)) && (
                  <div className="flex flex-col sm:flex-row justify-between">
                    <p className="max-w-lg text-sm">
                      If {"you're"} ready to publish this draft, please click
                      {` "Publish"`}. Otherwise please provide feedback in the
                      document below by commenting or redlining. Once your
                      feedback is complete, please click {`"Submit for Review"`}
                    </p>
                    <div className="flex items-center gap-4">
                      <button
                        className="relative whitespace-nowrap inline-flex items-center justify-center text-gray-500 hover:text-indigo-600 font-bold gap-1"
                        onClick={handleSubmitForReview}
                      >
                        <PencilAltIcon className="h-6 w-6" aria-hidden="true" />
                        Submit for Review
                      </button>
                      {((isManager && selectedArticle?.approvedForPublishing) ||
                        !isManager) && (
                        <button
                          className="button gap-2"
                          id={selectedArticle?.id}
                          onClick={() => handleApproveFlow(selectedArticle)}
                        >
                          <CheckCircleIcon
                            className="h-6 w-6"
                            aria-hidden="true"
                          />
                          {isManager ? "Sent to publishing" : "Publish"}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="flex flex-col sm:grid grid-cols-3 gap-16">
              <div
                className={classNames(
                  "space-y-4",
                  selectedDraft ? "col-span-2" : "col-span-3"
                )}
              >
                {selectedDraft && (
                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap flex-row gap-2">
                      {allDocuments.map((draft, index) => {
                        return (
                          <div
                            key={draft.id}
                            onClick={() => setSelectedDraft(draft)}
                            className={classNames(
                              "flex flex-col rounded-full px-3 py-1 cursor-pointer border",
                              selectedDraft?.id == draft.id
                                ? " border-indigo-600 !text-indigo-600 bg-white"
                                : "bg-white/50  text-gray-500"
                            )}
                          >
                            <p className="text-md select-none capitalize">
                              {draft.type} {draft.number}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      className="button"
                      onClick={() =>
                        downloadURI(
                          selectedDraft.attributes.url,
                          selectedDraft.attributes.name
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
                    selectedDraft ? "w-[780px]" : "w-[1200px]"
                  )}
                  src={
                    selectedArticle?.googleDocUrl ||
                    `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                      selectedDraft?.attributes?.url
                    )}`
                  }
                  frameBorder="0"
                />
                <div className="flex justify-between mt-4">
                  <p>
                    <span className="">{selectedDraft?.attributes?.name}</span>
                    <br />
                    <span className="text-gray-500">
                      {selectedDraft?.attributes?.createdAt &&
                        moment(selectedDraft?.attributes?.createdAt).format(
                          "MMMM D, hh:mm a"
                        )}
                    </span>
                  </p>
                </div>
              </div>
              {selectedDraft && (
                <div>
                  <h3 className="text-xl">Comments</h3>
                  <div className="mt-4 space-y-2 overflow-scroll">
                    {messages.map((message, index) => {
                      return (
                        <div
                          key={index}
                          className="flex flex-col bg-white rounded-lg px-4 py-3 border"
                        >
                          <p className="text-lg font-bold text-gray-900 capitalize">
                            {
                              message.attributes?.profile?.data?.attributes
                                ?.name
                            }
                          </p>
                          <p className="text-md font-medium text-gray-500 capitalize">
                            {moment(message.attributes?.createdAt).format(
                              "MMMM D, hh:mm a"
                            )}
                          </p>
                          <p className="mt-2 text-lg font-medium text-gray-900 capitalize">
                            {message.attributes?.text}
                          </p>
                        </div>
                      );
                    })}
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <textarea
                        className="block w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        name="feedback"
                        rows="1"
                        ref={messageTextareaRef}
                        onChange={(e) => {
                          if (e.target.value.length > 0) {
                            setCanSendMessage(true);
                          } else {
                            setCanSendMessage(false);
                          }
                        }}
                        placeholder="Enter message here"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {canSendMessage && (
                          <button
                            className="flex gap-2 items-center text-indigo-700 font-bold"
                            onClick={handleSendMessage}
                          >
                            {/* <PaperAirplaneIcon className="h-5 w-5" aria-hidden="true" />  */}
                            Send
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
