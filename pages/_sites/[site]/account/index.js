import SiteWrapper from "@/components/siteWrapper";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/solid";
import { getSession, useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import API from "@/lib/api";
import { useState, useEffect, Profiler } from "react";
import { MoonLoader } from "react-spinners";
import { CheckCircleIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import EmailPasswordChange from "@/components/email-password-change";

function Example({ siteData }) {
  const { data: session } = useSession();

  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [form, setForm] = useState({});
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const handleChange = (e) => {
    e.preventDefault();
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSigningUp(true);
    const result = await API.profiles
      .update({
        session,
        data: {
          name: form.company,
          company_type: form.company_type,
          email: form.email,
        },
      })
      .then(function (profileRes) {
        if (profileRes.status == 200) {
          setProfileUpdated(true);
        } else {
          setErrorMessage(res.data.message);
        }
        setIsSigningUp(false);

        return fetch("/api/auth/session?update", {
          method: "GET",
          credentials: "include",
        });
      })
      .catch((err) => {
        setErrorMessage("There was an error saving your changes");
        console.log(err.message);
        setIsSigningUp(false);

        return null;
        // alert(err.message)
      });
  };

  return (
    <SiteWrapper siteData={siteData}>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {profileUpdated && (
            <div
              className={classNames(
                "border px-4 py-5 rounded-lg sm:px-6 mb-4 bg-blue-50 border-blue-500"
              )}
            >
              <div className="flex items-start gap-4">
                <CheckCircleIcon
                  className={classNames("w-5 h-5 flex-none text-indigo-700")}
                />
                <div className={classNames(" text-indigo-700")}>
                  <p className="font-bold">Your profile has been updated!</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <h2 className="mt-6 text-4xl text-gray-900">Account</h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm space-y-2">
              <div>
                <label htmlFor="company" className="label">
                  Company Name
                </label>
                <input
                  id="company"
                  name="company"
                  type="company"
                  defaultValue={session?.profile?.name}
                  autoComplete="company"
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Company Name"
                />
              </div>
              <div className="mt-4 space-y-2">
                <label htmlFor="company_type" className="label">
                  Select Company Type
                </label>

                <select
                  id="company_type"
                  name="company_type"
                  defaultValue={session?.profile?.company_type}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Select a type"
                >
                  <option value="">Select a type</option>
                  <option value="business-brand">Business/Brand</option>
                  <option value="personal">Individual</option>
                  <option value="agency">Agency</option>
                  <option value="publicist">Publicist</option>
                  <option value="affiliate">Affiliate</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="email-address" className="label">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={session?.profile?.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            </div>
            <p className="text-red-500">{errorMessage}</p>

            <div className="space-y-4">
              <button
                className="w-full button large"
                type="submit"
                disabled={isSigningUp}
              >
                <span className="flex items-center justify-center gap-2">
                  {isSigningUp ? (
                    <MoonLoader size={20} color={"#fff"} loading={true} />
                  ) : (
                    <>
                      <span className="">Save Changes</span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
          <h2 className="mt-6 text-2xl text-gray-900">Login Details</h2>

          <EmailPasswordChange />
        </div>
      </div>
    </SiteWrapper>
  );
}

export const getServerSideProps = async (context) => {
  const { params, req } = context;

  const session = await getSession({ req });
  const { site } = params;
  // console.log("site params", site)
  let siteData;
  if (site.includes(".")) {
    siteData = await API.sites.get({ customDomain: site });
  } else {
    siteData = await API.sites.get({ subdomain: site });
  }
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
  return {
    props: {
      session,
      siteData,
    },
  };
};

export default Example;
