import {
  DocumentTextIcon,
  ArrowNarrowLeftIcon,
  PlusIcon,
} from "@heroicons/react/outline";
import { getSession, useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import RevisionModal from "@/components/revisionModal";
import CompleteModal from "@/components/completeModal";
import moment from "moment";
import ApprovalModal from "@/components/approvalModal";
import API from "@/lib/api";
import { useRouter } from "next/router";
import ArticleCard from "@/components/article-card";
import Link from "next/link";
import DocViewerModal from "@/components/docViewerModal";
import DocViewerModalQuestionnaire from "@/components/docViewerModalQuestionnaire";
import MessageList from "@/components/messageList";
import CampaignManager from "@/lib/campaignManager";
import SiteWrapper from "@/components/siteWrapper";
import AlertMessage from "@/components/alertMessage";
import AddArticlesOptions from "@/components/campaign/addArticlesOptions";
import UploadImagesBox from "@/components/article/uploadImagesBox";
import ImageGallery from "@/components/imageGallery";
import Modal from "@/components/modal";
import CampaignModel from "@/lib/models/campaign-model";
import DropdownOptions from "@/components/campaign/dropdownOptions";
import { sentToPublishing } from "@/lib/utils/articleUtils";
function MyCampaigns({ initialCampaign, role, siteData }) {
  const router = useRouter();

  const campaignId = router.query.id;
  const [campaign, setCampaign] = useState(initialCampaign);

  const [files, setFiles] = useState();
  const [images, setImages] = useState();
  const [articles, setArticles] = useState([]);

  const [selectedArticle, setSelectedArticle] = useState({});
  const [isRevising, setIsRevising] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const [isApproving, setIsApproving] = useState(false);
  const [purchasedPublications, setPurchasedPublications] = useState([]);
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

  const { data: session } = useSession();

  const isManager = role === "Manager";
  const campaignManager = CampaignManager;

  useEffect(() => {
    console.log("campaign", campaign);
    campaign?.articles?.filter((article) => {
      if (article?.status === "requires-action") {
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

      if (isManager) {
        messages = await API.messages
          .getMessagesForCampaignsForManager([campaignId], session)
          .then(function (result) {
            return result.data?.data;
            // setMessages(sortedMessages)
          })
          .catch(function (error) {
            console.log(error);
            return [];
          });
      } else {
        messages = await API.messages
          .getMessagesForCampaignsForClient([campaignId], session)
          .then(function (result) {
            return result?.data?.data;
          })
          .catch(function (error) {
            console.log(error);
            return [];
          });
      }
      setMessages(messages);
    }

    getMessages();
  }, [session, isManager, campaign]);

  useEffect(() => {
    if (selectedArticle.id) {
      API.messages
        .getMessagesForArticle(selectedArticle.id, session)
        .then((response) => {
          // console.log(response.data?.data)
          setArticleMessages(response.data?.data);
        });
    } else {
      setArticleMessages([]);
    }
  }, [selectedArticle, session]);

  const downloadURI = (uri, name) => {
    var link = document.createElement("a");
    link.download = name;
    link.href = `${uri}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openApproval = () => {
    setIsApproving(true);
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

    debugger;

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
        return API.campaigns
          .findOne(campaignId, session)
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
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

  const uploadRevisedArticle = async (e) => {
    e.preventDefault();
    const id = e.target.id;

    const feedback = feedbackRef.current.value;

    let draftCount = selectedArticle?.draftCount || 0;
    draftCount++;

    let data = { id, feedback, draftCount };
    isManager ? (data.status = "requires-action") : (data.status = "reviewing");

    if (files && files.length > 0) {
      const formData = new FormData();

      // console.log(id)
      formData.append("files", files[0]);
      formData.append("ref", "api::article.article");
      formData.append("refId", id);
      formData.append("field", isManager ? "drafts" : "revisions");

      data.formData = formData;

      const approvedForPublishing = approvedForPublishingRef?.current?.checked;
      if (approvedForPublishing) {
        if (!campaign.hasEnoughImages) {
          alert(
            "Please upload an image for each article if you would like to approve this draft for publishing"
          );
          return;
        }
      }
      data.approved_for_publishing = approvedForPublishing;
    }

    API.articles
      .revise(data, session)
      .then(function (result) {
        if (feedback) {
          return API.messages.create(
            {
              text: feedback,
              campaign: campaignId,
              article: selectedArticle.id,
              profile: isManager ? session.profile?.id : campaign?.profile?.id,
              is_from_client: !isManager,
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
          .findOne(campaignId, session)
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

  const handleSendMessage = (e) => {
    e.preventDefault();
    const text = messageTextareaRef.current.value;

    if (text) {
      API.messages
        .create(
          {
            text,
            campaign: campaignId,
            article: selectedArticle.id,
            profile: isManager ? session.profile?.id : campaign?.profile?.id,
            is_from_client: !isManager,
            type: "comment",
          },
          session
        )
        .then(function (result) {
          return API.messages
            .getMessagesForArticle(selectedArticle.id, session)
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

  const handleApprovalSubmit = async (e) => {
    e.preventDefault();
    const agreedToTerms = e.target.agreedToTerms.checked;
    if (!agreedToTerms) {
      alert("You must agree to the terms and conditions to continue.");
      return;
    }

    await sentToPublishing(selectedArticle);

    let campaignData = await API.campaigns.findOne(campaignId, session);
    let campaign = new CampaignModel(campaignData.data?.data);
    setCampaign(campaign);
    setIsApproving(false);
  };

  const approve = ({ publicationId = null }) => {
    const data = { status: "publishing", approval_date: new Date() };

    if (!isManager) {
      data.purchased_publication = publicationId;
    }

    const id = selectedArticle.id;

    API.articles.update(id, session, data).then(function (result) {
      return API.campaigns
        .findOne(campaignId, session)
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
    setIsApproving(false);
  };

  const submitArticleUrl = async (e) => {
    e.preventDefault();
    const url = articleUrlFieldRef.current.value;
    const data = { url, status: "completed", publish_date: new Date() };
    const id = selectedArticle.id;

    API.articles.update(id, session, data).then(function (result) {
      return API.campaigns
        .findOne(campaignId, session)
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
    setIsCompleting(false);
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

  const handleApproveFlow = (article) => {
    setIsViewingArticle(false);
    if (!campaign.hasEnoughImages) {
      alert(
        "Please upload an image for each article if you would like to approve this draft for publishing"
      );
      return;
    }

    setSelectedArticle(article);
    openApproval();
  };

  const handleArticleStatus = () => {
    if (isManager) {
      return;
    }
    if (campaign?.status === "requires-action") {
      return (
        <AlertMessage title="Your articles are ready for review" status="alert">
          <p>
            Please download the drafts on your computer. Once you read the
            articles, you may:
          </p>
          <ol className="list-decimal pl-5 pt-2">
            <li>
              Leave feedback in the box for our writers to see to make changes
            </li>
            <li>
              Make edits in the doc and save it. Then upload the saved doc. Once
              you edit the draft, our writers will review and you will receive a
              notification once its completed.
            </li>
            <li>Approve the article as is to be sent for publishing.</li>
          </ol>
        </AlertMessage>
      );
    } else if (campaign?.status === "reviewing") {
      if (campaign?.reviewCount == 0) {
        return (
          <AlertMessage title="Your articles are in review" status="default">
            <p>
              You will get notified via email when your articles are ready for
              review. Please make sure to upload your images in the meantime.
              You will need at least 1 per article to be published (3-5 images
              recommended).
            </p>
          </AlertMessage>
        );
      } else {
        return (
          <AlertMessage title="Your articles are in review" status="default">
            <p>
              Your articles are being reviewed by our team. You will get
              notified once they are ready for your review.
            </p>
          </AlertMessage>
        );
      }
    }
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

  return (
    <SiteWrapper siteData={siteData}>
      <div className="min-h-full py-12 px-4 sm:px-6 lg:px-8 h-full max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b pb-14 border-indigo-100">
          <div>
            <Link href="/dashboard">
              <a className="flex items-center gap-2 text-gray-500">
                <ArrowNarrowLeftIcon
                  className="block h-6 w-6"
                  aria-hidden="true"
                />

                <p className="font-bold">Back</p>
              </a>
            </Link>
            <div className="mt-6 flex items-start sm:items-center gap-2">
              <h2 className="text-5xl font-medium text-gray-900 capitalize">
                {campaign?.name}
              </h2>
            </div>
            <p>
              Campaign ID:{" "}
              <span className="font-bold text-gray-600">{campaign?.id}</span>
            </p>
            <p className="italic text-gray-600">
              Created:{" "}
              <span className="font-bold">
                {moment(campaign?.createdAt).format("MMM Do hh:mm a")}
              </span>
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

          <div className="flex justify-end items-center gap-4">
            {articles.length > 0 && (
              <div
                className="button large gap-2"
                onClick={() => setOpenAddArticlesOptions(true)}
              >
                <PlusIcon className="h-4 w-4 text-white" />
                <p>Add more articles</p>
              </div>
            )}

            <DropdownOptions handleOption={handleDropdownOption} />
          </div>
        </div>
        <div className="flex flex-col sm:grid grid-cols-3 gap-16 pt-12 ">
          <div className="space-y-4 col-span-2 w-full">
            <h3 className="text-4xl">Articles</h3>
            {handleArticleStatus()}

            <div className="">
              <div className="w-full">
                <div className="space-y-4">
                  {articles.length > 0 ? (
                    <>
                      {articles.map((article, index) => (
                        <ArticleCard
                          campaignId={campaignId}
                          key={article.id}
                          index={index} //for naming articles with no names
                          article={article}
                          isManager={isManager}
                          purchasedPublication={article?.purchasedPublication}
                          handleApproveFlow={() => handleApproveFlow(article)}
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
                        />
                      ))}
                      <h3 className="text-4xl mt-16">Images</h3>
                      {/* <UploadImagesBox
                        campaign={campaign}
                        images={campaign?.images}
                        isUploadingImage={isUploadingImage}
                        uploadImage={uploadImage}
                        deleteImage={deleteImage}
                      /> */}
                      <ImageGallery
                        images={campaign?.images}
                        deleteImage={deleteImage}
                      />
                    </>
                  ) : (
                    <AddArticlesOptions />
                  )}
                  <Modal
                    isOpen={openAddArticlesOptions}
                    onClose={() => setOpenAddArticlesOptions(false)}
                  >
                    <div className="px-6 pb-6">
                      <h3 className="text-xl">
                        <span className="font-bold">Add Articles</span>
                      </h3>
                      <p>
                        Please answer our questionnaire or if you want to write
                        your own articles, please upload them instead.
                      </p>
                      <div className="mt-6" />
                      <AddArticlesOptions />
                    </div>
                  </Modal>
                </div>
              </div>
            </div>
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
      <CompleteModal
        submitArticleUrl={submitArticleUrl}
        articleUrlFieldRef={articleUrlFieldRef}
        selectedArticle={selectedArticle}
        setIsOpen={setIsCompleting}
        isOpen={isCompleting}
      />
      <DocViewerModal
        selectedArticle={selectedArticle}
        handleApproveFlow={handleApproveFlow}
        setIsOpen={setIsViewingArticle}
        isOpen={isViewingArticle}
        messages={articleMessages}
        messageTextareaRef={messageTextareaRef}
        handleSendMessage={handleSendMessage}
        handleSubmitForReview={handleSubmitForReview}
        isManager={isManager}
      />
      <DocViewerModalQuestionnaire
        selectedQuestionnaire={campaign?.questionnaire}
        setIsOpen={setIsViewingQuestionnaire}
        isOpen={isViewingQuestionnaire}
      />
      <ApprovalModal
        confirmAction={handleApprovalSubmit}
        setIsOpen={setIsApproving}
        isOpen={isApproving}
        purchasedPublications={purchasedPublications}
      />
    </SiteWrapper>
  );
}

export const getServerSideProps = async (context) => {
  const { query, req, params } = context;
  const { id } = query;
  const session = await getSession({ req });
  const { site } = params;
  // console.log("site params", site)
  let siteData;
  if (site.includes(".")) {
    siteData = await API.sites.get({ customDomain: site });
  } else {
    siteData = await API.sites.get({ subdomain: site });
  }
  // console.log("siteData", siteData);

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

  return {
    props: {
      initialCampaign: JSONSerializedCampaign,
      role: session.role,
      siteData,
    },
  };
};

export default MyCampaigns;
