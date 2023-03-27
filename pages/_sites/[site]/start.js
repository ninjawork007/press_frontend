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

function Start({ siteData }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({});
  const [formSent, setFormSent] = useState(false);

  const slides = [
    {
      content:
        "The links and press we have been able to acquire from Presscart have transformed how our business looks online when you google our brand name, not to mention delivering a significant amount of new organic traffic.",
      name: "Remon Aziz",
      position: "[Position]",
      logo: "https://press-bucket.s3.ca-central-1.amazonaws.com/Logo_Advantage_Rent_a_car_Theme_Color_73bc1119d3.png?updated_at=2023-01-09T01:59:30.231Z",
    },
  ];

  useEffect(() => {
    console.log("siteData", siteData.attributes);
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendConfirmationEmail = (e) => {
    e.preventDefault();
    API.auth.sendConfirmation({
      email: form.email,
    });
    alert("Confirmation email sent");
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
          site: siteData.id,
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

  const Slider = ({ type, title, handleClick }) => {
    return (
      <div className="w-full space-y-10 mt-10">
        <div className="slider">
          <ul className="slider__wrapper">
            {slides.map((slide, index) => {
              return (
                <li key={index} className="slide mx-2 image slide--current">
                  <div className="slide__image-wrapper">
                    <div className=" h-full">
                      <div className="p-6 sm:p-12 bg-gradient-to-b from-[#FEFDFE] to-[#F8F7FC] rounded-[48px] h-full flex flex-col items-start max-w-[580px] sm:mx-auto lg:mx-0">
                        <p className="text-base lg:text-xl text-gray-700 grow mt-1">
                          {`"${slide.content}"`}
                        </p>
                        <div className="flex flex-row items-center w-full">
                          <div className="w-full">
                            <div className="flex justify-between w-full items-center">
                              <div className="flex flex-row gap-2 justify-center">
                                <div className="flex flex-row gap-2 justify-center">
                                  <div className="flex flex-col">
                                    <p className="text-sm font-bold text-gray-700">
                                      {slide.name}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <img
                                src="https://press-bucket.s3.ca-central-1.amazonaws.com/Logo_Advantage_Rent_a_car_Theme_Color_73bc1119d3.png?updated_at=2023-01-09T01:59:30.231Z"
                                alt="profile"
                                className="h-12"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <SiteWrapper siteData={siteData}>
      <div className="min-h-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center xl:flex-row gap-4 max-w-[390px] sm:max-w-[390px] md:max-w-[490px] xl:max-w-[1512px] space-y-8">
          {formSent ? (
            <div className="p-8 relative bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 max-w-[688px]">
              <div className="space-y-6">
                <div className="flex flex-col items-center gap-4 justify-between">
                  <div class="flex flex-col lg:flex-row gap-4 w-full justify-start items-center">
                    <h3 className="text-4xl lg:text-5xl text-gray-900 tracking-tight capitalize lg:text-center m-0">
                      Thank you for your interest
                    </h3>
                  </div>
                  <div className="flex flex-row w-full mb-[9px]">
                    <p>
                      {"We're"} excited to show you how our platform can help
                      you secure press coverage with ease. Our team will review
                      your request and get in touch in 24 hours / shortly to
                      schedule a demo that works best for you. We forward to
                      speaking with you soon!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col">
                <h2 className="text-4xl lg:text-6xl text-gray-900 tracking-tight">
                  Access Top Tier Media
                </h2>
                <p className="mt-2 text-lg text-gray-600">
                  Join thousands of satisfied brands and agencies who have
                  already <br />
                  experienced the benefits of our result-driven, <br />
                  transparent, and affordable media placement services.
                </p>

                {siteData?.attributes.is_internal && (
                  <div className="hidden lg:flex">
                    <Slider />
                  </div>
                )}
              </div>
              <div className="p-8 relative bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:w-[450px]">
                <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                  <input type="hidden" name="remember" defaultValue="true" />
                  <div className="rounded-md shadow-sm space-y-2">
                    <div>
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
                    </div>

                    <div>
                      <label
                        htmlFor="email-address"
                        className="text-base text-gray-700 font-bold mb-2 block"
                      >
                        Business Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        onChange={handleChange}
                        autoComplete="email"
                        required
                        className="input h-[44px]"
                        placeholder="e.g. john@company.com"
                      />
                    </div>
                    <div>
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
                    </div>
                  </div>
                  <p className="text-red-500">{errorMessage}</p>

                  <div className="space-y-4">
                    <button
                      className="w-full button large"
                      type="submit"
                      disabled={isSubmitting}
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

                    <p className="">
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
                </form>
              </div>
            </>
          )}
        </div>
        {siteData?.attributes.is_internal && (
          <div className="flex lg:hidden">
            <Slider />
          </div>
        )}
      </div>
    </SiteWrapper>
  );
}

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  const { params } = context;
  const { site } = params;
  // console.log("site params", site)
  let siteData;
  if (site.includes(".")) {
    siteData = await API.sites.get({ customDomain: site });
  } else {
    siteData = await API.sites.get({ subdomain: site });
  }

  return {
    props: {
      siteData,
    },
  };
};

export default Start;
