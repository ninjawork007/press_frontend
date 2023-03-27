import { throws } from "assert";
import ArticleModel from "./article-model";
import ProfileModel from "./profile-model";
import PublicationModel from "./publication-model";
import SiteModel from "./site-model";
import DateHandler from "../date-handler";
export default class PurchasedPublicationModal {
  constructor(data) {
    const purchasedPublication = data.attributes || data;
    this.id = data.id;
    this.publication =
      purchasedPublication.publication?.data || purchasedPublication.publication
        ? new PublicationModel(
            purchasedPublication.publication?.data ||
              purchasedPublication.publication
          )
        : null;
    this.updatedAt = purchasedPublication?.updatedAt;
    this.createdAt = purchasedPublication?.createdAt;
    this.article =
      purchasedPublication.article?.data || purchasedPublication.article
        ? new ArticleModel(
            purchasedPublication.article?.data || purchasedPublication.article
          )
        : null;
    this.profile =
      purchasedPublication.profile?.data || purchasedPublication.profile
        ? new ProfileModel(
            purchasedPublication.profile?.data || purchasedPublication.profile
          )
        : null;
    this.site =
      purchasedPublication.site?.data || purchasedPublication.site
        ? new SiteModel(
            purchasedPublication.site?.data || purchasedPublication.site
          )
        : null;
    this.price = purchasedPublication.price;
    this.status = purchasedPublication.status;
    this.accountingCompletionDate =
      purchasedPublication.accounting_completion_date;
    this.isAccountingCompleted = purchasedPublication.is_accounting_completed;
    this.isPublisherPaid = purchasedPublication.is_publisher_paid;
    this.isResellerPaid = purchasedPublication.is_reseller_paid;
    this.publicationSalePrice =
      purchasedPublication.publication_sale_price || this.publication.price;
    this.publicationInternalCost =
      purchasedPublication.publication_internal_cost ||
      this.publication.internalCost;
  }

  getOverallStatus() {
    if (this.status === "canceled") {
      return this.status;
    } else if (this.article) {
      return this.article.status;
    } else {
      return this.status;
    }
  }

  getLastUpdate = () => {
    let articleLastUpdate = this.article?.updatedAt;
    let publicationLastUpdate = this.updatedAt;
    if (articleLastUpdate && publicationLastUpdate) {
      return articleLastUpdate > publicationLastUpdate
        ? articleLastUpdate
        : publicationLastUpdate;
    } else {
      return publicationLastUpdate;
    }
  };

  getLastActivity = () => {
    if (this.status === "canceled") {
      return "Canceled";
    } else {
      if (this.article) {
        return this.article.getLastActivity();
      } else {
        return "Purchased";
      }
    }
  };

  getCSVData = () => {
    return {
      id: this.id,
      publication: this.publication.name,
      article_url: this.article?.url,
      client: this.profile.name,
      reseller: this.site.isInternal ? "" : this.site.name,
      sale_price: this.price,
      reseller_cost: this.price - this.publication.price,
      publisher_cost: this.publication.internalCost,
      profit: this.price - this.publication.internalCost,
      date_purchased: DateHandler.formatDate(this.createdAt),
      publish_date: DateHandler.formatDate(this.article?.publishDate),
    };
  };
}
