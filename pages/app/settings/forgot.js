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
import { CheckCircleIcon } from "@heroicons/react/outline";
import { getSession, useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import API from "@/lib/api";
import { MoonLoader } from "react-spinners";

function Example() {
  const { data: session } = useSession();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [form, setForm] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await API.auth
      .forgotPassword({
        email: e.target.email.value,
      })
      .then((res) => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      })
      .catch((err) => {
        setIsSubmitting(false);
        console.log(err);
        return null;
      });
  };

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full">
        ```
      */}
      <Navbar />

      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {isSubmitted && (
            <div className="bg-green-50 border-green-500 border px-4 py-5 rounded-lg sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <CheckCircleIcon className="w-8 h-8 text-green-800" />
                <p className="font-bold text-green-800">
                  If your email is in our system, we have sent you an email with
                  a link to reset your password.
                </p>
              </div>
            </div>
          )}
          <div>
            <h2 className="mt-6 text-3xl text-gray-900">Forgot Password</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email address to receive instructions for resetting
              your password.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm space-y-2">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            </div>
            <p className="text-red-500">{errorMessage}</p>

            <div className="space-y-4">
              <button className="button w-full" type="submit">
                {isSubmitting ? (
                  <MoonLoader size={20} color={"#fff"} loading={true} />
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (session) {
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

export default Example;
