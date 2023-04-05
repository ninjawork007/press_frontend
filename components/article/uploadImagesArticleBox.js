import DateHandler from "@/lib/date-handler";
import Link from "next/link";
import StatusLabel from "@/components/statusLabel";
import { BarLoader } from "react-spinners";
import { UploadIcon, TrashIcon, DownloadIcon } from "@heroicons/react/outline";
import CampaignManager from "@/lib/campaignManager";
import classNames from "classnames";

export default function uploadImagesArticleBox({
  article,
  isUploadingImage,
  uploadImage,
}) {
  return (
    <div className="mt-4 space-y-4 border rounded-lg bg-white p-6">
      <form>
        <label className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
          {isUploadingImage ? (
            <>
              <span className="flex items-center flex-col justify-center space-y-2">
                <BarLoader color={"#3B2CBC"} loading={isUploadingImage} />

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
                    Click to upload
                  </span>{" "}
                  <span>
                    or drag and drop images <br /> JPG or PNG (max. 4MB)
                  </span>
                </span>
              </span>
              <input
                type="file"
                name="file_upload"
                className="hidden"
                accept=".jpg,.jpeg,.png,.svg"
                onChange={(e) => uploadImage(e)}
              />
            </>
          )}
        </label>
      </form>
    </div>
  );
}
