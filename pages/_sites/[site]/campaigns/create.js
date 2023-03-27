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
import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import API from "@/lib/api";
import SiteWrapper from "@/components/siteWrapper";

import Link from "next/link";
import { LockClosedIcon } from "@heroicons/react/solid";
import { useSession, signIn, signOut } from "next-auth/react";

function Example({ siteData }) {
  const { data: session } = useSession();

  const [form, setForm] = useState({
    name: "",
  });

  // useEffect(() => {
  //   if (!session) {
  //     window.location.href = "/";
  //   }
  //
  // })

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.name.length == 0) {
      alert("No name");
      return;
    }
    const user = await API.users.get(session);
    var profile = user.data.profile;
    if (!profile) {
      profile = await API.profiles
        .create({ data: { name: form.name, site: siteData.id } }, session)
        .then(function (result) {
          return result.data?.data;
        })
        .catch((err) => {
          return null;
          console.log(err);
        });
    }

    return API.campaigns
      .create({ data: { name: form.name, profile: profile.id } }, session)
      .then(function (campaignResult) {
        window.location.href = "/dashboard";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // ARROW FUNCTIONS
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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
      <Navbar />

      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-4xl text-gray-900">
              Create Your Campaign
            </h2>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
            action="#"
            method="POST"
          >
            <div>
              <h2 className="mt-6 text-2xl text-gray-900">Basic Info</h2>

              <label
                htmlFor="about"
                className="mt-4 block text-sm font-medium text-gray-700"
              >
                Campaign name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#D9D4FF] placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Please write your answer here"
                  defaultValue={""}
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <label
                htmlFor="about"
                className="mt-4 block text-sm font-medium text-gray-700"
              >
                What is the name of the person(s) and/or brand these articles
                are for?
              </label>
              <div className="mt-1">
                <input
                  id="about"
                  name="about"
                  type="text"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#D9D4FF] placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Please write your answer here"
                  defaultValue={""}
                />
              </div>

              <h2 className="mt-6 text-2xl text-gray-900">Brand Story Info</h2>

              <label
                htmlFor="about"
                className="mt-4 block text-sm font-medium text-gray-700"
              >
                Do you have a preferred title (producer, rapper, influencer,
                etc.) that you’d like us to use?
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="about"
                  name="about"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#D9D4FF] placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Please write your answer here"
                  defaultValue={""}
                />
              </div>

              <label
                htmlFor="about"
                className="mt-4 block text-sm font-medium text-gray-700"
              >
                Why should people read about you? What story do you have to
                tell? What makes you stand out?
              </label>
              <div className="mt-1">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#D9D4FF] placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Please write your answer here"
                  defaultValue={""}
                />
              </div>

              <label
                htmlFor="about"
                className="mt-4 block text-sm font-medium text-gray-700"
              >
                What are some notable career highlights? (Awards, recognition,
                accomplishments, etc.)
              </label>
              <div className="mt-1">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#D9D4FF] placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Please write your answer here"
                  defaultValue={""}
                />
              </div>

              <label
                htmlFor="about"
                className="mt-4 block text-sm font-medium text-gray-700"
              >
                What were the biggest challenges you’ve faced and how did you
                overcome them?
              </label>
              <div className="mt-1">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#D9D4FF] placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Please write your answer here"
                  defaultValue={""}
                />
              </div>

              <label
                htmlFor="about"
                className="mt-4 block text-sm font-medium text-gray-700"
              >
                What wisdom would you want to share with others? What lessons
                can people learn from you?
              </label>
              <div className="mt-1">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#D9D4FF] placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Please write your answer here"
                  defaultValue={""}
                />
              </div>

              <label
                htmlFor="about"
                className="mt-4 block text-sm font-medium text-gray-700"
              >
                Where do you see yourself/your brand in a few years? What are
                some of your dreams and aspirations?
              </label>
              <div className="mt-1">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#D9D4FF] placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Please write your answer here"
                  defaultValue={""}
                />
              </div>
              <h2 className="mt-6 text-2xl text-gray-900">Campaign Info</h2>

              <label
                htmlFor="about"
                className="mt-4 block text-sm font-medium text-gray-700"
              >
                What angle or focus for these articles that you would like to
                see?
              </label>
              <div className="mt-1">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#D9D4FF] placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Please write your answer here"
                  defaultValue={""}
                />
              </div>

              <label
                htmlFor="about"
                className="mt-4 block text-sm font-medium text-gray-700"
              >
                Provide 2 to 3 potential title ideas if you’d like.
              </label>
              <div className="mt-1">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#D9D4FF] placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Please write your answer here"
                  defaultValue={""}
                />
              </div>

              <label
                htmlFor="about"
                className="mt-4 block text-sm font-medium text-gray-700"
              >
                Is there information you do NOT want to be included in these
                articles?
              </label>
              <div className="mt-1">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#D9D4FF] placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Please write your answer here"
                  defaultValue={""}
                />
              </div>

              <label
                htmlFor="about"
                className="mt-4 block text-sm font-medium text-gray-700"
              >
                What is your goal with this press?
              </label>
              <div className="mt-1">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#D9D4FF] placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Please write your answer here"
                  defaultValue={""}
                />
              </div>

              <label
                htmlFor="about"
                className="mt-4 block text-sm font-medium text-gray-700"
              >
                Please provide direct links to all social media accounts you
                want to be included in the articles.
              </label>
              <div className="mt-1">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#D9D4FF] placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Please write your answer here"
                  defaultValue={""}
                />
              </div>

              <label
                htmlFor="about"
                className="mt-4 block text-sm font-medium text-gray-700"
              >
                Please share links to any previous press coverage.
              </label>
              <div className="mt-1">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#D9D4FF] placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Please write your answer here"
                  defaultValue={""}
                />
              </div>

              <label
                htmlFor="about"
                className="mt-4 block text-sm font-medium text-gray-700"
              >
                Is there anything else that you would like to include in these
                articles?
              </label>
              <div className="mt-1">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#D9D4FF] placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Please write your answer here"
                  defaultValue={""}
                />
              </div>
            </div>

            <div>
              <input
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                type="submit"
                value="Save and Continue"
              ></input>
            </div>
          </form>
        </div>
      </div>
    </SiteWrapper>
  );
}

// export const getServerSideProps = async ({ req }) => {
//   const session = await getSession({ req });
//   return {
//     props: {
//       session,
//     },
//   };
// };

export const getServerSideProps = async (context) => {
  const { params } = context;
  const { site } = params;

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
