import {
  ArrowNarrowLeftIcon,
  DownloadIcon,
  PencilAltIcon,
  CheckCircleIcon,
  UserIcon,
  ArrowCircleDownIcon,
  MinusCircleIcon,
  GlobeIcon,
} from "@heroicons/react/outline";
import { getSession, useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import RevisionModal from "@/components/revisionModal";
import moment from "moment";
import MoonLoader from "react-spinners/MoonLoader";
import API from "@/lib/api";
import Link from "next/link";
import Navbar from "@/components/navbar";

import CampaignModel from "@/lib/models/campaign-model";
import StatusLabel from "@/components/statusLabel";
import DateHandler from "@/lib/date-handler";
import PhotoSidebar from "@/components/photo-sidebar";
import { downloadURI } from "@/lib/utils/generalUtils";
import classNames from "classnames";

import {
  handleApprovalSubmit,
  submitForReview,
  requiresClientAction,
  articleIsPublished,
  renderStatus,
  sentToPublishing,
  awaitingPublishing,
  completeArticle,
  pressTeamReviewing,
  DocumentViewer,
} from "@/lib/utils/articleUtils";
import CompleteModal from "@/components/completeModal";
import { useRouter } from "next/router";
import { uploadRevisedArticle } from "../../../../../lib/utils/articleUtils";

function Article({ initialCampaign, article, role }) {
  const [openCart, setOpenCart] = useState(false);
  const [campaign, setCampaign] = useState(initialCampaign);
  const [selectedArticle, setSelectedArticle] = useState(article[0]);
  const [draft, setDraft] = useState(
    article[0].drafts?.length > 0
      ? article[0].drafts[article[0].drafts?.length - 1]
      : null
  );
  const [isApprovedForPublishingByUser, setApprovedForPublishingByUser] =
    useState(article[0]?.approvedForPublishing);
  const [selectedDraft, setSelectedDraft] = useState();
  const [isRevising, setIsRevising] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const articleUrlFieldRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    console.log("article", article);
    console.log("selectedArticle", selectedArticle);
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

    setSelectedDraft(
      documents[documents.length > 0 ? documents.length - 1 : 0]
    );
  }, [selectedArticle]);
  const downloadURI = (uri, name) => {
    var link = document.createElement("a");
    link.download = name;
    link.href = `${uri}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleReviseFlow = () => {
    // setSelectedArticle(article);
    setIsRevising(true);
  };
  const [files, setFiles] = useState();
  const feedbackRef = useRef(null);
  const approvedForPublishingRef = useRef(null);
  const { data: session } = useSession();
  const isManager = role === "Manager";
  const handleRevisedArticle = async (e) => {
    e.preventDefault();

    if (files && files.length == 0) {
      alert("Please upload a file");
      return;
    }
    const feedback = feedbackRef.current.value;

    const updatedArticle = await uploadRevisedArticle(
      selectedArticle,
      files[0],
      feedback
    );

    setSelectedArticle(updatedArticle);

    setFiles([]);

    setIsRevising(false);
  };

  const handleSendToPublishing = async (article) => {
    await sentToPublishing(selectedArticle);
    setIsApproving(false);
    setSelectedArticle({
      ...selectedArticle,
      status: "publishing",
    });
  };

  const displaySidebar = () => {
    setOpenCart(true);
  };

  const submitArticleUrl = async (e) => {
    e.preventDefault();
    const url = articleUrlFieldRef.current.value;
    await completeArticle(selectedArticle, url);
    setSelectedArticle({
      ...selectedArticle,
      status: "completed",
      url: url,
    });
    setIsCompleting(false);
  };

  const handleSubmitForReview = async (e) => {
    e.preventDefault();

    submitForReview(selectedArticle, isManager);

    setSelectedArticle({
      ...selectedArticle,
      status: "requires-action",
    });
  };

  return (
    <>
      <Navbar isManager={true} />
      <PhotoSidebar
        open={openCart}
        setOpen={setOpenCart}
        selectedArticle={selectedArticle}
        isManager={isManager}
      />

      <div className="min-h-full py-12 px-4 sm:px-6 lg:px-8 h-full max-w-7xl mx-auto">
        <div className="space-y-4">
          {/* <div className="flex">
            <a
              className="flex items-center gap-2 text-gray-500"
              onClick={() => router.back()}
            >
              <ArrowNarrowLeftIcon
                className="block h-6 w-6"
                aria-hidden="true"
              />

              <p className="font-bold">Back</p>
            </a>
          </div> */}
          <div className="flex flex-row items-start gap-4 w-full flex-wrap justify-between">
            <h2 className="text-4xl font-medium text-gray-900 capitalize whitespace-pre-wrap break-words max-w-full lg:max-w-[67%]">
              {selectedArticle?.name || `Article ${selectedArticle?.id}`}
            </h2>
            {/* <div className="flex flex-row gap-1 items-center bg-[#FEF3F2] px-[12px] py-[8px] rounded-lg text-[#B42318] h-[32px]">
              <span className="rounded-full w-[5px] h-[5px] block bg-[#F04438]"></span>
              <span>2</span>
            </div> */}

            <div className="flex flex-row items-center gap-4 justify-end flex-shrink-0 ">
              <div className="flex gap-4 justify-between items-center">
                {selectedDraft && (
                  <button
                    className="button-secondary"
                    onClick={() =>
                      downloadURI(
                        selectedDraft.attributes.url,
                        selectedDraft.attributes.name
                      )
                    }
                  >
                    <DownloadIcon className="h-6 w-6" aria-hidden="true" />{" "}
                  </button>
                )}
                {draft && !selectedArticle.url && (
                  <button
                    className="button-secondary"
                    onClick={handleReviseFlow}
                  >
                    <PencilAltIcon className="h-6 w-6" aria-hidden="true" />
                    Revise
                  </button>
                )}
                <button
                  className={classNames(
                    "button-secondary",
                    selectedArticle.images?.length > 0 ||
                      "!border-amber-500 hover:bg-amber-500"
                  )}
                  onClick={displaySidebar}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6 mr-1"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>

                  <span>
                    Photos (
                    {selectedArticle.images ? selectedArticle.images.length : 0}
                    )
                  </span>
                </button>
                {selectedArticle?.googleDocUrl &&
                  pressTeamReviewing(selectedArticle?.status) && (
                    <button
                      className="relative whitespace-nowrap inline-flex items-center justify-center text-gray-500 hover:text-indigo-600 font-bold gap-1"
                      onClick={handleSubmitForReview}
                    >
                      <PencilAltIcon className="h-6 w-6" aria-hidden="true" />
                      Submit for Review
                    </button>
                  )}
                {pressTeamReviewing(selectedArticle.status) &&
                  isApprovedForPublishingByUser && (
                    <button
                      className="button"
                      id={selectedArticle?.id}
                      onClick={handleSendToPublishing}
                    >
                      <CheckCircleIcon className="h-6 w-6" aria-hidden="true" />
                      &nbsp;Publish
                    </button>
                  )}

                {awaitingPublishing(selectedArticle.status) && isManager && (
                  <>
                    <button
                      className="button !from-green-500 !to-green-600"
                      onClick={() => setIsCompleting(true)}
                    >
                      <CheckCircleIcon className="h-6 w-6" aria-hidden="true" />
                      &nbsp;Complete
                    </button>
                  </>
                )}

                {selectedArticle?.url && (
                  <a
                    href={selectedArticle?.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <button
                      className="button !from-green-500 !to-green-600"
                      id={selectedArticle?.id}
                    >
                      <GlobeIcon className="h-6 w-6" aria-hidden="true" />
                      &nbsp;View Live
                    </button>
                  </a>
                )}
              </div>
            </div>
          </div>
          <div class="flex flex-row justify-between w-full">
            <div class="flex flex-col grow gap-4">
              <div className="flex flex-row items-center gap-4 flex-wrap">
                <p className="text-primary font-bold">
                  {selectedArticle?.purchasedPublication?.publication?.name}

                  {/* {isApprovedForPublishingByUser && !isManager && `You have appproved for publishing`} */}
                </p>
                <p className="text-gray-600 text-sm">
                  Client <b>{campaign?.profile?.name}</b>
                  {/* {isApprovedForPublishingByUser && !isManager && `You have appproved for publishing`} */}
                </p>
                <p className="text-sm text-gray-600 flex flex-row gap-1 items-center">
                  <UserIcon
                    className="h-4 w-4 text-gray-600"
                    aria-hidden="true"
                  />
                  By{" "}
                  <b>
                    {selectedArticle.isWrittenByUser ? "Client" : `Our Team`}
                  </b>
                  {/* {isApprovedForPublishingByUser && !isManager && `You have appproved for publishing`} */}
                </p>

                {selectedArticle.draftCount > 0 && (
                  <p className="text-gray-600">
                    Draft #{selectedArticle.draftCount}
                  </p>
                )}
                {renderStatus(selectedArticle.status, isManager)}
                {selectedArticle?.approvedForPublishing &&
                  !articleIsPublished(selectedArticle.status) && (
                    <StatusLabel
                      title={
                        isManager
                          ? "Approved for publishing by Client"
                          : "You have approved for publishing"
                      }
                      status={isManager ? 2 : 1}
                    />
                  )}
                {selectedArticle.updatedAt && (
                  <p className="text-sm text-gray-600 flex flex-row gap-1 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="h-6 w-6 text-gray-500"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                      />
                    </svg>{" "}
                    Last Update{" "}
                    <b>
                      {DateHandler.formatDateByDay(selectedArticle.updatedAt)}
                    </b>
                  </p>
                )}
                <p className="text-gray-500">ID: {selectedArticle?.id}</p>
              </div>
              <div class="flex flex-row justify-between items-center gap-4 border-t border-gray-200 py-4">
                {/* <div className="flex flex-row gap-4">
                  <div class="flex flex-row items-center gap-1 rounded-full p-2 bg-white h-[48px]">
                    <button className="button-secondary !border-0 bg-blue-100 text-blue-700 !py-4 !px-6 h-[36px]">
                      View Article
                    </button>
                    <button className="button-secondary !border-0 bg-transparent !text-gray-600 hover:!text-white !py-4 !px-6 h-[36px]">
                      Upload Photos
                    </button>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <DocumentViewer
            selectedArticle={selectedArticle}
            selectedDraft={selectedDraft}
          />
        </div>
      </div>
      <RevisionModal
        isUpload={isManager && selectedArticle?.draftCount === 0}
        isManager={isManager}
        uploadRevisedArticle={handleRevisedArticle}
        files={files}
        setFiles={setFiles}
        approvedForPublishingRef={approvedForPublishingRef}
        feedbackRef={feedbackRef}
        selectedArticle={selectedArticle}
        setIsOpen={setIsRevising}
        isOpen={isRevising}
      />
      <CompleteModal
        submitArticleUrl={submitArticleUrl}
        articleUrlFieldRef={articleUrlFieldRef}
        selectedArticle={selectedArticle}
        setIsOpen={setIsCompleting}
        isOpen={isCompleting}
      />
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { query, req, params } = context;
  const { id, article_id } = query;
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/login?return_url=/app/campaigns/${id}/articles/${article_id}`,
        permanent: false,
      },
    };
  }

  let initialCampaign = await API.campaigns
    .findOne(id, session)
    .then(function (result) {
      const campaign = new CampaignModel(result.data?.data);
      return campaign;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

  if (
    session.role !== "Manager" &&
    session.profile?.id !== initialCampaign?.profile?.id
  ) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  const JSONSerializedCampaign = JSON.parse(JSON.stringify(initialCampaign));
  const article = JSONSerializedCampaign.articles.filter(
    (a) => a.id == query.article_id
  );

  return {
    props: {
      initialCampaign: JSONSerializedCampaign,
      article,
      role: session.role,
    },
  };
};

export default Article;
