import Navbar from "@/components/navbar";
import {
  DocumentTextIcon,
  ClockIcon,
  ArrowNarrowLeftIcon,
  CheckCircleIcon,
  PlusIcon,
} from "@heroicons/react/outline";
import { getSession, useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import RevisionModal from "@/components/revisionModal";
import CompleteModal from "@/components/completeModal";
import moment from "moment";

import MoonLoader from "react-spinners/MoonLoader";
import API from "@/lib/api";
import { useRouter } from "next/router";

import ArticleCard from "@/components/article-card";
import Link from "next/link";
import DocViewerModal from "@/components/docViewerModal";
import DocViewerModalQuestionnaire from "@/components/docViewerModalQuestionnaire";
import StatusHandler from "@/lib/status-handler";
import MessageList from "@/components/messageList";

import StatusLabel from "@/components/statusLabel";
import CampaignManager from "@/lib/campaignManager";
import SiteWrapper from "@/components/siteWrapper";
import AlertMessage from "@/components/alertMessage";
import AddArticlesOptions from "@/components/campaign/addArticlesOptions";
import UploadImagesBox from "@/components/article/uploadImagesBox";
import ImageGallery from "@/components/imageGallery";
import Modal from "@/components/modal";
import CampaignModel from "@/lib/models/campaign-model";

import GoogleDocUpload from "@/components/article/googleDocUpload";

import DropdownOptions from "@/components/campaign/dropdownOptions";
import { sentToPublishing, completeArticle } from "@/lib/utils/articleUtils";
function Example({ initialCampaign, role }) {
  const router = useRouter();
  const campaignId = router.query.id;

  const [campaign, setCampaign] = useState(initialCampaign);

  const [files, setFiles] = useState();
  const [images, setImages] = useState();
  const [articles, setArticles] = useState([]);

  const [selectedArticle, setSelectedArticle] = useState();
  const [isRevising, setIsRevising] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const [isApproving, setIsApproving] = useState(false);
  const [isAddingGoogleDoc, setIsAddingGoogleDoc] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmittingForReview, setIsSubmittingForReview] = useState(false);
  const [hasArticlesForReview, setHasArticlesForReview] = useState(false);
  const [allArticlesReviewed, setAllArticlesReviewed] = useState(false);
  const [isViewingArticle, setIsViewingArticle] = useState(false);
  const [isViewingQuestionnaire, setIsViewingQuestionnaire] = useState(false);
  const [articleMessages, setArticleMessages] = useState([]);
  const [openAddArticlesOptions, setOpenAddArticlesOptions] = useState(false);

  const [messages, setMessages] = useState([]);

  const feedbackRef = useRef(null);
  const approvedForPublishingRef = useRef(null);
  const articleUrlFieldRef = useRef(null);
  const messageTextareaRef = useRef(null);
  const googleDocFieldRefUrl = useRef(null);

  const { data: session } = useSession();

  const isManager = role === "Manager";

  useEffect(() => {
    campaign?.articles?.filter((article) => {
      if (article.status === "requires-action") {
        setHasArticlesForReview(true);
        return true;
      }
    });
  }, []);

  useEffect(() => {
    //remove canceled articles from campaign
    const filteredArticles = campaign?.articles?.filter((article) => {
      return article?.purchasedPublication?.status !== "canceled";
    });
    setArticles(filteredArticles);
  }, [campaign]);

  useEffect(() => {
    if (!session) {
      return;
    }

    async function getMessages() {
      let messages = [];

      messages = await API.messages
        .getMessagesForCampaignsForManager([campaign?.id], session)
        .then(function (result) {
          return result.data?.data;
          // setMessages(sortedMessages)
        })
        .catch(function (error) {
          console.log(error);
          return [];
        });

      setMessages(messages);
    }

    getMessages();
  }, [session, isManager, campaign]);

  useEffect(() => {
    if (campaign?.status === "reviewing") {
      const allArticlesReviewed = articles.every((article) => {
        return (
          article.status === "requires-action" ||
          article.status === "publishing" ||
          article.status === "completed"
        );
      });
      allArticlesReviewed && setAllArticlesReviewed(true);
    } else {
      setAllArticlesReviewed(false);
    }
  }, [campaign, isManager]);

  useEffect(() => {
    if (selectedArticle?.id) {
      API.messages
        .getMessagesForArticle(selectedArticle?.id, session)
        .then((response) => {
          // console.log(response.data?.data)
          setArticleMessages(response.data?.data);
        });
    } else {
      setArticleMessages([]);
    }
  }, [selectedArticle, session]);

  const setCampaignAsPending = () => {
    const updateReviewStatusData = { status: "pending" };
    API.campaigns
      .update(campaign?.id, updateReviewStatusData, session)
      .then(function (result) {
        return API.campaigns.findOne(campaign?.id, session);
      })
      .then(function (result) {
        let campaign = new CampaignModel(result.data?.data);
        setCampaign(campaign);
        setIsSubmittingForReview(false);
        return;
      })
      .catch((err) => {
        console.log(err);
        setIsSubmittingForReview(false);
        return;
      });
  };

  const handleSubmitGoogleDoc = (e) => {
    e.preventDefault();
    const google_doc_url = googleDocFieldRefUrl.current.value;
    const data = { google_doc_url, status: "requires-action", draftCount: 1 };
    const id = selectedArticle.id;

    API.articles.update(id, data).then(function (result) {
      return API.campaigns
        .findOne(campaign?.id, session)
        .then(function (result) {
          if (result.data?.data) {
            let campaign = new CampaignModel(result.data?.data);
            setCampaign(campaign);
          }
        })
        .catch((err) => {
          console.log(err);
          return null;
        });
    });
    setIsAddingGoogleDoc(false);
  };

  const setCampaignAsComplete = () => {
    const updateReviewStatusData = { status: "completed" };
    API.campaigns
      .update(campaign?.id, updateReviewStatusData, session)
      .then(function (result) {
        return API.campaigns.findOne(campaign?.id, session);
      })
      .then(function (result) {
        let campaign = new CampaignModel(result.data?.data);
        setCampaign(campaign);
        setIsSubmittingForReview(false);
        return;
      })
      .catch((err) => {
        console.log(err);
        setIsSubmittingForReview(false);
        return;
      });
  };
  const submitForReview = () => {
    setIsSubmittingForReview(true);
    //check if we can mark campaign as ready for CLIENT review
    if (campaign?.status !== "requires-action") {
      //check if articles are ready for client review

      let reviewCount = campaign?.reviewCount || 0;
      reviewCount++;

      const updateReviewStatusData = { status: "requires-action", reviewCount };
      API.campaigns
        .update(campaign?.id, updateReviewStatusData, session)
        .then(function (result) {
          return API.campaigns.findOne(campaign?.id, session);
        })
        .then(function (result) {
          let campaign = new CampaignModel(result.data?.data);
          setCampaign(campaign);
          setIsSubmittingForReview(false);
          return;
        })
        .catch((err) => {
          console.log(err);
          setIsSubmittingForReview(false);
          return;
        });
    }
  };

  const downloadURI = (uri, name) => {
    var link = document.createElement("a");
    link.download = name;
    link.href = `${uri}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const uploadRevisedArticle = async (e) => {
    e.preventDefault();
    const id = e.target.id;

    const feedback = feedbackRef.current.value;

    let draftCount = selectedArticle?.draftCount || 0;
    draftCount++;

    let data = { id, feedback, draftCount };
    data.status = "requires-action";

    if (files && files.length > 0) {
      const formData = new FormData();
      formData.append("files", files[0]);
      formData.append("ref", "api::article.article");
      formData.append("refId", id);
      formData.append("field", "drafts");

      data.formData = formData;
    }

    API.articles
      .revise(data, session)
      .then(function (result) {
        if (feedback) {
          return API.messages.create(
            {
              text: feedback,
              campaign: campaign?.id,
              article: selectedArticle?.id,
              profile: session.profile?.id,
              is_from_client: false,
              type: "comment",
            },
            session
          );
        } else {
          return;
        }
      })
      .then(function (messageResult) {
        return API.campaigns
          .findOne(campaign?.id, session)
          .then(function (result) {
            let campaign = new CampaignModel(result.data?.data);
            setCampaign(campaign);
            setFiles([]);
            setFeedback("");
          })
          .catch((err) => {
            console.log(err);
            return null;
          });
      });
    setIsRevising(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const text = messageTextareaRef.current.value;

    if (text) {
      API.messages
        .create(
          {
            text,
            campaign: campaign?.id,
            article: selectedArticle?.id,
            profile: session.profile?.id,
            is_from_client: false,
            type: "comment",
          },
          session
        )
        .then(function (result) {
          return API.messages
            .getMessagesForArticle(selectedArticle?.id, session)
            .then(function (result) {
              setArticleMessages(result.data?.data);
              messageTextareaRef.current.value = "";
            })
            .catch((err) => {
              console.log(err);
              return null;
            });
        });
    }
  };

  const submitArticleUrl = async (e) => {
    e.preventDefault();
    const url = articleUrlFieldRef.current.value;

    await completeArticle(selectedArticle, url);
    await API.campaigns.findOne(campaign?.id, session).then(function (result) {
      if (result.data?.data) {
        let campaign = new CampaignModel(result.data?.data);
        setCampaign(campaign);
      }
    });

    setIsCompleting(false);
  };

  const handleApproveFlow = async (article) => {
    await sentToPublishing(article);

    await API.campaigns.findOne(campaign?.id, session).then(function (result) {
      if (result.data?.data) {
        let campaign = new CampaignModel(result.data?.data);
        setCampaign(campaign);
      }
    });

    setIsApproving(false);
  };

  const handleWritingFlow = (article) => {
    const data = { is_writing: true };
    const articleId = article.id;
    API.articles.update(articleId, session, data).then(function (result) {
      return API.campaigns
        .findOne(campaign?.id, session)
        .then(function (result) {
          if (result.data?.data) {
            let campaign = new CampaignModel(result.data?.data);
            setCampaign(campaign);
          }
        })
        .catch((err) => {
          console.log(err);
          return null;
        });
    });
  };

  const handleSubmitForReview = async (e) => {
    e.preventDefault();
    setIsViewingArticle(false);

    const id = selectedArticle?.id;

    let draftCount = selectedArticle?.draftCount || 0;
    draftCount++;

    let data = { id, draftCount };
    isManager ? (data.status = "requires-action") : (data.status = "reviewing");

    API.articles.revise(data, session).then(function (result) {
      return API.campaigns
        .findOne(campaignId, session)
        .then(function (result) {
          let campaign = new CampaignModel(result.data?.data);
          setCampaign(campaign);
        })
        .catch((err) => {
          console.log(err);
          return null;
        });
    });
  };

  const deleteCampaign = async () => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      API.campaigns
        .delete(campaignId, session)
        .then(function (result) {
          router.push("/dashboard");
        })
        .catch((err) => {
          console.log(err);
          return null;
        });
    }
  };

  const handleDropdownOption = (option) => {
    if (option === "delete") {
      deleteCampaign();
    }
  };

  const deleteImage = async (e, id) => {
    e.preventDefault();
    API.campaigns
      .deleteImage(id, session)
      .then(function (result) {
        return API.campaigns
          .findOne(campaignId, session)
          .then(function (result) {
            if (result.data?.data) {
              let campaign = new CampaignModel(result.data?.data);
              setCampaign(campaign);
            }
            return;
          });
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

  const checkIfEnoughImages = ({ justUploadedImage = false }) => {
    let publishedArticleCount =
      campaign?.articles.filter((article) => {
        return (
          article?.status === "publishing" || article?.status === "completed"
        );
      }).length || 0;

    let imagesCount = campaign?.images?.length || 0;
    if (justUploadedImage) {
      imagesCount++;
    }
    return imagesCount > publishedArticleCount;
  };

  const uploadImage = async (e) => {
    console.log("e...", e);
    e.preventDefault();
    const files = e.target.files;
    const formData = new FormData();

    console.log({ campaign, files: files[0] });
    formData.append("files", files[0]);
    formData.append("ref", "api::campaign.campaign");
    formData.append("refId", campaignId);
    formData.append("field", "images");
    setIsUploadingImage(true);

    API.campaigns
      .uploadFiles(formData, session)
      .then(function (result) {
        if (checkIfEnoughImages({ justUploadedImage: true })) {
          const updateReviewStatusData = {
            has_enough_images: true,
          };
          return API.campaigns.update(
            campaignId,
            updateReviewStatusData,
            session
          );
        } else {
          return;
        }
      })
      .then(function (result) {
        return API.campaigns.findOne(campaignId, session);
      })
      .then(function (result) {
        if (result.data?.data) {
          setIsUploadingImage(false);
          let campaign = new CampaignModel(result.data?.data);
          setCampaign(campaign);
        }
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

  return (
    <>
      <Navbar isManager={true} />
      <div className="min-h-full py-12 px-4 sm:px-6 lg:px-8 h-full max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b pb-14 border-indigo-100">
          <div>
            <a
              className="flex items-center gap-2 text-gray-500 cursor-pointer"
              onClick={() => router.back()}
            >
              <ArrowNarrowLeftIcon
                className="block h-6 w-6"
                aria-hidden="true"
              />

              <p className="font-bold">Back</p>
            </a>

            <div>
              <div className="mt-6 flex items-center gap-2">
                <h2 className="text-3xl font-extrabold text-gray-900 capitalize">
                  {campaign?.name}
                </h2>
                <div className="flex-none">
                  {StatusHandler.renderStatus(campaign?.status, isManager)}
                </div>
              </div>
              <p className="italic text-gray-600">
                Last update:{" "}
                <span className="font-bold">
                  {moment(campaign?.updatedAt).format("MMM Do hh:mm a")}
                </span>
              </p>

              <p className="mt-2 text-lg font-bold text-gray-500 capitalize">
                {campaign?.profile?.name}
              </p>

              {campaign?.questionnaire && (
                <>
                  <div
                    className="flex items-center cursor-pointer pt-2 gap-1"
                    onClick={() => {
                      setIsViewingQuestionnaire(true);
                    }}
                  >
                    <DocumentTextIcon
                      className="h-6 w-6 text-gray-400"
                      aria-hidden="true"
                    />

                    <a className="text-gray-700 font-medium">
                      View My Questionnaire
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end items-center gap-4">
            {articles.length > 0 && (
              <div
                className="button large gap-2"
                onClick={() => setOpenAddArticlesOptions(true)}
              >
                <PlusIcon className="h-4 w-4 text-white" />
                <p>Add More articles</p>
              </div>
            )}

            <DropdownOptions handleOption={handleDropdownOption} />
          </div>
        </div>

        <div className="flex flex-col sm:grid grid-cols-3 gap-16 mt-6 ">
          <div className="space-y-4 col-span-2 w-full">
            <h3 className="text-4xl">Articles</h3>

            {allArticlesReviewed && (
              <div className="flex gap-4">
                <button
                  className="button w-full"
                  disabled={isSubmittingForReview}
                  onClick={() => submitForReview()}
                >
                  {isSubmittingForReview ? (
                    <MoonLoader size={20} color={"#fff"} />
                  ) : (
                    "Submit to Client for Review"
                  )}
                </button>

                <>
                  <button
                    className="button-secondary w-full"
                    disabled={isSubmittingForReview}
                    onClick={() => setCampaignAsPending()}
                  >
                    {isSubmittingForReview ? (
                      <MoonLoader size={20} color={"#fff"} />
                    ) : (
                      <span className="flex gap-2">
                        Mark as Publishing <img src="/diamond.svg" />
                      </span>
                    )}
                  </button>
                  <button
                    className="button-secondary w-full"
                    disabled={isSubmittingForReview}
                    onClick={() => setCampaignAsComplete()}
                  >
                    {isSubmittingForReview ? (
                      <MoonLoader size={20} color={"#fff"} />
                    ) : (
                      <span className="flex gap-2 items-center">
                        Mark as Complete <CheckCircleIcon className="h-4 w-4" />{" "}
                      </span>
                    )}
                  </button>
                </>
              </div>
            )}

            <div className="">
              <div className="w-full">
                <div className="space-y-4">
                  {articles.length > 0 ? (
                    articles.map((article, index) => (
                      <ArticleCard
                        article={article}
                        campaignId={campaignId}
                        key={article.id}
                        index={index}
                        isManager={isManager}
                        purchasedPublication={article?.purchasedPublication}
                        handleApproveFlow={() => handleApproveFlow(article)}
                        handleWritingFlow={() => handleWritingFlow(article)}
                        handleReviseFlow={() => {
                          setSelectedArticle(article);
                          setIsRevising(true);
                        }}
                        handleCompleteFlow={() => {
                          setSelectedArticle(article);
                          setIsCompleting(true);
                        }}
                        isApprovedForPublishingByUser={
                          article?.approvedForPublishing
                        }
                        isWrittenByUser={article?.isWrittenByUser}
                        openArticleViewer={() => {
                          setSelectedArticle(article);
                          setIsViewingArticle(true);
                        }}
                        handleGoogleDocFlow={() => {
                          setSelectedArticle(article);
                          setIsAddingGoogleDoc(true);
                        }}
                      />
                    ))
                  ) : (
                    <div className="flex items-start justify-center bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex-shrink-0">
                        <ClockIcon
                          className="h-6 w-6 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-600 font-bold">
                          Your articles are in progress
                        </p>
                        <p>
                          You’ll get notified when the drafts are ready for
                          review.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <h3 className="text-xl">Images</h3>
            <UploadImagesBox
              campaign={campaign}
              images={campaign?.images}
              isUploadingImage={isUploadingImage}
              uploadImage={uploadImage}
              deleteImage={deleteImage}
            />
            <ImageGallery images={campaign?.images} />
          </div>

          {messages.length > 0 && <MessageList messages={messages} />}
        </div>
      </div>
      <RevisionModal
        isUpload={isManager && selectedArticle?.draftCount === 0}
        isManager={isManager}
        uploadRevisedArticle={uploadRevisedArticle}
        files={files}
        setFiles={setFiles}
        approvedForPublishingRef={approvedForPublishingRef}
        feedbackRef={feedbackRef}
        selectedArticle={selectedArticle}
        setIsOpen={setIsRevising}
        isOpen={isRevising}
      />
      <Modal
        isOpen={openAddArticlesOptions}
        onClose={() => setOpenAddArticlesOptions(false)}
      >
        <div className="px-6 pb-6">
          <h3 className="text-xl">
            <span className="font-bold">Add Articles</span>
          </h3>
          <p>
            Please answer our questionnaire or if you want to write your own
            articles, please upload them instead.
          </p>
          <div className="mt-6" />
          <AddArticlesOptions />
        </div>
      </Modal>

      <GoogleDocUpload
        handleSubmit={handleSubmitGoogleDoc}
        isOpen={isAddingGoogleDoc}
        handleClose={() => setIsAddingGoogleDoc(false)}
        googleDocFieldRefUrl={googleDocFieldRefUrl}
      />
      <CompleteModal
        submitArticleUrl={submitArticleUrl}
        articleUrlFieldRef={articleUrlFieldRef}
        selectedArticle={selectedArticle}
        setIsOpen={setIsCompleting}
        isOpen={isCompleting}
      />
      <DocViewerModal
        selectedArticle={selectedArticle}
        setIsOpen={setIsViewingArticle}
        isOpen={isViewingArticle}
        messages={articleMessages}
        messageTextareaRef={messageTextareaRef}
        handleSendMessage={handleSendMessage}
        handleApproveFlow={handleApproveFlow}
        handleSubmitForReview={handleSubmitForReview}
        isManager={isManager}
      />
      <DocViewerModalQuestionnaire
        selectedQuestionnaire={campaign?.questionnaire}
        setIsOpen={setIsViewingQuestionnaire}
        isOpen={isViewingQuestionnaire}
      />
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { query, req, params } = context;
  const { id } = query;
  const session = await getSession({ req });

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

  return {
    props: {
      initialCampaign: JSONSerializedCampaign,
      role: session.role,
    },
  };
};

export default Example;
