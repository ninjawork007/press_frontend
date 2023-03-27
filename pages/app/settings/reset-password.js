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
import { useState, useEffect } from "react";
import API from "@/lib/api";
import { MoonLoader } from "react-spinners";

function Example() {
  const { data: session } = useSession();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [code, setCode] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const queryString = require("query-string");
    const parsed = queryString.parse(location.search);
    const code = parsed.code;
    setCode(code);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    console.log(e.target.password.value);
    console.log(e.target.password_repeat.value);
    const result = await API.auth
      .resetPassword({
        password: e.target.password.value,
        passwordConfirmation: e.target.passwordConfirmation.value,
        code,
      })
      .then((res) => {
        setIsSaving(false);
        setIsSubmitted(true);
      })
      .catch((err) => {
        setIsSaving(false);
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
                  Your password has been reset. Please login with your new
                  password.
                </p>
              </div>
            </div>
          )}
          <div>
            <h2 className="mt-6 text-3xl text-gray-900">Reset Password</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your new password
            </p>
          </div>
          {isSubmitted ? (
            <Link href="/login">
              <button className="button w-full">Go to login</button>
            </Link>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={onSubmit}>
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="rounded-md shadow-sm space-y-2">
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Password"
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
                <div>
                  <label htmlFor="password" className="sr-only">
                    Confirm Password
                  </label>
                  <input
                    id="passwordConfirmation"
                    name="passwordConfirmation"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm Password"
                  />
                </div>
              </div>
              <p className="text-red-500">{errorMessage}</p>

              <div className="space-y-4">
                <button className="button w-full" type="submit">
                  {isSaving ? (
                    <MoonLoader size={20} color={"#fff"} loading={true} />
                  ) : (
                    "Save Password"
                  )}
                </button>
              </div>
            </form>
          )}
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
