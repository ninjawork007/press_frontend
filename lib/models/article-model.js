import CampaignModel from "./campaign-model";
import PurchasedPublicationModal from "./purchased-publication-model";
export default class ArticleModel {
  constructor(data) {
    const article = data.attributes || data;

    this.name = article.name;
    this.campaign = article?.campaign?.data
      ? new CampaignModel(article?.campaign?.data)
      : null;
    this.id = data?.id;
    this.status = article?.status;
    this.draftCount = article?.draftCount;
    this.isWrittenByUser = article?.is_written_by_user;
    this.createdAt = article.createdAt;
    this.updatedAt = article.updatedAt;
    this.url = article?.url;
    this.googleDocUrl = article?.google_doc_url;
    this.feedback = article?.feedback;
    this.approvedForPublishing = article?.approved_for_publishing;
    this.publishDate = article?.publish_date;
    this.drafts = article?.drafts?.data;
    this.revisions = article?.revisions?.data;
    this.purchasedPublication = article?.purchased_publication?.data
      ? new PurchasedPublicationModal(article?.purchased_publication?.data)
      : null;
    this.approvalDate = article.approval_date;

    this.images = article.images?.data;

    this.isWriting = article?.is_writing;
  }

  getReadableStatus({ isManager = false }) {
    switch (this.status) {
      case "reviewing":
        if (isManager) {
          return "Requires Action";
        } else {
          return "Reviewing";
        }
      case "requires-action":
        if (isManager) {
          return "Reviewing";
        } else {
          return "Requires Action";
        }
      case "publishing":
        return "Published";
      case "completed":
        return "Completed";
      case "rejected":
        return "Rejected";
      default:
        return "Unknown";
    }
  }

  getLastActivity = () => {
    switch (this.status) {
      case "reviewing":
        if (this.approvedForPublishing) {
          return (
            <span className="text-purple-500 font-bold">
              Approved for Publishing
            </span>
          );
        }
        if (this.draftCount == 0) {
          if (this.isWrittenByUser) {
            return "Article Uploaded";
          }
          if (this.isWriting) {
            return "Writing in Progress";
          } else {
            return "Questionnaire Uploaded";
          }
        } else {
          return "Revision/Feedback Provided";
        }
      case "requires-action":
        if (this.draftCount == 1) {
          return "Drafts Uploaded";
        } else {
          return "Revisions Uploaded";
        }
      case "publishing":
        return "Publishing";
      case "completed":
        return "Published";
      case "rejected":
        return "Rejected by Publisher";
      default:
        return "Unknown";
    }
  };
}
