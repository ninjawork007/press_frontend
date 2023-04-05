import API from "../api";
import StatusLabel from "@/components/statusLabel";

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
