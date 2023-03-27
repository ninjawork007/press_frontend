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
import API from "@/lib/api";
import { UploadIcon, TrashIcon } from "@heroicons/react/outline";

import Link from "next/link";
import {
  LockClosedIcon,
  ArrowNarrowLeftIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/solid";
import { getSession, useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { BarLoader } from "react-spinners";
import WritingGuidelines from "@/components/writing-guidelines";
import SiteWrapper from "@/components/siteWrapper";

import classNames from "classnames";
import { MoonLoader } from "react-spinners";

function Example({ siteData, campaign }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPublications, setSelectedPublications] = useState([]);
  const [openGuidelines, setOpenGuidelines] = useState(false);
  const [purchasedPublications, setPurchasedPublications] = useState([]);

  const [form, setForm] = useState({
    name: "",
  });
  const [articles, setArticles] = useState([]);

  // useEffect(() => {

  //   if (!session) {
  //     router.replace('/login');
  //   }
  // }, [session])

  useEffect(() => {
    if (session) {
      fetchPurchasedPublications();
    }
  }, [session]);

  const fetchPurchasedPublications = async () => {
    let purchasedPublicationsData = await API.purchasedPublications
      .getForProfile({
        profile_id: session?.profile?.id,
        only_show_unused: true,
      })
      .then(function (result) {
        return result.data?.data;
        // const publications = result.data?.data.map(function(purchasedPublication) {
        //   return purchasedPublication.attributes.publication.data
        // })

        // return publications
      })
      .catch((err) => {
        console.log(err);
        return [];
      });

    setPurchasedPublications(purchasedPublicationsData);
  };

  const deleteFile = async (e, index) => {
    e.preventDefault();
    setSelectedPublications(
      selectedPublications.filter(
        (publication) => publication !== articles[index].purchased_publication
      )
    );
    setArticles(articles.filter((article, i) => i !== index));
  };

  const handlePublicationSelect = (e, index) => {
    e.preventDefault();
    let purchasedPublicationId = e.target.value;
    const purchasedPublication = purchasedPublications.find(
      (purchasedPublication) =>
        purchasedPublication.id == purchasedPublicationId
    );

    if (purchasedPublication?.attributes?.publication?.data?.id == 159) {
      alert(
        "Our contributor must write the article for you and you must fill out our questionnaire"
      );
      return;
    }

    articles[index].purchased_publication = purchasedPublicationId;

    if (e.target.value) {
      let newSelectedPublications = [...selectedPublications];
      if (articles[index].purchased_publication) {
        newSelectedPublications = newSelectedPublications.filter(
          (publication) => publication == articles[index].purchased_publication
        );
      }

      setSelectedPublications([
        ...newSelectedPublications,
        purchasedPublicationId,
      ]);
    } else {
      setSelectedPublications(
        selectedPublications.filter(
          (publication) => publication == purchasedPublicationId
        )
      );
    }
    // alert(articles[index].publication)
  };

  const setFile = (files) => {
    // console.log(file)
    var article = {};
    article.file = files[0];
    article.name = files[0].name.replace(/\.[^/.]+$/, "");
    setArticles([...articles, article]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedPublications.length < articles.length) {
      alert("you need to select an outlet for each article");
      return;
    }

    setIsSubmitting(true);
    var profile = session.profile;

    const campaignId = campaign.id;
    var articlePromises = articles.map((article) => {
      let data = {
        article,
        campaignId: campaignId,
        approved_for_publishing: form.approved_for_publishing,
      };

      return API.articles
        .upload(data, session)
        .then(function (result) {
          return result;
        })
        .catch((err) => {
          console.log(err);
          return null;
        });
    });

    await Promise.all(articlePromises)
      .then(function () {
        // router.replace("/dashboard")
        router.replace(`/campaigns/${campaignId}`);
      })
      .catch((err) => {
        console.log(err);
        setIsSubmitting(false);
        return null;
      });
  };

  // ARROW FUNCTIONS
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type == "checkbox" ? e.target.checked : e.target.value,
    });
  };

  const checkPurchases = (e) => {
    if (purchasedPublications.length <= articles.length) {
      alert(
        "You don't have any more publication orders. Please purchase more outlets if you would like more articles for this campaign."
      );
      e.preventDefault();
    }
  };

  const PRGuidelines = () => {
    return (
      <div className="flex items-center gap-2 text-gray-600 font-bold">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
          />
        </svg>

        <a
          className="underline cursor-pointer"
          onClick={() => setOpenGuidelines(true)}
        >
          View Press Release Guidelines
        </a>
      </div>
    );
  };

  return (
    <SiteWrapper siteData={siteData}>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          <div className="space-y-4">
            <a
              className="flex items-center gap-2 text-gray-500"
              onClick={() => router.back()}
            >
              <ArrowNarrowLeftIcon
                className="block h-6 w-6"
                aria-hidden="true"
              />

              <p className="font-bold">Back</p>
            </a>

            <h2 className="pt-10 text-5xl text-gray-900">
              Upload Your Articles
            </h2>
            <p>
              Upload your articles below and select outlets. <br />{" "}
              <b className="text-indigo-700">
                *Each article MUST be unique and contain a headline/title at the
                top of the document
              </b>
            </p>
            {/* */}
          </div>

          {isSubmitting ? (
            <>
              <span className="flex items-center flex-col justify-center space-y-2">
                <BarLoader color={"#3B2CBC"} loading={isSubmitting} />

                <span className="font-medium text-gray-600">
                  Uploading your articles...
                </span>
              </span>
            </>
          ) : (
            <>
              <form onSubmit={handleSubmit}>
                <div className="bg-white p-6 space-y-4 rounded-3xl">
                  <p
                    className={classNames(
                      "",
                      purchasedPublications.length -
                        selectedPublications.length >
                        0
                        ? "text-indigo-500"
                        : "text-red-500"
                    )}
                  >
                    You have{" "}
                    {purchasedPublications.length - selectedPublications.length}{" "}
                    purchased outlet(s) available
                  </p>
                  {purchasedPublications.length - selectedPublications.length <=
                    0 && (
                    <p>
                      <span className="text-gray-500">
                        If you need more publications, you can buy additional
                        ones&nbsp;
                      </span>
                      <Link href="/publications">
                        <a className="text-indigo-800 font-bold underline">
                          here
                        </a>
                      </Link>
                    </p>
                  )}
                  <label className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
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
                      onClick={checkPurchases}
                      onChange={(e) => setFile(e.target.files)}
                    />
                  </label>
                </div>

                {articles.length > 0 && (
                  <div className="flex flex-col space-y-4 mt-4">
                    {articles.map((article, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-4 space-y-2"
                      >
                        <p className="font-bold text-gray-600 max-w-xs text-left flex-grow break-words">
                          Article #{index + 1}
                        </p>

                        <div className="flex justify-between items-start gap-4 bg-white rounded-lg border border-indigo-50 p-4">
                          <p className="font-bold text-gray-600 max-w-xs text-left flex-grow break-words">
                            {article?.name}
                          </p>

                          <button
                            className="flex-none relative whitespace-nowrap inline-flex items-center justify-center text-gray-500 hover:text-indigo-600 font-bold"
                            onClick={(e) => deleteFile(e, index)}
                            id={index}
                          >
                            <TrashIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                        <label
                          htmlFor="publication"
                          className="block text-sm font-bold text-gray-700"
                        >
                          Select Outlet
                        </label>

                        <select
                          id={`publication-${index}`}
                          name="publication"
                          className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                          placeholder="Select an outlet"
                          value={
                            article.purchased_publication
                              ? article.purchased_publication
                              : "Select an outlet"
                          }
                          onChange={(e) => handlePublicationSelect(e, index)}
                        >
                          <option value={""}>
                            Please select a publication
                          </option>
                          {purchasedPublications.length > 0 ? (
                            purchasedPublications.map(
                              (
                                purchasedPublication,
                                purchasedPublicationIndex
                              ) => (
                                <option
                                  key={purchasedPublication.id}
                                  value={purchasedPublication.id}
                                >
                                  {
                                    purchasedPublication.attributes.publication
                                      ?.data?.attributes?.name
                                  }
                                </option>
                              )
                            )
                          ) : (
                            <option>No purchases found</option>
                          )}
                        </select>
                      </div>
                    ))}
                  </div>
                )}

                <div className="relative mt-4 bg-white p-6 rounded-3xl space-y-4">
                  <p className="text-xl font-medium">Agreements</p>
                  <div className="flex p-4 border rounded-2xl">
                    <div className="flex items-center h-5">
                      <input
                        id="approved_for_publishing"
                        aria-describedby="approved_for_publishing-description"
                        name="approved_for_publishing"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        value={form.approved_for_publishing}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="approved_for_publishing"
                        className="font-medium text-gray-700"
                      >
                        Publish my articles automatically if approved
                      </label>
                      <p
                        id="approved_for_publishing-description"
                        className="text-gray-500"
                      >
                        I agree with the{" "}
                        <Link href="/terms">
                          <a target="_blank">
                            <span className="font-bold">
                              Terms and Conditions
                            </span>
                          </a>
                        </Link>
                      </p>
                    </div>
                  </div>{" "}
                </div>

                <div className="bg-gray-50 py-3 ">
                  <button
                    className="button large w-full"
                    disabled={
                      selectedPublications.length <= 0 ||
                      !form.approved_for_publishing ||
                      isSubmitting
                    }
                  >
                    {isSubmitting ? (
                      <MoonLoader size={20} color={"#fff"} />
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        <WritingGuidelines open={openGuidelines} setOpen={setOpenGuidelines} />
      </div>
      ``
    </SiteWrapper>
  );
}

export const getServerSideProps = async (context) => {
  const { query, req, params } = context;
  const session = await getSession({ req });
  const { site } = params;
  const { id } = query;

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

  let initialCampaign = await API.campaigns
    .findOne(id, session)
    .then(function (result) {
      console.log(result.data?.data);
      return result.data?.data;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

  return {
    props: {
      session,
      campaign: initialCampaign,
      siteData,
    },
  };
};

export default Example;
