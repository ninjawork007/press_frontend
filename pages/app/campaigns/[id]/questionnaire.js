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
import {
  PlusIcon,
  DocumentIcon,
  DownloadIcon,
  UploadIcon,
  DocumentTextIcon,
} from "@heroicons/react/outline";

import Link from "next/link";
import { LockClosedIcon, ArrowNarrowLeftIcon } from "@heroicons/react/solid";
import { getSession, useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { BarLoader } from "react-spinners";
import Navbar from "@/components/navbar";

import classNames from "classnames";
function Example({ siteData, campaign }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const [form, setForm] = useState({
    name: "",
  });
  const [files, setFiles] = useState([]);
  const [purchasedPublications, setPurchasedPublications] = useState([]);

  useEffect(() => {
    fetchPurchasedPublications();
  }, []);

  const fetchPurchasedPublications = async () => {
    let purchasedPublicationsData = await API.purchasedPublications
      .getForProfile({
        profile_id: campaign?.attributes?.profile?.data?.id,
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

    setIsUploadingFile(true);

    var campaignId = campaign.id;

    if (files && files.length > 0) {
      const formData = new FormData();

      formData.append("files", files[0]);
      formData.append("ref", "api::campaign.campaign");

      formData.append("field", "questionnaire");
      formData.append("refId", campaignId);

      const questionnaire = await API.campaigns.uploadFiles(formData, session);
    }

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

    return Promise.all(articlePromises)
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
    <>
      <Navbar isManager={true} />

      <div className="min-h-full max-w-2xl mx-auto container py-12  px-4 sm:px-6 lg:px-8">
        <a
          className="flex items-center gap-2 text-gray-500"
          onClick={() => router.back()}
        >
          <ArrowNarrowLeftIcon className="block h-6 w-6" aria-hidden="true" />

          <p className="font-bold">Back</p>
        </a>

        <div className="flex flex-col gap-4 justify-center mt-6">
          {campaign?.attributes?.questionnaire?.data ? (
            <div>
              <h2 className="text-4xl text-gray-900">Add more articles</h2>
              <div
                className="flex items-center cursor-pointer pt-2 gap-1"
                onClick={() =>
                  downloadURI(
                    campaign?.attributes?.questionnaire?.data?.attributes?.url,
                    `${campaign?.attributes?.questionnaire?.data?.attributes?.name} Questionnaire`
                  )
                }
              >
                <DocumentTextIcon
                  className="h-6 w-6 text-gray-400"
                  aria-hidden="true"
                />

                <a className="text-gray-700 font-medium">
                  View My Questionnaire
                </a>
              </div>
              <form onSubmit={uploadQuestionnaire}>
                <div className="mt-8">
                  <button
                    className={classNames("button large w-full")}
                    type="submit"
                    disabled={isUploadingFile}
                  >
                    {!isUploadingFile ? "Submit" : "Uploading..."}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-8 col-span-2">
              <div>
                <h2 className="text-4xl text-gray-900">Questionnaire</h2>
                <p className="mt-4">
                  To help our writers in creating the best story for you, we’ll
                  need a better understanding of your brand. Please download the
                  questionnaire (word doc) and upload the completed version
                </p>
              </div>

              <a
                className="button-secondary gap-2"
                onClick={() => downloadURI()}
              >
                <DownloadIcon className="mx-auto h-4 w-4" aria-hidden="true" />

                <span className="">Download Questionnaire</span>
              </a>

              <form
                onSubmit={uploadQuestionnaire}
                className="bg-white p-6 rounded-3xl space-y-6"
              >
                <h3 htmlFor="about" className=" !text-2xl">
                  Upload Completed Questionnaire
                </h3>
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
                    disabled={(files && files.length <= 0) || isUploadingFile}
                  >
                    {!isUploadingFile ? "Submit" : "Uploading..."}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-2xl">
            <div className="p-6 ">
              <h3 className="text-2xl">Purchased publications</h3>
              <p>Select the ones you want included in this campaign</p>
            </div>
            <hr />
            <div className="p-6 ">
              {selectedPurchasedPublications.length <= 0 && (
                <div className="">
                  {purchasedPublications.length > 0 ? (
                    <p className="text-red-500">
                      Please select at least one publication for this campaign
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <Link href="/publications">
                        <a className="button w-full large">
                          <span className="">Purchase Publications</span>
                        </a>
                      </Link>
                      <p className="text-red-500 text-center">
                        You have no available publication credits. Please
                        purchase one to continue
                      </p>
                    </div>
                  )}
                </div>
              )}
              {purchasedPublications.map((purchasedPublication) => (
                <div
                  className={classNames(
                    "mt-2 border rounded-2xl",
                    selectedPurchasedPublications.includes(
                      purchasedPublication.id
                    ) && "border-indigo-500"
                  )}
                  key={purchasedPublication.id}
                >
                  <label
                    htmlFor={`purchased-publication-${purchasedPublication.id}`}
                    className=" bg-white rounded-full px-4 py-4 w-full flex gap-2 items-center max-w-sm"
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
      </div>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { query, req, params } = context;
  const session = await getSession({ req });
  const { site } = params;
  // console.log("site params", site)
  // let siteData;
  // if (site.includes(".")) {
  //   siteData = await API.sites.get({ customDomain: site });
  // } else {
  //   siteData = await API.sites.get({ subdomain: site });
  // }
  const { id } = query;

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
      // siteData,
    },
  };
};

export default Example;
