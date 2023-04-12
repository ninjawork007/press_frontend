/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon, PhotoIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import API from "../lib/api";
import { useRouter } from "next/router";
import CartManager from "@/lib/cart-manager";
import * as priceFormatter from "@/lib/price-formatter";
import UploadImagesArticleBox from "@/components/article/uploadImagesArticleBox";
import ArticleModel from "@/lib/models/article-model";
import ImageGallery from "@/components/imageGallery";

export default function ArticleCardSidebar({
  open,
  setOpen,
  selectedArticle,
  handleRemoveItem,
  site_url, // this is passed in manager for creating a custom order link
  site_id,
  profile_id, // this is passed in manager is creating custom order
  isManager,
}) {
  const { data: session } = useSession();
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const router = useRouter();

  const [article, setArticle] = useState(selectedArticle[0]);

  const uploadImage = async (e) => {
    console.log("uploadImage...", e);
    console.log("article...", article);
    console.log("article.id...", article.id);
    e.preventDefault();
    const files = e.target.files;
    const formData = new FormData();

    console.log({ article, files: files[0] });
    formData.append("files", files[0]);
    formData.append("ref", "api::article.article");
    formData.append("refId", article.id);
    formData.append("field", "images");
    setIsUploadingImage(true);

    API.articles
      .uploadFiles(formData, session)
      .then(function (result) {
        if (checkIfEnoughImages({ justUploadedImage: true })) {
          const updateReviewStatusData = {
            has_enough_images: true,
          };
          return API.articles.update(article.id, session, {
            status: article.status,
            approval_date: article.approval_date,
          });
        } else {
          return;
        }
      })
      .then(function (result) {
        return API.articles
          .findOne(article.id, session)
          .then(function (result) {
            if (result.data?.data) {
              setIsUploadingImage(false);
              let article = new ArticleModel(result.data?.data);
              setArticle(article);
            }
          })
          .catch((err) => {
            console.log(err);
            return null;
          });
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

  const deleteImage = async (e, id) => {
    console.log("id...", id);
    e.preventDefault();
    API.articles
      .deleteImage(id, session)
      .then(function (result) {
        return API.articles
          .findOne(article.id, session)
          .then(function (result) {
            if (result.data?.data) {
              let article = new ArticleModel(result.data?.data);
              setArticle(article);
            }
            return;
          });
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
  };

  const checkIfEnoughImages = ({ justUploadedImage = false }) => {
    console.log("article1...", article);
    let publishedArticleCount =
      article?.status === "publishing" || article?.status === "completed"
        ? 1
        : 0;

    let imagesCount = article?.images?.length || 0;
    if (justUploadedImage) {
      imagesCount++;
    }
    return imagesCount > publishedArticleCount;
  };

  useEffect(() => {
    console.log("selectedArticle...", selectedArticle);
    console.log("article...", article);
  }, []);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-[#F8F7FC] shadow-xl">
                    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-xl font-medium text-gray-900">
                          {" "}
                          {isManager ? (
                            <span>Uploaded Photos</span>
                          ) : (
                            <span>Upload Photos</span>
                          )}
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flow flex-col">
                          <>
                            <p>
                              At least 1 image is required before we are able to
                              publish. These will be added to the articles. We
                              recommend adding 3-5 images, preferably 16:9
                              aspect ratio. Please only use images that you have
                              rights to, otherwise you may be responsible for
                              any fees incurred...
                            </p>
                            <UploadImagesArticleBox
                              article={article}
                              images={article?.images}
                              isUploadingImage={isUploadingImage}
                              uploadImage={uploadImage}
                              deleteImage={deleteImage}
                            />
                          </>

                          <div className="mt-[16px]">
                            <ImageGallery
                              images={article?.images}
                              deleteImage={deleteImage}
                              isManager={isManager}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
