import Navbar from "@/components/navbar";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/solid";
import { getSession, useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import API from "@/lib/api";
import { useState, useEffect, Profiler } from "react";
import { MoonLoader } from "react-spinners";
import SiteWrapper from "@/components/siteWrapper";
import * as klaviyo from "@/lib/tracking/klaviyo";
import PhoneNumberInput from "@/components/phoneNumberInput";

function EmailCapture({ siteData }) {
  const { data: session } = useSession();

  const [errorMessage, setErrorMessage] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({});
  const [formSent, setFormSent] = useState(false);

  const handleChange = (e) => {
    e.preventDefault();
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await API.leads
      .create({
        data: {
          name: form.name,
          job_title: form.job_title,
          email: form.email,
          phone: form.phone,
        },
      })
      .then(function (profileRes) {
        if (profileRes.status == 200) {
          setFormSent(true);
        } else {
          setErrorMessage(res.data.message);
        }
        setIsSubmitting(false);

        return profileRes;
      })
      .catch((err) => {
        setErrorMessage("There was an error, please try again");
        console.log(err.message);
        setIsSubmitting(false);

        return null;
      });
  };

  return (
    <>
      <div className="relative text-left overflow-hidden transform transition-all w-full space-y-2">
        <form
          className="space-y-6 flex items-center gap-2 w-full"
          onSubmit={onSubmit}
        >
          <input type="hidden" name="remember" defaultValue="true" />

          {/* <div>
                  <label
                    htmlFor="company"
                    className="text-base text-gray-700 font-bold mb-2 block"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    onChange={handleChange}
                    className="input h-[44px]"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label
                    htmlFor="company"
                    className="text-base text-gray-700 font-bold mb-2 block"
                  >
                    Job Title
                  </label>
                  <input
                    id="job_title"
                    name="job_title"
                    type="text"
                    autoComplete="job_title"
                    onChange={handleChange}
                    className="input h-[44px]"
                    placeholder="e.g. Marketing Director"
                  />
                </div> */}

          <input
            id="email"
            name="email"
            type="email"
            onChange={handleChange}
            autoComplete="email"
            required
            className="input !px-6 !py-4 !rounded-full flex-grow"
            placeholder="Your business email"
          />

          {/* <div>
                  <label htmlFor="about" className="label">
                    Phone Number
                  </label>
                  <PhoneNumberInput
                    id="phone"
                    name="phone"
                    type="text"
                    className="input"
                    onChange={handleChange}
                    required
                    placeholder="e.g. 555 555 5555"
                  />
                </div> */}

          <button
            className="button large flex-none"
            type="submit"
            disabled={isSubmitting}
          >
            <span className="flex items-center justify-center gap-2">
              {isSubmitting ? (
                <MoonLoader size={20} color={"#fff"} loading={true} />
              ) : (
                <>
                  <span className="">Get Started</span>
                </>
              )}
            </span>
          </button>
        </form>
        {formSent && (
          <div className="text-center">
            <p className="text-green-500 font-bold">
              Thanks for signing up! {"We'll"} be in touch soon with next steps.
            </p>
          </div>
        )}
        <p className="text-red-500">{errorMessage}</p>
        <p className="text-gray-500">
          By submitting this form, you agree with the{" "}
          <Link href="/terms">
            <span className="text-sm text-gray-700 font-bold inline cursor-pointer">
              Terms
            </span>
          </Link>{" "}
          and{" "}
          <Link href="/privacy">
            <span className="text-sm text-gray-700 font-bold inline cursor-pointer">
              Privacy Policy
            </span>
          </Link>
        </p>
      </div>
    </>
  );
}

export default EmailCapture;
