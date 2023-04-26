import Navbar from "@/components/navbar";
import {
  ArrowNarrowLeftIcon,
  DownloadIcon,
  UserIcon,
  ArrowCircleDownIcon,
  PencilAltIcon,
  CheckCircleIcon,
  GlobeIcon,
} from "@heroicons/react/outline";
import { getSession, useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import moment from "moment";
import MoonLoader from "react-spinners/MoonLoader";
import API from "@/lib/api";
import Link from "next/link";
import SiteWrapper from "@/components/siteWrapper";
import CampaignModel from "@/lib/models/campaign-model";
import StatusLabel from "@/components/statusLabel";
import DateHandler from "@/lib/date-handler";
import PhotoSidebar from "@/components/photo-sidebar";
import { downloadURI } from "@/lib/utils/generalUtils";
import {
  handleApprovalSubmit,
  submitForReview,
  requiresClientAction,
  articleIsPublished,
  renderStatus,
  DocumentViewer,
} from "@/lib/utils/articleUtils";
import ApprovalModal from "@/components/approvalModal";
import { useRouter } from "next/router";
import classNames from "classnames";

function Article({ initialCampaign, article, role, siteData }) {
  const { data: session } = useSession();
  const [campaign, setCampaign] = useState(initialCampaign);
  const [selectedArticle, setSelectedArticle] = useState(article[0]);
  const [selectedDraft, setSelectedDraft] = useState();
  const [openPhotos, setOpenPhotos] = useState(false);
  const [list, updateList] = useState([]);
  const [isApproving, setIsApproving] = useState(false);
  const router = useRouter();

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

    const mostRecentDocument =
      documents[documents.length > 0 ? documents.length - 1 : 0];
    setSelectedDraft(mostRecentDocument);
  }, [selectedArticle]);

  const displaySidebar = () => {
    setOpenPhotos(true);
  };

  const isManager = role === "Manager";

  const handleApprovalAction = async (e) => {
    e.preventDefault();

    const agreedToTerms = e.target.agreedToTerms.checked;

    if (!agreedToTerms) {
      alert("You must agree to the terms and conditions to continue.");
      return;
    }

    await handleApprovalSubmit(selectedArticle);
    setSelectedArticle({
      ...selectedArticle,
      status: "reviewing",
      approvedForPublishing: true,
    });
    setIsApproving(false);
  };

  const handleSubmitForReview = async (e) => {
    e.preventDefault();

    await submitForReview(selectedArticle);
    setSelectedArticle({
      ...selectedArticle,
      status: "reviewing",
    });
  };

  return (
    <SiteWrapper siteData={siteData}>
      <PhotoSidebar
        open={openPhotos}
        setOpen={setOpenPhotos}
        selectedArticle={selectedArticle}
        site_id={siteData?.id}
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
              {selectedArticle?.name
                ? selectedArticle.name
                : `Article: ${selectedArticle.id}`}
            </h2>

            {/* <div className="flex flex-row gap-1 items-center bg-[#FEF3F2] px-[12px] py-[8px] rounded-lg text-[#B42318] h-[32px]">
                <span className="rounded-full w-[5px] h-[5px] block bg-[#F04438]"></span>
                <span>2</span>
              </div> */}

            <div className="flex flex-row items-center gap-4">
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

                <button
                  className={classNames(
                    "button-secondary",
                    selectedArticle.images?.length > 0 ||
                      "!border-amber-500 hover:bg-amber-500 !text-amber-700 hover:!text-white"
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
                  {selectedArticle.images?.length > 0
                    ? `Photos (${selectedArticle.images.length})`
                    : "Upload Photos"}
                </button>
                {selectedArticle?.googleDocUrl &&
                  requiresClientAction(selectedArticle?.status) && (
                    <button
                      className="relative whitespace-nowrap inline-flex items-center justify-center text-gray-500 hover:text-indigo-600 font-bold gap-1"
                      onClick={handleSubmitForReview}
                    >
                      <PencilAltIcon className="h-6 w-6" aria-hidden="true" />
                      Request Review
                    </button>
                  )}
                {requiresClientAction(selectedArticle.status) && (
                  <button
                    className="relative whitespace-nowrap inline-flex items-center justify-center text-indigo-600 hover:text-indigo-800 font-bold gap-1"
                    id={selectedArticle.id}
                    onClick={() => setIsApproving(true)}
                  >
                    <CheckCircleIcon className="h-6 w-6" aria-hidden="true" />
                    {isManager ? "Sent to publishing" : "Publish"}
                  </button>
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

          <div className="flex flex-row items-center gap-4 border-b border-gray-200 pb-4 mb-4 flex-wrap">
            {selectedArticle.draftCount > 0 ? (
              <p className="text-gray-600">
                Draft #{selectedArticle.draftCount}
              </p>
            ) : (
              <p className="text-amber-600 italic font-bold">Drafting</p>
            )}
            <p className="text-primary font-bold">
              {selectedArticle?.purchasedPublication?.publication?.name}

              {/* {isApprovedForPublishingByUser && !isManager && `You have appproved for publishing`} */}
            </p>
            <p className="text-sm text-gray-600 flex flex-row gap-1 items-center">
              <UserIcon className="h-4 w-4 text-gray-600" aria-hidden="true" />
              By{" "}
              <b>
                {selectedArticle.isWrittenByUser
                  ? "You"
                  : `${siteData.attributes.name} Team`}
              </b>
              {/* {isApprovedForPublishingByUser && !isManager && `You have appproved for publishing`} */}
            </p>
            <div>
              {/* <img
                    className="h-[32px] flex-none object-contain"
                    src={
                      selectedArticle?.purchasedPublication?.publication.logo
                        ?.attributes?.url
                    }
                  /> */}
            </div>

            {renderStatus(selectedArticle.status, isManager)}

            {selectedArticle?.approvedForPublishing &&
              !articleIsPublished(selectedArticle.status) && (
                <StatusLabel
                  title={
                    isManager
                      ? "Approved for publishing by Client"
                      : "You have approved for publishing"
                  }
                  status={isManager ? 1 : 2}
                />
              )}
            {selectedArticle.updatedAt && (
              <p className="text-sm text-gray-500 flex flex-row gap-1 items-center">
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
                <b>{DateHandler.formatDateByDay(selectedArticle.updatedAt)}</b>
              </p>
            )}
            <p className="text-gray-500">ID: {selectedArticle?.id}</p>
          </div>

          {/* <div class="flex flex-row justify-between items-center gap-4 border-t border-gray-200 py-4">
                <div className="flex flex-row gap-4">
                  <div class="flex flex-row items-center gap-1 rounded-full p-2 bg-white h-[56px]">
                    <button className="button-secondary !border-0 bg-blue-100 text-blue-700 !py-4 !px-6 h-[36px]">
                      View Article
                    </button>
                    <button className="button-secondary !border-0 bg-transparent !text-gray-600 hover:!text-white !py-4 !px-6 h-[36px]">
                      Upload Photos
                    </button>
                  </div>
                </div>
              </div> */}
        </div>

        <div className="flex flex-col border-t border-gray-200 pt-4">
          <DocumentViewer
            selectedArticle={selectedArticle}
            selectedDraft={selectedDraft}
          />
        </div>
        <ApprovalModal
          confirmAction={handleApprovalAction}
          setIsOpen={setIsApproving}
          isOpen={isApproving}
        />
      </div>
    </SiteWrapper>
  );
}

export const getServerSideProps = async (context) => {
  const { query, req, params } = context;
  const { id, article_id } = query;
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/login?return_url=/campaigns/${id}/articles/${article_id}`,
        permanent: false,
      },
    };
  }

  const { site } = params;
  let siteData;

  if (site.includes(".")) {
    siteData = await API.sites.get({ customDomain: site });
  } else {
    siteData = await API.sites.get({ subdomain: site });
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

  //TODO: ENABLE THIS WHEN TESTING IS OVER
  if (session.profile?.id !== initialCampaign?.profile?.id) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  const JSONSerializedCampaign = JSON.parse(JSON.stringify(initialCampaign));
  const Article = JSONSerializedCampaign.articles.filter(
    (a) => a.id == query.article_id
  );

  return {
    props: {
      initialCampaign: JSONSerializedCampaign,
      article: Article,
      role: session.role,
      siteData,
    },
  };
};

export default Article;
