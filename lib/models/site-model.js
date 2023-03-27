export default class SiteModel {
  constructor(data) {
    const site = data.attributes || data;

    this.id = site.id;
    this.name = site.name;
    this.description = site.description;

    this.customDomain = site.customDomain;
    this.subdomain = site.subdomain;
    this.logo = site.logo?.data;
    this.ogImage = site.ogImage?.data;

    this.email = site.email;
    this.is_live = site.is_live;
    this.has_updated_publications = site.has_updated_publications;
    this.use_base_publication_pricing = site.use_base_publication_pricing;
    this.is_domain_connected = site.is_domain_connected;
    this.primary_font = site.primary_font;
    this.secondary_font = site.secondary_font;
    this.primary_color = site.primary_color;
    this.secondary_color = site.secondary_color;
    this.is_sendgrid_connected = site.is_sendgrid_connected;
    this.isInternal = site.is_internal;
    this.updatedAt = site.updatedAt;
    this.createdAt = site.updatedAt;
  }
}
