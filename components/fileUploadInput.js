import Link from "next/link";
import { UploadIcon, DocumentIcon } from "@heroicons/react/outline";
import classNames from "classnames";
/* This example requires Tailwind CSS v2.0+ */

export default function Example({
  name,
  files,
  initialFileUrls,
  handleChange,
  isMultiple = false,
  acceptedFileTypes,
}) {
  const renderImageUrl = () => {
    if (files && files.length > 0) {
      const previewUrl = URL.createObjectURL(files[0]);

      return <img src={previewUrl} />;
    } else if (initialFileUrls && initialFileUrls.length > 0) {
      return <img src={initialFileUrls[0]} />;
    } else {
      return (
        <div className="rounded-full bg-indigo-100 p-2">
          <DocumentIcon
            className="h-6 w-6 text-indigo-400 "
            aria-hidden="true"
          />
        </div>
      );
    }
  };

  return (
    <label className={classNames("input", !files && "cursor-pointer")}>
      <span className="flex items-center flex-col justify-center space-y-2">
        <div className="rounded-full bg-gray-50 p-2">
          {!isMultiple &&
          ((files && files.length > 0) ||
            (initialFileUrls && initialFileUrls.length > 0)) ? (
            renderImageUrl()
          ) : (
            <div className="rounded-full bg-indigo-100 p-2">
              <UploadIcon
                className="h-6 w-6 text-indigo-500"
                aria-hidden="true"
              />
            </div>
          )}
        </div>
        <span className="font-medium text-gray-600">
          {!isMultiple && files && files.length > 0 ? (
            <span
              className="text-red-600 font-bold cursor-pointer"
              onClick={() => handleChange([])}
            >
              Click to remove
            </span>
          ) : (
            <span className="text-blue-600 font-bold">Click to upload</span>
          )}
        </span>
      </span>
      <input
        accept={acceptedFileTypes}
        type="file"
        name={name}
        className="hidden"
        disabled={files && files.length > 0}
        onChange={(e) => handleChange(e.target.files)}
      />
    </label>
  );
}
