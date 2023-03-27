import Navbar from "@/components/navbar";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/solid";
import { CheckCircleIcon, EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { getSession, useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import API from "@/lib/api";
import { MoonLoader } from "react-spinners";
import SettingsWrapper from "@/components/settingsWrapper";

export default function Password() {
  const { data: session } = useSession();
  // console.log(session);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [code, setCode] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    // const currentPassword = e.currentTarget.current_password.value;
    const ID = session.id;
    // console.log('ID: ', ID);
    const email = e.currentTarget.email.value;
    // console.log('email: ', email);
    const newPassword = e.currentTarget.new_password.value;
    // console.log('newPassword: ', newPassword);
    const confirmPassword = e.currentTarget.new_password_repeat.value;
    // console.log('confirmPassword: ', confirmPassword);

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setIsSaving(false);
      return;
    }
    const data = {};
    if (email) {
      data.email = email;
      data.username = email; //username needs to be set to email for login
    }
    if (newPassword) {
      data.password = newPassword;
    }

    const result = await API.users
      .update({
        session,
        data,
      })
      .then(function (profileRes) {
        if (profileRes.status == 200) {
          setIsSubmitted(true);
        } else {
          setErrorMessage(res.data.message);
        }
        setIsSaving(false);

        return fetch("/api/auth/session?update", {
          method: "GET",
          credentials: "include",
        });
      })
      .catch((err) => {
        setIsSaving(false);
        // console.log(err);
        return null;
      });
  };

  return (
    <>
      <form className="space-y-4 mt-4" onSubmit={onSubmit}>
        {isSubmitted && (
          <div className="bg-green-50 border-green-500 border px-4 py-5 rounded-lg sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <CheckCircleIcon className="w-8 h-8 text-green-800" />
              <p className="font-bold text-green-800">
                Your account settings have been updated. Please use your new
                credentials the next time you login.
              </p>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="text"
            autoComplete="email"
            className="input"
            placeholder="contact@hello.co"
            defaultValue={session?.user?.email}
            required
          />
        </div>

        <p className="text-gray-500 ">Change Password</p>

        <div>
          <label htmlFor="new_password" className="label">
            New Password
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              id="new_password"
              name="new_password"
              type={showPassword ? "text" : "password"}
              autoComplete="new_password"
              className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Enter new password"
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
                <EyeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              )}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="new_password_repeat" className="label">
            Confirm New Password
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              id="new_password_repeat"
              name="new_password_repeat"
              type={showPassword ? "text" : "password"}
              autoComplete="new_password_repeat"
              className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Confirm new password"
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
                <EyeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              )}
            </div>
          </div>
        </div>

        <p className="text-red-500">{errorMessage}</p>

        <div>
          <button
            className="w-full button large mt-4"
            type="submit"
            disabled={isSaving}
          >
            <span className="flex items-center justify-center gap-2">
              {isSaving ? (
                <MoonLoader size={20} color={"#fff"} loading={true} />
              ) : (
                <>
                  <span>Save</span>
                </>
              )}
            </span>
          </button>
        </div>
      </form>
    </>
  );
}

export const getServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard",
      },
    };
  }
  return {
    props: {
      session,
    },
  };
};
