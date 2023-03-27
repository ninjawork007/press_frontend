import API from "./api";
import CampaignModel from "./models/campaign-model";
class CampaignManager {
  constructor() {}

  checkIfNeedsMoreImages(campaign) {
    if (!campaign || !campaign.images) return true;
    return campaign.images?.length < campaign.articles.length;
  }

  async approveForPublishing({ article, session }) {
    const data = { approved_for_publishing: true, status: "reviewing" };

    const id = article.id;

    return API.articles
      .update(id, session, data)
      .then(function (result) {
        return result;
      })
      .catch(function (error) {
        console.log("error", error);
      });
  }
}

export default new CampaignManager();
