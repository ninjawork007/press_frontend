import * as priceFormatter from "@/lib/price-formatter";

export default class PublicationModel {
  constructor(data) {
    const publication = data.attributes || data;
    this.name = publication?.name;
    this.id = data?.id;
    this.internalCost = publication?.internal_cost;
    this.turnaroundTime = publication.turnaround_time;
    this.isFeatured = publication.is_featured;
    this.isHidden = false;
    this.price = publication.price;
    this.resellerPrice = publication.price; //save the original price for reseller to compare against
    this.domainAuthority = publication.domain_authority;
    this.domainRanking = publication.domain_ranking;
    this.isDoFollow = publication.is_do_follow;
    this.image = publication.image;
    this.isSponsored = publication.is_sponsored;
    this.news = publication.news;
    this.isIndexed = publication.is_indexed;
    this.publicationCategories = publication.publication_categories?.data;
    this.category = publication.category;
    this.requirements = publication.requirements;
    this.isExclusive = publication.is_exclusive;
    this.websiteUrl = publication.website_url;
    this.logo = publication.logo?.data;
    this.wordLogo = publication.word_logo?.data;
    this.requiresInquiry = publication.requires_inquiry;
    this.exampleScreenshot = publication?.example_screenshot;
    this.doFollowLinksAllowed = publication.do_follow_links_allowed;
  }

  getFormattedPrice = () => {
    return priceFormatter.formatDefaultPrice(this.price);
  };

  getCSVData = () => {
    if (this.isHidden) {
      return null;
    }
    return {
      id: this.id,
      name: this.name,
      turnaroundTime: this.turnaroundTime,
      price: this.price,
      domainAuthority: this.domainAuthority,
      domainRanking: this.domainRanking,
      isDoFollow: this.isDoFollow,
      image: this.image,
      isSponsored: this.isSponsored,
      news: this.news,
      isIndexed: this.isIndexed,
      requirements:
        this.requirements && this.requirements.replace(/\r?\n|\r/g, "; "),
      isExclusive: this.isExclusive,
      websiteUrl: this.websiteUrl,
      exampleScreenshot: this.exampleScreenshot,
    };
  };
}
