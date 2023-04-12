import {
  ZoomInIcon,
  PencilAltIcon,
  ExternalLinkIcon,
  CheckCircleIcon,
  GlobeAltIcon,
  CalendarIcon,
} from "@heroicons/react/outline";
import classNames from "classnames";
import StatusLabel from "./statusLabel";
import DateHandler from "../lib/date-handler";
import MoonLoader from "react-spinners/MoonLoader";
import Link from "next/link";
import { useEffect } from "react";

export default function ArticleCard({
  article,
  isManager,
  handleApproveFlow,
  handleReviseFlow,
  handleCompleteFlow,
  purchasedPublication,
  index,
  isApprovedForPublishingByUser,
  isWrittenByUser,
  openArticleViewer,
  isLoading,
  handleGoogleDocFlow,
  handleWritingFlow,
  campaignId,
}) {
  const pressTeamReviewing = (status) => status == "reviewing";
  const requiresClientAction = (status) => status == "requires-action";
  const articleIsPublished = (status) => status == "completed";
  const awaitingPublishing = (status) => status == "publishing";

  const renderStatus = (status) => {
    if (pressTeamReviewing(status)) {
      return (
        <StatusLabel
          title={isManager ? "ACTION REQUIRED" : "PENDING REVIEW"}
          status={isManager ? 2 : 1}
        />
      );
    } else if (requiresClientAction(status)) {
      return (
        <StatusLabel
          title={isManager ? "PENDING CLIENT REVIEW" : "ACTION REQUIRED"}
          status={isManager ? 1 : 2}
        />
      );
    } else if (articleIsPublished(status)) {
      return <StatusLabel title={"COMPLETED"} status={0} />;
    } else if (awaitingPublishing(status)) {
      return <StatusLabel title={"PENDING PUBLISHING"} status={5} />;
    } else {
      return <StatusLabel title={"DRAFTING"} status={1} />;
    }
  };

  const ActionButtons = ({ draft }) => {
    if (draft || article.googleDocUrl) {
      return (
        <div className="flex justify-between items-center mt-4">
          <Link href={`/campaigns/${campaignId}/articles/${article.id}`}>
            <a href="#" className="flex flex-row gap-1">
              <ZoomInIcon className="h-6 w-6" aria-hidden="true" /> View
            </a>
          </Link>
          {articleIsPublished(article.status) && (
            <>
              {/* <button className="relative whitespace-nowrap inline-flex items-center justify-center text-gray-500 hover:text-indigo-600 font-bold gap-1" onClick={() => downloadURI(draft.attributes.article.url, draft.attributes.name)}><DownloadIcon className="h-6 w-6" aria-hidden="true" /> Download</button> */}
              {/* <button
                className="relative whitespace-nowrap inline-flex items-center justify-center text-gray-500 hover:text-indigo-600 font-bold gap-1"
                onClick={openArticleViewer}
              >
                <ZoomInIcon className="h-6 w-6" aria-hidden="true" /> View
              </button> */}

              <a href={article.url} target="_blank" rel="noreferrer">
                <button className="relative whitespace-nowrap inline-flex items-center justify-center text-green-500 hover:text-green-600 font-bold gap-1">
                  <ExternalLinkIcon
                    className="h-6 w-6 text-green-600 inline"
                    aria-hidden="true"
                  />
                  View Live Article
                </button>
              </a>

              {isManager && (
                <>
                  <button
                    className="relative whitespace-nowrap inline-flex items-center justify-center text-indigo-500 hover:text-indigo-600 font-bold gap-1"
                    onClick={handleCompleteFlow}
                  >
                    <PencilAltIcon className="h-6 w-6" aria-hidden="true" />
                    Update Live Url
                  </button>
                </>
              )}
            </>
          )}
          {/* <button className="relative whitespace-nowrap inline-flex items-center justify-center text-gray-500 hover:text-indigo-600 font-bold gap-1" onClick={() => downloadURI(draft.attributes.article.url, draft.attributes.name)}><DownloadIcon className="h-6 w-6" aria-hidden="true" /> Download</button> */}

          {((requiresClientAction(article.status) && !isManager) ||
            (pressTeamReviewing(article.status) && isManager)) && (
            <>
              {draft && (
                <button
                  className="relative whitespace-nowrap inline-flex items-center justify-center text-gray-500 hover:text-indigo-600 font-bold gap-1"
                  onClick={handleReviseFlow}
                >
                  <PencilAltIcon className="h-6 w-6" aria-hidden="true" />
                  Revise
                </button>
              )}

              {((isManager && isApprovedForPublishingByUser) || !isManager) && (
                <button
                  className="relative whitespace-nowrap inline-flex items-center justify-center text-indigo-600 hover:text-indigo-800 font-bold gap-1"
                  id={article.id}
                  onClick={handleApproveFlow}
                >
                  <CheckCircleIcon className="h-6 w-6" aria-hidden="true" />
                  {isManager ? "Sent to publishing" : "Publish"}
                </button>
              )}
            </>
          )}

          {awaitingPublishing(article.status) && isManager && (
            <>
              <button
                className="relative whitespace-nowrap inline-flex items-center justify-center text-green-500 hover:text-green-600 font-bold gap-1"
                onClick={handleCompleteFlow}
              >
                <CheckCircleIcon className="h-6 w-6" aria-hidden="true" />
                Complete
              </button>
            </>
          )}
        </div>
      );
    } else if (isManager) {
      return (
        <div className="flex justify-between items-center mt-4">
          {/* <button
            className="relative whitespace-nowrap inline-flex items-center justify-center text-gray-500 hover:text-indigo-600 font-bold gap-1"
            onClick={handleReviseFlow}
          >
            <PencilAltIcon className="h-6 w-6" aria-hidden="true" />
            Upload draft
          </button> */}

          <button
            className="relative whitespace-nowrap inline-flex items-center justify-center text-gray-500 hover:text-indigo-600 font-bold gap-1"
            onClick={handleGoogleDocFlow}
          >
            <PencilAltIcon className="h-6 w-6" aria-hidden="true" />
            Upload Google Doc
          </button>
          {!article.isWriting && !draft ? (
            <button
              className="relative whitespace-nowrap inline-flex items-center justify-center text-indigo-600 hover:text-indigo-800 font-bold gap-1"
              id={article.id}
              onClick={handleWritingFlow}
            >
              <CheckCircleIcon className="h-6 w-6" aria-hidden="true" />
              Sent to writing
            </button>
          ) : (
            <p className="text-indigo-600 hover:text-indigo-800 font-bold italic">
              Writing in Progress
            </p>
          )}
        </div>
      );
    } else {
      return (
        <div className="flex justify-between items-center mt-4">
          {article.isWriting && (
            <p className="text-indigo-600 hover:text-indigo-800 font-bold italic">
              Writing in Progress
            </p>
          )}
        </div>
      );
    }
  };

  useEffect(() => {
    // console.log("article...", article);
  });

  return (
    <div
      className={classNames(
        "p-6 rounded-2xl border bg-white relative space-y-2",
        //  (pressTeamReviewing(article.status) ||  status == "editing") && "bg-white",
        ((requiresClientAction(article.status) && !isManager) ||
          (pressTeamReviewing(article.status) && isManager)) &&
          "border-amber-300",
        articleIsPublished(article.status) && "border-green-500"
      )}
    >
      {isLoading && (
        <div className="absolute z-10 inset-0 w-full h-full flex items-center justify-center bg-black/10 rounded-2xl pointer-events-none select-none">
          <MoonLoader color={"#3B82F6"} loading={isLoading} size={20} />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <p className="capitalize font-bold text-gray-700 break-all">
            {article.name || `Article #${index + 1}`}
          </p>
        </div>

        {renderStatus(article.status)}
      </div>

      {article.draftCount > 0 && (
        <div>
          <p className="text-gray-600">Draft #{article.draftCount}</p>
        </div>
      )}
      <p className="text-gray-600">
        {purchasedPublication?.publication?.name}

        {/* {isApprovedForPublishingByUser && !isManager && `You have appproved for publishing`} */}
      </p>
      <div className="flex gap-2">
        {article.images?.length > 0 ? (
          <p className="apitalize text-sm text-gray-700 break-all">
            Photos: <b>{article.images.length}</b>
          </p>
        ) : (
          <p className="apitalize text-sm break-all text-amber-500 font-bold italic">
            Needs more images
          </p>
        )}
        {isWrittenByUser && !articleIsPublished(article.status) && (
          <p className="capitalize text-sm text-gray-700 break-all italic">
            Written by {isManager ? "Client" : "You"}
          </p>
        )}
        {isManager && (
          <>
            <p className="capitalize text-sm text-gray-700 break-all">
              Article ID: <b>{article.id}</b>
            </p>
            <p className="capitalize text-sm text-gray-700 break-all">
              Order Item ID: <b>{article?.purchasedPublication?.id}</b>
            </p>
          </>
        )}
      </div>

      <div>
        <p className="text-sm text-purple-600 font-bold">
          {isApprovedForPublishingByUser &&
            !articleIsPublished(article.status) && (
              <span>
                {isManager
                  ? `Approved for publishing by Client`
                  : `You have approved for publishing`}
              </span>
            )}
          {/* {isApprovedForPublishingByUser && !isManager && `You have appproved for publishing`} */}
        </p>

        {awaitingPublishing(article.status) && (
          <p className="text-sm text-purple-500">
            Est publish date:&nbsp;
            {purchasedPublication?.publication ? (
              <>
                {isManager ? (
                  <>
                    {DateHandler.calculateEarliestDueDate(
                      purchasedPublication?.publication?.turnaroundTime,
                      article?.approvalDate
                    )}
                  </>
                ) : (
                  <>
                    {DateHandler.calculateLatestDueDate(
                      purchasedPublication?.publication?.turnaroundTime,
                      article?.approvalDate
                    )}
                  </>
                )}
              </>
            ) : (
              "N/A"
            )}
          </p>
        )}
      </div>

      <div class="flex flex-row flex-wrap gap-2 sm:gap-4">
        {article.publishDate && (
          <p className="text-sm text-gray-600 flex flex-row gap-1 items-center">
            <GlobeAltIcon className="h-4 w-4" aria-hidden="true" />
            Published:{" "}
            <span className="">
              {DateHandler.formatDateByDay(article.publishDate)}
            </span>
          </p>
        )}

        {article.updatedAt && (
          <p className="text-sm text-gray-600 flex flex-row gap-1 items-center">
            <CalendarIcon className="h-4 w-4" aria-hidden="true" />
            Last Update:{" "}
            <span className="">
              {DateHandler.formatDateByDay(article.updatedAt)}
            </span>
          </p>
        )}
      </div>

      {articleIsPublished(article.status) && (
        <>
          <div className="w-full">
            <p className="text-sm font-medium text-gray-500 whitespace-pre-wrap break-words">
              Published Link:&nbsp;
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="text-green-600 font-bold cursor-pointer text-sm"
              >
                {article.url}{" "}
                <ExternalLinkIcon
                  className="h-4 w-4 text-green-600 inline"
                  aria-hidden="true"
                />
              </a>
            </p>
          </div>
        </>
      )}

      <div>
        {isLoading || (
          <ActionButtons
            draft={
              article.drafts?.length > 0
                ? article.drafts[article.drafts?.length - 1]
                : null
            }
          />
        )}
      </div>
      {pressTeamReviewing(article.status) && article.feedback && (
        <p className="text-red-500 italic mt-4">
          <span className="font-medium">Feedback:</span>
          <br />
          {article.feedback}
        </p>
      )}
    </div>
  );
}
