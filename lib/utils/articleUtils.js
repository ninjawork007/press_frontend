import API from "../api";
import StatusLabel from "@/components/statusLabel";
import ArticleModel from "@/lib/models/article-model";

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
