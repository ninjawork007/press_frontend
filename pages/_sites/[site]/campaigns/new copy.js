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
import AlertMessage from "@/components/alertMessage";
import {
  PlusIcon,
  DocumentIcon,
  DownloadIcon,
  UploadIcon,
  ArrowRightIcon,
  ArrowNarrowLeftIcon,
} from "@heroicons/react/outline";

import Link from "next/link";
import { LockClosedIcon } from "@heroicons/react/solid";
import { getSession, useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { BarLoader } from "react-spinners";

function Example({ siteData }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [redirectedFromCheckout, setRedirectedFromCheckout] = useState(false);
  const [form, setForm] = useState({
    name: "",
  });
  const [files, setFiles] = useState();

  useEffect(() => {
    const redirect_status = router.query.redirect_status;
    if (redirect_status === "succeeded") {
      setRedirectedFromCheckout(true);
    }
  }, [router]);

  const uploadImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("files", files[0]);
    formData.append("ref", "api::campaign.campaign");

    formData.append("field", "questionnaire");

    const user = await API.users.get(session);
    var profile = user.data.profile;
    if (!profile) {
      profile = await API.profiles
        .create({ data: { name: user.data.email } }, session)
        .then(function (result) {
          return result.data?.data;
        })
        .catch((err) => {
          return null;
          console.log(err);
        });
    }
    if (!profile) {
      alert("There was an issue with your acccount. Please try again.");
    }

    return API.campaigns
      .create(
        { data: { name: e.target.name.value, profile: profile.id } },
        session
      )
      .then(function (campaignResult) {
        const id = campaignResult.data?.data?.id;
        formData.append("refId", id);
        console.log(id);
        API.campaigns
          .uploadFiles(formData, session)
          .then(function (result) {
            router.replace(`/campaigns/${id}`);
          })
          .catch((err) => {
            console.log(err);
            return null;
          });
      });
  };
  const downloadURI = (uri, name) => {
    var link = document.createElement("a");
    link.download = name;
    link.href = `https://drive.google.com/uc?export=download&id=1arYLrk7dFsMVFwouTa331tByYC-1iShg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.name.length == 0) {
      alert("No name");
      return;
    }
    const user = await API.users.get(session);
    var profile = user.data.profile;
    // if (!profile) {
    //   profile = await API.profiles.create({data: {name: form.name}}, session).then(function(result) {
    //     return result.data?.data
    //   }).catch((err) => {
    //     return null
    //     console.log(err)
    //   })
    // }

    return API.campaigns
      .create({ data: { name: form.name, profile: profile.id } }, session)
      .then(function (campaignResult) {
        router.replace("/dashboard");
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
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="">
            {redirectedFromCheckout ? (
              <AlertMessage
                status="default"
                title="Your purchase was successful!"
              ></AlertMessage>
            ) : (
              <Link href="/dashboard">
                <a className="flex items-center gap-2 text-gray-500">
                  <ArrowNarrowLeftIcon
                    className="block h-6 w-6"
                    aria-hidden="true"
                  />

                  <p className="font-bold">Go back to campaigns</p>
                </a>
              </Link>
            )}

            <h2 className="mt-6 text-4xl text-gray-900">
              Create Your Campaign
            </h2>
            <p>
              Please answer our questionnaire or if you want to write your own
              articles, please upload them instead.
            </p>
          </div>

          <Link href="/campaigns/questionnaire">
            <div className="border p-6 bg-white rounded-xl space-y-2 cursor-pointer border-blue-600">
              <h3 className="text-xl">Write Articles For Me</h3>
              <p>
                Answer our questionnaire and our talented team of writers will
                craft a story unique to you.
              </p>
              <div className="text-indigo-600 flex items-center gap-2 font-bold">
                <p>Start</p>
                <ArrowRightIcon className="h-4 w-4" />
              </div>
            </div>
          </Link>
          <Link href="/campaigns/upload-articles">
            <div className="border p-6 bg-white rounded-xl space-y-2 cursor-pointer">
              <h3 className="text-xl">I Will Write My Own Articles</h3>
              <p>
                If you have already written your own articles, you can upload
                them for our team to approve.
              </p>
              <div className="text-indigo-600 flex items-center gap-2 font-bold">
                <p>Start</p>
                <ArrowRightIcon className="h-4 w-4" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </SiteWrapper>
  );
}

// export const getServerSideProps = async ({ req }) => {
//   const session = await getSession({ req });
//   if (!session) {
//     return {
//       redirect: {
//         permanent: false,
//         destination: "/login"
//       }
//     }
//   }

//   return {
//     props: {
//       session,
//     },
//   };
// };

export const getServerSideProps = async (context) => {
  const { params } = context;
  const { site } = params;

  const siteData = await API.sites.get({ subdomain: site });

  return {
    props: {
      siteData,
    },
  };
};

export default Example;
