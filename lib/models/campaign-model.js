import ProfileModel from "./profile-model";
import ArticleModel from "./article-model";
export default class CampaignModel {
  constructor(data) {
    this.id = data?.id;
    this.name = data?.attributes?.name;
    this.updatedAt = data?.attributes?.updatedAt;
    this.createdAt = data?.attributes?.createdAt;
    this.profile = data.attributes.profile?.data
      ? new ProfileModel(data.attributes.profile?.data)
      : null;
    this.status = data.attributes.status;
    this.articles = data.attributes.articles?.data
      ? data.attributes.articles?.data.map(
          (article) => new ArticleModel(article)
        )
      : null;

    this.reviewCount = data.attributes.reviewCount;
    this.images = data.attributes.images?.data;
    this.questionnaire = data.attributes.questionnaire?.data;
    this.hasEnoughImages = data.attributes.has_enough_images;
  }
}
