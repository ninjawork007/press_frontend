import Modal from "../modal.js";
import { useEffect, useState, useRef, useCallback } from "react";
import API from "@/lib/api";
import { MoonLoader } from "react-spinners";

export default function PublicationInquiryModal({
  publication,
  isOpen,
  handleClose,
  site_id,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const phoneNumberRef = useRef();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const entries = Object.fromEntries(formData.entries());
    const data = {
      ...entries,
      site: site_id,
      publication: publication.id,
    };

    setIsSubmitting(true);

    const response = await API.publicationInquiries
      .create({
        data,
      })
      .then((result) => {
        setDidSubmit(true);
        setIsSubmitting(false);
      })
      .catch((err) => {
        setIsSubmitting(false);
      });
  };

  const onClose = () => {
    handleClose();
    setDidSubmit(false);
    setIsSubmitting(false);
  };

  const isNumericInput = (event) => {
    const key = event.keyCode;
    return (
      (key >= 48 && key <= 57) || // Allow number line
      (key >= 96 && key <= 105) // Allow number pad
    );
  };

  const isModifierKey = (event) => {
    const key = event.keyCode;
    return (
      event.shiftKey === true ||
      key === 35 ||
      key === 36 || // Allow Shift, Home, End
      key === 8 ||
      key === 9 ||
      key === 13 ||
      key === 46 || // Allow Backspace, Tab, Enter, Delete
      (key > 36 && key < 41) || // Allow left, up, right, down
      // Allow Ctrl/Command + A,C,V,X,Z
      ((event.ctrlKey === true || event.metaKey === true) &&
        (key === 65 || key === 67 || key === 86 || key === 88 || key === 90))
    );
  };

  const enforceFormat = (event) => {
    // Input must be of a valid number format or a modifier key, and not longer than ten digits
    if (!isNumericInput(event) && !isModifierKey(event)) {
      event.preventDefault();
    }
  };

  const formatToPhone = (event) => {
    if (isModifierKey(event)) {
      return;
    }

    // I am lazy and don't like to type things more than once
    const target = event.target;
    const input = event.target.value.replace(/\D/g, "").substring(0, 10); // First ten digits of input only
    const zip = input.substring(0, 3);
    const middle = input.substring(3, 6);
    const last = input.substring(6, 10);

    if (input.length > 6) {
      target.value = `(${zip}) ${middle} - ${last}`;
    } else if (input.length > 3) {
      target.value = `(${zip}) ${middle}`;
    } else if (input.length > 0) {
      target.value = `(${zip}`;
    }
  };

  const handlePhoneNumberListener = useCallback((inputElement) => {
    if (!inputElement) {
      return;
    }
    inputElement.addEventListener("keydown", enforceFormat);
    inputElement.addEventListener("keyup", formatToPhone);
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="px-4 pt-5 pb-8">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left space-y-4 w-full">
              <p className="text-gray-500 font-bold">
                <span>{publication?.name}</span>
              </p>
              <h3 className="text-xl">Custom Inquiry</h3>
              {didSubmit ? (
                <p className="text-gray-500">
                  Thank you for your inquiry! We will be in touch with you
                  shortly.
                </p>
              ) : (
                <>
                  <p className="max-w-lg">
                    {publication?.name} requires approval from the publisher.
                    Please leave your contact information so that one of our
                    reps can get in touch with you.
                  </p>
                  {/* <p className="text-sm max-w-lg">
                    Please note this article is 40% about the individual/brand
                    being featured and 60% about the {"contributor’s"} category.
                  </p> */}
                  {(publication?.name?.includes("GQ") ||
                    publication?.name?.includes("Vogue")) && (
                    <p className="text-sm max-w-lg text-red-600">
                      Please note that the individual/brand for this
                      article&nbsp;
                      <b>MUST</b>&nbsp;be verified on Instagram.
                    </p>
                  )}

                  <div className="">
                    <label htmlFor="about" className="label">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="input"
                      placeholder="Name"
                      required
                    />
                  </div>
                  <div className="">
                    <label htmlFor="about" className="label">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="input"
                      placeholder="Email"
                      required
                    />
                  </div>
                  <div className="">
                    <label htmlFor="about" className="label">
                      Phone Number
                    </label>
                    <input
                      id="phone_number"
                      name="phone_number"
                      type="text"
                      className="input"
                      placeholder="Phone Number"
                      ref={handlePhoneNumberListener}
                      required
                    />
                  </div>
                  <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                    <button
                      className="w-full button large"
                      type="submit"
                      disabled={isSubmitting}
                      id="submit"
                    >
                      <span className="flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <MoonLoader size={20} color={"#fff"} loading={true} />
                        ) : (
                          <>
                            <span className="">Submit</span>
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
