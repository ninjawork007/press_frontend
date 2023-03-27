import Modal from "@/components/modal.js";
import { useEffect, useState, useRef, useCallback } from "react";
import API from "@/lib/api";
import { MoonLoader } from "react-spinners";

export default function TalkToSalesModal({ isOpen, handleClose, site_id }) {
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
    };

    setIsSubmitting(true);

    console.log("form", form);
    console.log("formData", formData);
    console.log("entries", entries);
    console.log("data", data);

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
      <form onSubmit={handleSubmit} className="w-72 md:w-96 lg:w-[566px]">
        <div className="px-4 pt-5 pb-8">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left space-y-4 w-full">
              <h3 className="text-4xl text-center">Talk to Sales</h3>
              {didSubmit ? (
                <p className="text-gray-500 text-center">
                  Thank you for your inquiry! We will be in touch with you
                  shortly.
                </p>
              ) : (
                <>
                  <p className="max-w-lg">
                    We understand the importance of making informed decisions
                    when it comes to your business. Our team of experts is
                    dedicated to providing you with the support and guidance you
                    need to succeed.
                  </p>
                  <div>
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
                  <div>
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
                  <div>
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
                  <div>
                    <label htmlFor="notes" className="label">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      type="text"
                      className="input"
                      placeholder="Let us know your goals and objectives so we can best assist you."
                      required
                      rows="5"
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
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                              />
                            </svg>

                            <span>Send Inquiry</span>
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
