import Modal from "../modal.js";
import { useState } from "react";

export default function GoogleDocUpload({
  handleSubmit,
  isOpen,
  handleClose,
  googleDocFieldRefUrl,
}) {
  const [isInvalidUrl, setIsInvalidUrl] = useState(false);
  const checkUrl = () => {
    const url = googleDocFieldRefUrl.current.value;
    var urlreg =
      /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    setIsInvalidUrl(true);
    if (urlreg.test(url)) {
      setIsInvalidUrl(false);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left space-y-4 w-full">
              <h3 className="text-xl">Upload Doc</h3>
              <p className="max-w-lg">
                Please click {`"Share"`}, enable {`"Anyone with the link"`}, and
                select
                {`"Editor"`}, and then click {`"Copy link"`} and paste below to
                allow for the client to view {"&"} edit this document.{" "}
              </p>
              <input
                className="input"
                ref={googleDocFieldRefUrl}
                id="google_doc_url"
                name="google_doc_url"
                placeholder="Enter google doc url here"
                required
                onChange={checkUrl}
              />
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 sm:flex sm:flex-row gap-2 absolute">
          {isInvalidUrl && (
            <p className="sm:ml-4 text-red-500">Please provide a valid URL</p>
          )}
        </div>

        <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
          <input
            className="button"
            type="submit"
            value="Submit"
            // onClick={() => setIsOpen(false)}
            disabled={isInvalidUrl}
          />
        </div>
      </form>
    </Modal>
  );
}
