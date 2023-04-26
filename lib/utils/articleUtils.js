import API from "../api";
import StatusLabel from "@/components/statusLabel";
import ArticleModel from "@/lib/models/article-model";
import { PencilAltIcon } from "@heroicons/react/outline";

export const pressTeamReviewing = (status) => status == "reviewing";
export const requiresClientAction = (status) => status == "requires-action";
export const articleIsPublished = (status) => status == "completed";
export const awaitingPublishing = (status) => status == "publishing";

export const renderStatus = (status, isManager) => {
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

export const handleApprovalSubmit = async (article) => {
  const articleId = article.id;

  const data = { approved_for_publishing: true, status: "reviewing" };

  return API.articles
    .update(articleId, data)
    .then(function (result) {
      return result;
    })
    .catch(function (error) {
      console.log("error", error);
    });
};

export const submitForReview = async (article, isManager = false) => {
  const articleId = article.id;

  let draftCount = article.draftCount || 0;
  draftCount++;

  let data = { id: articleId, draftCount };
  isManager ? (data.status = "requires-action") : (data.status = "reviewing");

  return API.articles.revise(data);
};

export const sentToPublishing = async (article) => {
  const data = { status: "publishing", approval_date: new Date() };

  return API.articles.update(article.id, data);
};

export const completeArticle = async (article, liveURL) => {
  const data = { url: liveURL, status: "completed", publish_date: new Date() };
  const id = article.id;

  return API.articles.update(id, data);
};

export const uploadRevisedArticle = async (article, file, feedback) => {
  let id = article.id;
  let draftCount = article?.draftCount || 0;
  draftCount++;

  let data = { id, feedback, draftCount };

  const formData = new FormData();
  formData.append("files", file);
  formData.append("ref", "api::article.article");
  formData.append("refId", id);
  formData.append("field", "drafts");

  data.formData = formData;

  return API.articles
    .revise(data)
    .then(function (result) {
      if (feedback) {
        return API.messages.create({
          text: feedback,
          campaign: campaign?.id,
          article: selectedArticle?.id,
          profile: session.profile?.id,
          is_from_client: false,
          type: "comment",
        });
      } else {
        return;
      }
    })
    .then(function (result) {
      return API.articles.findOne(id);
    })
    .then(function (result) {
      let articleData = result.data.data;
      let articleModel = new ArticleModel(articleData);
      return articleModel;
    });
};

export const DocumentViewer = ({ selectedArticle, selectedDraft }) => {
  if (selectedArticle?.googleDocUrl) {
    return (
      <iframe
        id="msdoc-iframe"
        title="msdoc-iframe"
        className="max-w-full aspect-auto h-[680px] w-[1216px]"
        src={selectedArticle?.googleDocUrl}
        frameBorder="0"
      />
    );
  } else if (selectedDraft?.attributes?.url) {
    return (
      <iframe
        id="msdoc-iframe"
        title="msdoc-iframe"
        className="max-w-full aspect-auto h-[680px] w-[1216px]"
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
          selectedDraft?.attributes?.url
        )}`}
        frameBorder="0"
      />
    );
  } else {
    return (
      <div className="flex justify-center py-10">
        <div className="bg-white p-8 max-w-2xl rounded-3xl">
          <div className="flex flex-col items-center justify-center gap-2 ">
            <div className="bg-indigo-200 rounded-full p-2">
              <PencilAltIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-2xl sm:text-4xl text-center">
              Your article is in process
            </h3>
            <p className="text-base text-gray-600 text-center">
              Once the first draft is ready for your review, you will receive a
              notification via email and you can check back here!
            </p>
          </div>
        </div>
      </div>
    );
  }
};
