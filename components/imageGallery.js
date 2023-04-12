import { TrashIcon, DownloadIcon } from "@heroicons/react/outline";
import { saveAs } from 'file-saver'

export default function ImageGallery({ images, deleteImage, isManager }) {
  const downloadURI = async (uri, name) => {
    try {
      const headers = new Headers();
      headers.append('Content-Disposition', 'attachment');


      const response = await fetch(uri, {
        headers
      });

      if (!response.ok) {
        throw new Error(response);
      }

      const blob = await response.blob();
      saveAs(blob, name);

    } catch (error) {
      console.error('Failed to download file', error);
    }
  };

  return (
    <div className="">
      {images?.length > 0 ? (
        <div className="flex flex-col space-y-4">
          {images?.map((image, index) => (
            <div
              className="flex justify-between items-start gap-4 bg-white rounded-lg border border-indigo-50 p-4"
              key={index}
            >
              <div className="flex gap-4 items-center">
                <img
                  src={image.attributes.url}
                  className="h-8 w-8 rounded-full"
                  alt=""
                />
                <p className="font-bold text-gray-600 max-w-xs text-left flex-grow break-words">
                  {image.attributes.name}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                {!isManager && (
                  <button
                    className="flex-none relative whitespace-nowrap inline-flex items-center justify-center text-gray-500 hover:text-indigo-600 font-bold"
                    onClick={(e) => deleteImage(e, image.id)}
                    id={image.id}
                  >
                    <TrashIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                )}

                <button
                  className="flex-none relative whitespace-nowrap inline-flex items-center justify-center text-gray-500 hover:text-indigo-600 font-bold"
                  onClick={() =>
                    downloadURI(
                      image.attributes.url,
                      `${image.attributes.name}`
                    )
                  }
                >
                  <DownloadIcon
                    className="h-6 w-6 text-gray-400"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="mt-2 text-sm font-medium text-gray-900">
            No images uploaded
          </p>
        </div>
      )}
    </div>
  );
}
