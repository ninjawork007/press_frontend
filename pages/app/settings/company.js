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

function Example() {
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
          address: form.address,
          address_line_2: form.address_line_2,
          city: form.city,
          state: form.state,
          country: form.country,
          zipcode: form.zipcode,
        },
      })
      .then(function (profileRes) {
        return fetch("/api/auth/session?update", {
          method: "GET",
          credentials: "include",
        });
      })
      .then(function (res) {
        setProfileUpdated(true);
        setIsSigningUp(false);
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

      <SettingsWrapper activeTab={4}>
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
                className="input"
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
                className="input"
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
            <br />
            <hr className="py-4" />
            <div>
              <label htmlFor="address" className="label">
                Company address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                defaultValue={session?.profile?.address}
                onChange={handleChange}
                autoComplete="address"
                required
                className="input"
                placeholder="Company Address"
              />
            </div>
            <div>
              <label htmlFor="address_line_2" className="label">
                Company Address Line 2
              </label>
              <input
                id="address_line_2"
                name="address_line_2"
                type="text"
                defaultValue={session?.profile?.address_line_2}
                onChange={handleChange}
                autoComplete="address_line_2"
                required
                className="input"
                placeholder="Company Address Line 2"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label htmlFor="city" className="label">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  defaultValue={session?.profile?.city}
                  onChange={handleChange}
                  autoComplete="city"
                  required
                  className="input"
                  placeholder="City"
                />
              </div>
              <div>
                <label htmlFor="state" className="label">
                  State
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  defaultValue={session?.profile?.state}
                  onChange={handleChange}
                  autoComplete="state"
                  required
                  className="input"
                  placeholder="State"
                />
              </div>
              <div>
                <label htmlFor="zipcode" className="label">
                  Zipcode
                </label>
                <input
                  id="zipcode"
                  name="zipcode"
                  type="text"
                  defaultValue={session?.profile?.zipcode}
                  onChange={handleChange}
                  autoComplete="zipcode"
                  required
                  className="input"
                  placeholder="Zipcode"
                />
              </div>
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

export const getServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
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
    },
  };
};

export default Example;
