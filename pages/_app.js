import "../styles/globals.scss";
import "../styles/slider.scss";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

import NProgress from "nprogress"; //nprogress module
import "nprogress/nprogress.css"; //styles of nprogress
import Script from "next/script";
import { useRouter } from "next/router";

import Hotjar from "../lib/hotjar";
import { GTM_ID, pageview } from "../lib/gtm";

import { useEffect } from "react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();
  useEffect(() => {
    const routeChangeStart = () => NProgress.start();
    const routeChangeComplete = () => {
      pageview();
      NProgress.done();
    };
    const routeChangeError = () => NProgress.done();

    router.events.on("routeChangeStart", routeChangeStart);
    router.events.on("routeChangeComplete", routeChangeComplete);
    router.events.on("routeChangeError", routeChangeError);
    return () => {
      router.events.off("routeChangeStart", routeChangeStart);
      router.events.off("routeChangeComplete", routeChangeComplete);
      router.events.off("routeChangeError", routeChangeError);
    };
  }, [router.events]);

  useEffect(() => {
    Hotjar.init();

    const queryString = require("query-string");
    const parsed = queryString.parse(location.search);
    const aff = parsed.aff;

    if (aff) {
      localStorage.setItem("aff", aff);
    }
  }, []);

  return (
    <>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>

      {/* Google Tag Manager - Global base code */}
      <Script
        id="gtag-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', '${GTM_ID}');
          `,
        }}
      />
    </>
  );
}
