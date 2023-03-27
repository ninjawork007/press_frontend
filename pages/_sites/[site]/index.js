import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";

import Hero from "@/components/home/hero";
import Comparison from "@/components/home/comparison";
import Guarantees from "@/components/home/guarantees";
import Benefits from "@/components/home/benefits";
import HowItWorks from "@/components/howItWorks";
import Testimonials from "@/components/home/testimonials";
import FAQs from "@/components/faqs";
import CTA from "@/components/cta-banner";
import API from "@/lib/api";
import SiteWrapper from "@/components/siteWrapper";
import axios from "axios";
const IndexPage = ({ siteData, reviews, averageRating }) => {
  // Breaking out the specific font names where a Site owner has chosen to use custom fonts

  // // useEffect(() => {
  // //     (function e(){var e=document.createElement("script");e.type="text/javascript",e.async=true,e.src=`//staticw2.yotpo.com/${process.env.NEXT_PUBLIC_YOTPO_APP_KEY}/widget.js`;var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)})();
  // //   }, [])

  return (
    <SiteWrapper siteData={siteData} isTransparent={false}>
      {/* temporarily only show how it works video for waverly */}

      <Hero
        showVideo={siteData?.attributes.is_internal}
        name={siteData?.attributes.name}
      />
      {siteData?.attributes.is_internal && <Testimonials />}
      <Comparison
        name={siteData?.attributes.name}
        isInternal={siteData?.attributes.is_internal}
      />
      <Guarantees name={siteData?.attributes.name} />
      <Benefits name={siteData?.attributes.name} />
      <HowItWorks name={siteData?.attributes.name} />
      <FAQs
        email={siteData?.attributes.email}
        siteName={siteData?.attributes?.name}
      />
      <CTA isInternalSite={siteData?.attributes.is_internal} />
    </SiteWrapper>
  );
};

export async function getStaticPaths() {
  const siteData = await API.sites.find({});
  const sites = siteData?.data?.data;

  const allPaths = sites.reduce(function (result, site) {
    const subdomain = site.attributes.subdomain;
    const customDomain = site.attributes.customDomain;
    if (subdomain) {
      result.push({
        params: { site: subdomain },
      });
    }
    if (customDomain) {
      result.push({
        params: { site: customDomain },
      });
    }
    return result;
  }, []);

  return {
    paths: allPaths,

    fallback: true,
  };
}

export async function getStaticProps(context) {
  const { params } = context;
  const { site } = params;

  let siteData;
  if (site.includes(".")) {
    siteData = await API.sites.get({ customDomain: site });
  } else {
    siteData = await API.sites.get({ subdomain: site });
  }

  // let reviews = [];
  // if (siteData?.attributes.is_internal) {
  //   const uToken = await axios
  //     .request({
  //       method: "POST",
  //       url: "https://api.yotpo.com/oauth/token",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //       data: {
  //         client_id: process.env.YOTPO_API_KEY,
  //         client_secret: process.env.YOTPO_SECRET_KEY,
  //         grant_type: "client_credentials",
  //       },
  //     })
  //     .then(function (response) {
  //       return response.data.access_token;
  //     })
  //     .catch(function (error) {
  //       console.error(error);
  //       return null;
  //     });

  //   // //  const averageRating = await axios.request({
  //   // //     method: 'GET',
  //   // //     url: `https://api.yotpo.com/v1/apps/${process.env.YOTPO_API_KEY}/bottom_lines?count=5&page=5`,
  //   // //     headers: {Accept: 'application/json', 'Content-Type': 'application/json'}
  //   // //   })
  //   // //   .then(function (response) {
  //   // //     console.log(response);
  //   // //     return response.data
  //   // //   })
  //   // //   .catch(function (error) {
  //   // //     console.error(error);
  //   // //   });
  //   const reviewsResult = await axios
  //     .request({
  //       method: "GET",
  //       url: `https://api.yotpo.com/v1/apps/${process.env.YOTPO_API_KEY}/reviews?utoken=${uToken}&deleted=false&page=10`,
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //     })
  //     .then(function (response) {
  //       return response.data;
  //     })
  //     .catch(function (error) {
  //       console.error(error);
  //       return null;
  //     });
  //   reviews = reviewsResult?.reviews;
  // }

  return {
    props: {
      siteData,
      // reviews,
      // averageRating: 4.68,
      revalidate: 60,
    }, // will be passed to the page component as props
  };
}

export default IndexPage;
