class SiteManager {
  constructor() {}

  isSiteDetailsComplete(siteData) {
    if (
      siteData?.attributes.name &&
      siteData?.attributes.description &&
      siteData?.attributes.logo &&
      siteData?.attributes.ogImage &&
      siteData?.attributes.favicon &&
      siteData?.attributes.primary_color &&
      siteData?.attributes.secondary_color &&
      siteData?.attributes.primary_font &&
      siteData?.attributes.secondary_font
    ) {
      return true;
    }
    return false;
  }

  isEmailConnected(siteData) {
    if (siteData?.attributes?.is_sendgrid_connected) {
      return true;
    }
    return false;
  }

  isPayoutInfoComplete(profile) {
    if (
      (profile?.paypal_email ||
        (profile?.bank_account_number && profile?.bank_routing_number)) &&
      profile?.w9?.url
    ) {
      return true;
    }
    return false;
  }

  isDomainConnected(siteData) {
    if (siteData?.attributes?.customDomain) {
      return true;
    }
    return false;
  }
}

export default new SiteManager();
