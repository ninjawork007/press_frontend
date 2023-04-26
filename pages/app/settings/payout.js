import Navbar from "@/components/navbar";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/solid";
import { getSession, useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import API from "@/lib/api";
import { useState, useEffect, Profiler } from "react";
import { MoonLoader } from "react-spinners";
import { CheckCircleIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import SettingsWrapper from "@/components/settingsWrapper";
import FileUploadInput from "@/components/fileUploadInput";

function Example() {
  const { data: session } = useSession();
  const [w9, setW9] = useState();

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

  const handleW9Change = (files) => {
    if (files.length > 0) {
      setW9(files[0]);
    } else {
      setW9();
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSigningUp(true);
    const result = await API.profiles
      .update({
        session,
        data: {
          paypal_email: form.paypal_email,

          bank_account_number: form.bank_account_number,
          bank_routing_number: form.bank_routing_number,
        },
      })
      .then(function (profileRes) {
        if (w9) {
          const formData = new FormData();

          formData.append("files", w9);
          formData.append("ref", "api::profile.profile");
          formData.append("field", "w9");
          formData.append("refId", session?.profile.id);

          return API.uploads.create({
            data: formData,
            session,
          });
        } else {
          return profileRes;
        }
      })
      .then((result) => {
        return fetch("/api/auth/session?update", {
          method: "GET",
          credentials: "include",
        });
      })
      .then((res) => {
        setProfileUpdated(true);
        setIsSigningUp(false);
        return res.json();
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
    <>
      <Navbar isManager={true} name="Press Backend" />

      <SettingsWrapper activeTab={3}>
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
                <p className="font-bold">Your payout info has been updated!</p>
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="mt-6 text-4xl text-gray-900">Payout</h2>
          <p className="text-sm">
            Payouts are every 1st and 15th of the month. Please fill in for the
            option you would prefer (Paypal or Wire).
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm space-y-2">
            <p className="text-indigo-600">Paypal</p>
            <div>
              <label htmlFor="paypal-email-address" className="label">
                Paypal Email Address
              </label>
              <input
                id="paypal_email"
                name="paypal_email"
                type="email"
                defaultValue={session?.profile?.paypal_email}
                onChange={handleChange}
                autoComplete="paypal_email"
                className="input"
                placeholder="Paypal Email address"
              />
            </div>
            <br />
            <hr className="py-4" />
            <p className="text-indigo-600">Wire</p>
            <div>
              <label htmlFor="bank_routing_number" className="label">
                Routing Number
              </label>
              <input
                id="bank_routing_number"
                name="bank_routing_number"
                type="number"
                defaultValue={session?.profile?.bank_routing_number}
                onChange={handleChange}
                autoComplete="bank_routing_number"
                className="input"
                placeholder="Routing Number"
              />
              <label htmlFor="bank_account_number" className="label">
                Account Number
              </label>
              <input
                id="bank_account_number"
                name="bank_account_number"
                type="number"
                defaultValue={session?.profile?.bank_account_number}
                onChange={handleChange}
                autoComplete="bank_account_number"
                className="input"
                placeholder="Account Number"
              />
            </div>

            <div>
              <label htmlFor="w9_upload" className="label">
                W9
              </label>
              <FileUploadInput
                name="w9_upload"
                files={w9 && [w9]}
                handleChange={handleW9Change}
                acceptedFileTypes=".pdf"
                initialFileUrls={
                  session?.profile?.w9?.url ? [session?.profile?.w9?.url] : []
                }
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
      </SettingsWrapper>
    </>
  );
}

export const getServerSideProps = async ({ req, resolvedUrl }) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: `/login?return_url=${resolvedUrl}`,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
};

export default Example;
