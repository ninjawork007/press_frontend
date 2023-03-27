/*
  This example requires Tailwind CSS v2.0+

  This example requires some changes to your config:

  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import Navbar from "@/components/navbar";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/solid";
import { CheckCircleIcon, EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { getSession, useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { MoonLoader } from "react-spinners";
import API from "@/lib/api";
import SiteWrapper from "@/components/siteWrapper";
import * as klaviyo from "@/lib/tracking/klaviyo";

function Example({ siteData }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const passwordRef = useRef();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (session) {
      if (isVerified) {
        let aff_id = localStorage.getItem("aff");
        if (aff_id) {
          const createRefferal = async () => {
            await API.referrals
              .create({
                profile_id: session.profile.id,
                referrer_id: aff_id,
                session,
              })
              .then(function (refRes) {
                localStorage.removeItem("aff");
                router.replace("/publications");
              })
              .catch((err) => {
                console.log(err.message);
                router.replace("/publications");
              });
          };
          createRefferal();
        } else {
          router.replace("/publications");
        }
      } else {
        router.replace("/dashboard");
      }
    }
  }, [session, isVerified, router]);

  useEffect(() => {
    const queryString = require("query-string");
    const parsed = queryString.parse(location.search);
    const verified = parsed.verified;
    setIsVerified(verified);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    const result = await signIn("credentials", {
      redirect: false,
      email: e.target.email.value,
      password: e.target.password.value,
    });

    if (result.ok) {
      if (siteData?.attributes?.klaviyo_public_key) {
        klaviyo.trackLogin({
          email: e.target.email.value,
        });
      }
      return;
    } else {
      setErrorMessage(
        "Your email/password is incorrect or you have not confirmed your email yet."
      );
      setIsLoggingIn(false);
      return;
    }
    // alert('Credential is not valid');
  };

  return (
    <SiteWrapper siteData={siteData}>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full">
        ```
      */}

      <div className="min-h-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {isVerified && (
            <div className="bg-green-50 border-green-500 border px-4 py-5 rounded-lg sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <CheckCircleIcon className="w-8 h-8 text-green-800" />
                <p className="font-bold text-green-800">
                  Your email has been verified. Please login to continue.
                </p>
              </div>
            </div>
          )}
          <div className="flex flex-col">
            <h2 className="text-4xl lg:text-5xl text-gray-900 tracking-tight capitalize lg:text-center">
              Welcome back!
            </h2>
            <p className="max-w-4xl mx-auto mt-5 text-xl text-gray-600 sm:text-center">
              Enter your login details to continue.
            </p>
          </div>
          <div className="p-8 relative bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8">
            <form className="mt-8 space-y-6" onSubmit={onSubmit}>
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="rounded-md shadow-sm space-y-2">
                <div>
                  <label
                    htmlFor="email-address"
                    className="text-base text-gray-700 font-bold mb-2 block"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="input h-[44px]"
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="text-base text-gray-700 font-bold mb-2 block"
                  >
                    Password
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      ref={passwordRef}
                      autoComplete="current-password"
                      required
                      className="input h-[44px]"
                      placeholder="Enter your password"
                    />

                    <div
                      className="absolute inset-y-0 right-0 flex items-center pr-3 z-10"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      ) : (
                        <EyeIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-red-500">{errorMessage}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="text-base text-gray-700 font-bold ml-2"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/forgot">
                    <span className="text-sm font-bold text-indigo-600 hover:text-indigo-500">
                      Forgot your password?
                    </span>
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  className="w-full button large"
                  type="submit"
                  disabled={isLoggingIn}
                >
                  <span className="flex items-center justify-center gap-2">
                    {isLoggingIn ? (
                      <MoonLoader size={20} color={"#fff"} loading={true} />
                    ) : (
                      <>
                        <span className="">Submit</span>
                      </>
                    )}
                  </span>
                </button>

                <Link href="/register">
                  <button className="w-full">
                    <span className="flex items-center justify-center gap-2">
                      <span className="text-sm font-bold text-indigo-600 hover:text-indigo-500">
                        Create Account
                      </span>
                      <ArrowRightIcon className="h-4 w-4 text-indigo-600" />
                    </span>
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
        {/* <div className="flex flex-col lg:flex-row gap-10 items-center mt-20">
          <p className="text-lg text-gray-600">You're in good company</p>
          <div class="flex flex-row gap-10 items-center">
            <div className="flex justify-center">
              <img className="h-10" src="/ibm.svg" alt="IBM" />
            </div>
            <div className="flex justify-center">
              <img className="h-10" src="/universal.svg" alt="Universal" />
            </div>
            <div className="flex justify-center">
              <img className="h-10" src="/corona.svg" alt="Corona" />
            </div>
            <div className="flex justify-center">
              <img className="h-10" src="/republic.svg" alt="Republic" />
            </div>
            <div className="flex justify-center">
              <img className="h-10" src="/boxed-water.svg" alt="Boxed Water" />
            </div>
          </div>
        </div> */}
      </div>
    </SiteWrapper>
  );
}

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  const { params } = context;
  const { site } = params;
  // console.log("site params", site)
  let siteData;
  if (site.includes(".")) {
    siteData = await API.sites.get({ customDomain: site });
  } else {
    siteData = await API.sites.get({ subdomain: site });
  }

  return {
    props: {
      siteData,
    },
  };
};

export default Example;
