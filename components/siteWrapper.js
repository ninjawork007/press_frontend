import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { NextSeo } from "next-seo";
import Footer from "@/components/footer";
/* This example requires Tailwind CSS v2.0+ */
import Navbar from "@/components/navigation/siteNavbar";
import TalkToSalesModal from "@/components/publications/talkToSalesModal";

import * as fbq from "@/lib/tracking/facebook-pixel";
import * as klaviyo from "@/lib/tracking/klaviyo";
import { useRouter } from "next/router";
import Script from "next/script";
import { getSession, useSession, signIn, signOut } from "next-auth/react";
import Intercom from "../lib/intercom";
import classNames from "classnames";
import Cart from "@/components/cart";
import PublicationModel from "@/lib/models/publication-model";
import CartContext from "@/components/CartContext";
import UnlockPricingModal from "@/components/publications/unlockPricingModal";

export default function SiteWrapper({
  children,
  siteData,
  isTransparent,
  isCheckout,
}) {
  const router = useRouter();
  const viewedPage = useRef(false);
  const { data: session } = useSession();
  const [isKlaviyoLoaded, setIsKlaviyoLoaded] = useState(false);
  const [isInquiryOpen, setInquiryOpen] = useState(false);
  const [list, updateList] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const [canViewPricing, setCanViewPricing] = useState(false);
  const [openAccessPricingModal, setOpenAccessPricingModal] = useState(false);
  const listLengthRef = useRef();

  useEffect(() => {
    if (list.length == 0) {
      checkLocalStorage();
    }
  }, [list]);

  useEffect(() => {
    if (list.length > 0) {
      if (siteData?.attributes?.klaviyo_public_key && session?.profile?.email) {
        if (list.length > listLengthRef.current) {
          klaviyo.trackAddToCart({
            itemName: list[list.length - 1].name,
            itemPrice: list[list.length - 1].price,
            itemQuantity: 1,
            items: list,
            email: session?.profile?.email,
          });
        }
      }
    }
    listLengthRef.current = list.length;
  }, [list, session]);

  useEffect(() => {
    if (session) {
      setCanViewPricing(true);
      return;
    }
    if (localStorage.getItem("allow_pricing_access") === "true") {
      setCanViewPricing(true);
      return;
    }

    //check if query has allow access to pricing and if so, set state to allow access
    const queryString = require("query-string");
    const parsed = queryString.parse(location.search);
    const allow_pricing_access = parsed.allow_pricing_access;
    //if no query param, check if local storage has access

    if (allow_pricing_access) {
      setCanViewPricing(true);

      localStorage.setItem("allow_pricing_access", true);

      router.replace("/publications");
    }
  }, [session]);

  const handleAddItem = (item) => {
    if (!canViewPricing || !session) {
      setOpenAccessPricingModal(true);
      return;
    }

    const idx = list.findIndex((listItem) => listItem.id === item.id);

    if (idx === -1) {
      const newList = [...list, { ...item, quantity: 1 }];
      updateList((list) => newList);
      localStorage.setItem("list", JSON.stringify(newList));
    } else {
      let newList = [...list];
      newList[idx] = { ...newList[idx], quantity: newList[idx].quantity + 1 };
      localStorage.setItem("list", JSON.stringify(newList));

      updateList((list) => [...newList]);
    }

    // setDetailOpen(false);
    setOpenCart(true);
  };

  const handleRemoveItem = (selectedItem) => {
    let newList = list.filter((item) => item.id !== selectedItem.id);
    let obj = JSON.stringify(newList);
    localStorage.setItem("list", obj);
    updateList(newList);
  };

  const checkLocalStorage = () => {
    if (localStorage.getItem("list")) {
      let items = JSON.parse(localStorage.getItem("list") + "");
      items.forEach((element, idx, array) => {
        let sitePublication = new PublicationModel(element);
        const returnedTarget = Object.assign(sitePublication, element);
        items[idx] = returnedTarget;
        if (idx === items.length - 1) {
          updateList((list) => [...items]);
        }
      });
    }
  };

  // const handleRemoveItem = (selectedItem) => {
  //   let newList = list.filter((item) => item.id !== selectedItem.id);
  //   let obj = JSON.stringify(newList);
  //   localStorage.setItem("list", obj);
  //   updateList(newList);
  // };

  // console.log('Site Data', siteData);
  let primaryFont = siteData?.attributes.primary_font;
  // console.log('1: ', primaryFont)
  // TODO: add an IF statement for a third word in the font name
  if (primaryFont) {
    if (primaryFont.includes("+")) {
      // ('Primary:There is a PLUS');
      primaryFont = primaryFont.replace(/\+/g, " ");
      // if (primaryFont[2]) {
      //   const tail = primaryFont[1].concat(primaryFont[2]);
      //   primaryFont = primaryFont[0].concat(tail);
      //   // console.log('Three: ', primaryFont);
      // } else {
      //   // console.log('Primary Split: ', primaryFont);
      //   primaryFont = primaryFont[0].concat(primaryFont[1]);
      // }
      // console.log('Primary Concat: ', primaryFont);
      // console.log('Primary Final: ', primaryFont);
    }
  } else {
    primaryFont = "undefined";
  }
  // console.log('Primary Font: ', primaryFont);

  let secondaryFont = siteData?.attributes.secondary_font;
  // console.log('2: ', secondaryFont);
  if (secondaryFont) {
    if (secondaryFont.includes("+")) {
      // ('secondary:There is a PLUS');
      secondaryFont = secondaryFont.replace(/\+/g, " ");
      // if (secondaryFont[2]) {
      //   const tail = secondaryFont[1].concat(secondaryFont[2]);
      //   secondaryFont = secondaryFont[0].concat(tail);
      //   // console.log('Three: ', secondaryFont);
      // } else {
      //   // console.log('secondary Split: ', secondaryFont);
      //   secondaryFont = secondaryFont[0].concat(secondaryFont[1]);
      // }
      // console.log('secondary Concat: ', secondaryFont);
      // console.log('secondary Final: ', secondaryFont);
    }
  } else {
    secondaryFont = "undefined";
  }
  // console.log('Secondary Font: ', secondaryFont);

  // useEffect(() => {
  //     (function e(){var e=document.createElement("script");e.type="text/javascript",e.async=true,e.src=`//staticw2.yotpo.com/${process.env.NEXT_PUBLIC_YOTPO_APP_KEY}/widget.js`;var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)})();
  //   }, [])

  useEffect(() => {
    document.body.style.setProperty("--primary-font", primaryFont);
    document.body.style.setProperty("--secondary-font", secondaryFont);
  }, [primaryFont, secondaryFont]);

  useEffect(() => {
    if (isKlaviyoLoaded && session) {
      klaviyo.identify({
        email: session.profile.email,
        firstName: session.profile.name,
      });
    }
  }, [isKlaviyoLoaded, session]);

  useEffect(() => {
    if (siteData?.attributes?.facebook_pixel_id) {
      fbq.init(siteData?.attributes?.facebook_pixel_id);
      fbq.pageview();
    }
  }, [siteData]);

  useEffect(() => {
    if (siteData?.attributes?.intercom_id) {
      Intercom.init({
        INTERCOM_ID: siteData?.attributes?.intercom_id,
        session,
      });
    }
  }, [session, siteData]);

  const handlePublicationInquiryOpen = () => {
    console.log("handlePublicationInquiryOpen...");
    setInquiryOpen(true);
  };

  const handleOpenCart = () => {
    setOpenCart(!openCart);
  };

  return (
    <>
      <Head>
        {siteData?.attributes.favicon.data ? (
          <link
            rel="icon"
            type="image/jpeg"
            href={siteData?.attributes.favicon.data.attributes.url}
          />
        ) : (
          <link rel="icon" href="" />
        )}
        {/* Google Fonts added by Site owners are introduced here. Primary = ?? and Secondary = ?? */}
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        ></link>
        {siteData?.attributes.primary_font ? (
          <link
            href={`https://fonts.googleapis.com/css2?family=${siteData?.attributes.primary_font}&display=swap`}
            rel="stylesheet"
          ></link>
        ) : null}
        {siteData?.attributes.secondary_font ? (
          <link
            href={`https://fonts.googleapis.com/css2?family=${siteData?.attributes.secondary_font}:wght@400;600;700&display=swap`}
            rel="stylesheet"
          ></link>
        ) : null}
        {/* <link rel="stylesheet" href="../styles/Sites.css" /> */}
      </Head>

      <NextSeo
        title={siteData?.attributes.name}
        description={siteData?.attributes.description}
        openGraph={{
          url: siteData?.attributes.customDomain,
          title: siteData?.attributes.name,
          description: siteData?.attributes.description,
          images: [
            {
              url: siteData?.attributes.ogImage,
              width: 800,
              height: 600,
              alt: "Og Image Alt",
              type: "image/jpeg",
            },
          ],
          site_name: siteData?.attributes.name,
        }}
      />
      <CartContext.Provider
        value={{ list, handleAddItem, handleRemoveItem, canViewPricing }}
      >
        <UnlockPricingModal
          canViewPricing={canViewPricing}
          open={openAccessPricingModal}
          setOpen={() => setOpenAccessPricingModal(false)}
          isInternalSite={siteData?.attributes?.is_internal}
        />

        <Cart
          open={openCart}
          setOpen={setOpenCart}
          list={list}
          handleRemoveItem={handleRemoveItem}
          site_id={siteData?.id}
        />

        <Navbar
          isTransparent={isTransparent}
          logo={siteData?.attributes.logo}
          name={siteData?.attributes.name}
          isCheckout={isCheckout}
          items={list}
          handleOpenCart={handleOpenCart}
          handlePublicationInquiryOpen={handlePublicationInquiryOpen}
          isInternalSite={siteData?.attributes.is_internal}
        />

        <div className={classNames(!isTransparent && "pt-[80px] sm:pt-20")}>
          {children}
        </div>
        {!isCheckout && (
          <Footer
            logo={siteData?.attributes.logo}
            name={siteData?.attributes.name}
          />
        )}
      </CartContext.Provider>

      <TalkToSalesModal
        site_id={siteData?.id}
        isOpen={isInquiryOpen}
        handleClose={() => {
          setInquiryOpen(false);
        }}
      />

      {siteData?.attributes.klaviyo_public_key && (
        <Script
          type="application/javascript"
          strategy="afterInteractive"
          src={`https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${siteData?.attributes.klaviyo_public_key}`}
          onLoad={() => {
            klaviyo.init();
            setIsKlaviyoLoaded(true);
          }}
        />
      )}

      {siteData?.attributes.hubspot_public_key && (
        <Script
          type="application/javascript"
          strategy="afterInteractive"
          src={`//js-na1.hs-scripts.com/${siteData?.attributes.hubspot_public_key}.js`}
        />
      )}

      {siteData?.attributes.tidio_id && (
        <Script
          type="application/javascript"
          strategy="afterInteractive"
          src={`//code.tidio.co/${siteData?.attributes.tidio_id}.js`}
        />
      )}
    </>
  );
}
