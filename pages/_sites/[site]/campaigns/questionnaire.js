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
import {
  PlusIcon,
  DocumentIcon,
  DownloadIcon,
  UploadIcon,
} from "@heroicons/react/outline";

import Link from "next/link";
import { LockClosedIcon, ArrowNarrowLeftIcon } from "@heroicons/react/solid";
import { getSession, useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { BarLoader } from "react-spinners";
import SiteWrapper from "@/components/siteWrapper";

import classNames from "classnames";
function Example({ purchasedPublications, siteData }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const [form, setForm] = useState({
    name: "",
  });
  const [files, setFiles] = useState([]);

  const purchasedPublicationIds = purchasedPublications.map(
    (purchasedPublication) => {
      return purchasedPublication.id;
    }
  );

  const [selectedPurchasedPublications, setSelectedPurchasedPublications] =
    useState(purchasedPublicationIds);

  // useEffect(() => {

  //   if (!session) {
  //     router.replace('/login');
  //   }
  // }, [session])

  const uploadQuestionnaire = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("files", files[0]);
    formData.append("ref", "api::campaign.campaign");

    formData.append("field", "questionnaire");

    setIsUploadingFile(true);

    const user = await API.users.get(session);
    var profile = user.data.profile;
    if (!profile) {
      profile = await API.profiles
        .create({ data: { name: user.data.email } }, session)
        .then(function (result) {
          return result.data?.data;
        })
        .catch((err) => {
          setIsUploadingFile(false);

          return null;
          console.log(err);
        });
    }
    if (!profile) {
      setIsUploadingFile(false);
      alert("There was an issue with your acccount. Please try again.");
    }

    var campaignId;

    return API.campaigns
      .create(
        { data: { name: e.target.name.value, profile: profile.id } },
        session
      )
      .then(function (campaignResult) {
        campaignId = campaignResult.data?.data?.id;
        formData.append("refId", campaignId);

        return API.campaigns.uploadFiles(formData, session);
      })
      .then(function (result) {
        var articlePromises = selectedPurchasedPublications.map(
          (purchasedPublicationId) => {
            let data = {
              purchased_publication: purchasedPublicationId,
              campaignId: campaignId,
            };

            return API.articles
              .setup(data, session)
              .then(function (result) {
                return result;
              })
              .catch((err) => {
                console.log(err);
                return null;
              });
          }
        );

        return Promise.all(articlePromises);
      })
      .then(function (results) {
        return API.campaigns.update(
          campaignId,
          { status: "reviewing", reviewCount: 0 },
          session
        );
      })
      .then(function () {
        // router.replace("/dashboard")
        setIsUploadingFile(false);
        router.replace(`/campaigns/${campaignId}`);
      })
      .catch((err) => {
        console.log(err);
        setIsUploadingFile(false);
        return null;
      });

    // formData.append('refId', id)
    // // console.log(id)
  };
  const downloadURI = (uri, name) => {
    var link = document.createElement("a");
    link.download = name;
    link.href = `https://press-bucket.s3.ca-central-1.amazonaws.com/PR_Questionnaire_02671f83be.docx?updated_at=2022-11-22T05:48:40.760Z`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ARROW FUNCTIONS
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePublicationSelect = (e, publicationId) => {
    if (selectedPurchasedPublications.includes(publicationId)) {
      setSelectedPurchasedPublications(
        selectedPurchasedPublications.filter((selectedPurchasedPublication) => {
          return selectedPurchasedPublication != publicationId;
        })
      );
    } else {
      setSelectedPurchasedPublications([
        ...selectedPurchasedPublications,
        publicationId,
      ]);
    }
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

      <div className="min-h-full max-w-7xl mx-auto container py-12  px-4 sm:px-6 lg:px-8">
        <Link href="/campaigns/new">
          <a className="flex items-center gap-2 text-gray-500">
            <ArrowNarrowLeftIcon className="block h-6 w-6" aria-hidden="true" />

            <p className="font-bold">Back</p>
          </a>
        </Link>
        <div className="flex flex-col sm:grid grid-cols-3 justify-center mt-6">
          <div className="space-y-8 max-w-lg col-span-2">
            <div>
              <h2 className="text-4xl text-gray-900">Questionnaire</h2>
              <p>
                To help our writers in creating the best story for you, we’ll
                need a better understanding of your brand. Please download the
                questionnaire (word doc) and upload the completed version
              </p>
            </div>

            <a className="button-secondary gap-2" onClick={() => downloadURI()}>
              <DownloadIcon className="mx-auto h-4 w-4" aria-hidden="true" />

              <span className="">Download Questionnaire</span>
            </a>

            <form onSubmit={uploadQuestionnaire}>
              <label
                htmlFor="about"
                className="mt-4 block text-sm font-bold text-gray-700"
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
                className="mt-4 block text-sm font-bold text-gray-700"
              >
                Upload Completed Questionnaire
              </label>
              {files && files.length > 0 ? (
                <>
                  <div className="appearance-none rounded-none relative w-full px-3 py-2 border border-[#D9D4FF] placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-2 text-center flex flex-col items-center">
                    <div className="rounded-full bg-gray-50 p-2">
                      <div className="rounded-full bg-indigo-100 p-2">
                        <DocumentIcon
                          className="h-6 w-6 text-indigo-400 "
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                    <div>{files[0].name}</div>
                    <a
                      className="text-red-400 mt-4 block text-sm font-medium cursor-pointer"
                      onClick={() => setFiles()}
                    >
                      Remove
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <label className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                    {isUploadingFile ? (
                      <>
                        <span className="flex items-center flex-col justify-center space-y-2">
                          <BarLoader
                            color={"#3B2CBC"}
                            loading={isUploadingFile}
                          />

                          <span className="font-medium text-gray-600">
                            Uploading image...
                          </span>
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="flex items-center flex-col justify-center space-y-2">
                          <div className="rounded-full bg-gray-50 p-2">
                            <div className="rounded-full bg-indigo-100 p-2">
                              <UploadIcon
                                className="h-6 w-6 text-indigo-500"
                                aria-hidden="true"
                              />
                            </div>
                          </div>
                          <span className="font-medium text-gray-600">
                            <span className="text-blue-600 underline">
                              click to upload
                            </span>
                          </span>
                        </span>
                        <input
                          accept=".doc,.docx"
                          type="file"
                          name="file_upload"
                          className="hidden"
                          onChange={(e) => setFiles(e.target.files)}
                        />
                      </>
                    )}
                  </label>
                </>
              )}
              <div className="mt-8">
                <button
                  className={classNames("button large w-full")}
                  type="submit"
                  disabled={
                    (files && files.length <= 0) ||
                    form.name.length <= 0 ||
                    isUploadingFile
                  }
                >
                  {!isUploadingFile ? "Submit" : "Uploading..."}
                </button>
              </div>
            </form>
          </div>
          <div>
            <h3 className="text-xl">Purchased publications</h3>
            <p>Select the ones you want included in this campaign</p>
            {selectedPurchasedPublications.length <= 0 && (
              <div className="">
                {purchasedPublications.length > 0 ? (
                  <p className="text-red-500">
                    Please select at least one publication for this campaign
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-red-500">
                      You have no available publication credits. Please purchase
                      one to continue
                    </p>
                    <Link href="/publications">
                      <a className="button">
                        <span className="">Purchase Publications</span>
                      </a>
                    </Link>
                  </div>
                )}
              </div>
            )}
            {purchasedPublications.map((purchasedPublication) => (
              <div className="mt-2" key={purchasedPublication.id}>
                <label
                  htmlFor={`purchased-publication-${purchasedPublication.id}`}
                  className=" bg-white rounded-full px-4 py-2 w-full flex gap-2 items-center max-w-sm"
                >
                  <input
                    id={`purchased-publication-${purchasedPublication.id}`}
                    name={`purchased-publication-${purchasedPublication.id}`}
                    type="checkbox"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    defaultChecked={selectedPurchasedPublications.includes(
                      purchasedPublication.id
                    )}
                    onChange={(e) =>
                      handlePublicationSelect(e, purchasedPublication.id)
                    }
                  />
                  <span className="select-none">
                    {
                      purchasedPublication?.attributes?.publication?.data
                        ?.attributes?.name
                    }
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SiteWrapper>
  );
}

export const getServerSideProps = async (context) => {
  const { query, req, params } = context;
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
        destination: "/login?return_url=/campaigns/questionnaire",
      },
    };
  }

  let purchasedPublications = await API.purchasedPublications
    .find({ session, only_show_unused: true })
    .then(function (result) {
      return result.data?.data;
      return publications;
    })
    .catch((err) => {
      console.log(err);
      return [];
    });

  return {
    props: {
      session,
      purchasedPublications,
      siteData,
    },
  };
};

export default Example;
