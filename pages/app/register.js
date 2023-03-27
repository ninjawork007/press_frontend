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
import Navbar from "@/components/navbar";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/solid";
import { getSession, useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import API from "@/lib/api";
import { useState, useEffect, Profiler } from "react";
import { MoonLoader } from "react-spinners";
import SiteWrapper from "@/components/siteWrapper";

function Example({ siteData }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [form, setForm] = useState({});
  const [requiresConfirmation, setRequiresConfirmation] = useState(false);

  const slides = [
    {
      content:
        "The links and press we have been able to acquire from Presscart have transformed how our business looks online when you google our brand name, not to mention delivering a significant amount of new organic traffic.",
      name: "Remon Aziz",
      position: "[Position]",
      logo: "https://press-bucket.s3.ca-central-1.amazonaws.com/Logo_Advantage_Rent_a_car_Theme_Color_73bc1119d3.png?updated_at=2023-01-09T01:59:30.231Z",
    },
  ];

  // useEffect(() => {
  //   if (session) {
  //     router.replace('/dashboard');
  //   }
  // }, [])

  // useEffect(() => {
  //   if (isSigningUp) {
  //     setIsSigningUp(false);

  //     const data = API.profiles.create({
  //       data: {
  //         name: form.company,
  //         company_type: form.company_type
  //       }}, session).then(function(result) {
  //       return result?.data?.data
  //     }).catch((err) => {
  //       setErrorMessage(err.message)
  //       console.log(err)
  //       return null
  //     })
  //     // if (data) {
  //     //   router.replace('/publications');
  //     // }
  //   }
  // } , [isSigningUp])

  const handleChange = (e) => {
    e.preventDefault();
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSigningUp(true);
    const result = await API.auth
      .signUp({
        username: `${siteData?.attributes.name}+${form.email}`,
        email: form.email,
        password: form.password,
      })
      .then((res) => {
        const user = res.data.user;
        // console.log('User: ', user);

        return API.profiles
          .create({
            data: {
              name: form.company,
              company_type: form.company_type,
              users: [user.id],
              email: form.email,
            },
          })
          .then(function (profileRes) {
            if (profileRes.status == 200) {
              setRequiresConfirmation(true);
            } else {
              setErrorMessage(res.data.message);
            }
            setIsSigningUp(false);

            return profileRes;
          });
      })
      .catch((err) => {
        setErrorMessage("This email is already in use. Please try logging in");
        console.log(err.message);
        setIsSigningUp(false);

        return null;
        // alert(err.message)
      });

    // if (result && result.ok) {
    //   return;
    // }
    // alert('Credential is not valid');
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
                      <div className="p-6 sm:p-12 bg-gradient-to-b from-[#FEFDFE] to-[#F8F7FC] rounded-[48px] h-full flex flex-col items-start max-w-[580px] sm:mx-auto lg:mx-auto xl:mx-0">
                        <p className="text-base lg:text-xl text-gray-700 grow mt-1">
                          {`"${slide.content}"`}
                        </p>
                        <div className="flex flex-row items-center w-full">
                          <div className="w-full">
                            <div className="flex justify-between w-full items-center">
                              <div className="flex flex-row gap-2 justify-center">
                                <div className="flex flex-row gap-2 justify-center">
                                  <img src="/Avatar.png" alt="Yotpo" />
                                  <div className="flex flex-col">
                                    <p className="text-sm font-bold text-gray-700">
                                      {slide.name}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                      {slide.position}
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
    <>
      <Navbar name="Press Backend" isManager={true} />
      <div className="min-h-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col xl:flex-row gap-4 max-w-[390px] sm:max-w-[390px] md:max-w-[490px] xl:max-w-[1512px] space-y-8">
          {requiresConfirmation ? (
            <div className="p-8 relative bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 max-w-[688px]">
              <div className="space-y-6">
                <div className="flex flex-col items-center gap-4 justify-between">
                  <div class="flex flex-col lg:flex-row gap-4 w-full justify-start items-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-50 text-indigo-500 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                        />
                      </svg>
                    </div>
                    <h3 className="text-4xl lg:text-5xl text-gray-900 tracking-tight capitalize lg:text-center m-0">
                      Confirm your email
                    </h3>
                  </div>
                  <div className="flex flex-row w-full mb-[9px]">
                    <p>
                      We just sent an email to <b>{form.email}.</b> Please check
                      your inbox and click the link in the email to confirm your
                      account. If you {"don't"} see the email in your inbox,
                      please check your spam folder. If you still {"don't"} see
                      it, please contact us and {"we'll"} help you out. Thank
                      you for joining Presscart!
                    </p>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-4 w-full justify-start">
                    <Link href={`mailto:${siteData.attributes.email}`}>
                      <a className="button-secondary  !py-4 !px-6 h-[56px]">
                        Contact Us
                      </a>
                    </Link>
                    <Link href="/register">
                      <a className="button !py-4 !px-6 h-[56px] lg:w-[461px]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-5 h-5 mr-2"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                          />
                        </svg>

                        <span>Resend Confirmation Email</span>
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col">
                <h2 className="text-4xl lg:text-6xl text-gray-900 tracking-tight text-left lg:text-center xl:text-left">
                  Get Access to the <br /> Pricing Today
                </h2>
                <p className="mt-2 text-lg text-gray-600 text-left lg:text-center xl:text-left">
                  Get started with an account to view pricing for all 200+ of
                  our
                  <br className="hidden lg:flex" />
                  outlets today!
                </p>

                <div className="hidden lg:flex">
                  <Slider />
                </div>
              </div>
              <div className="p-8 relative bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8">
                <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                  <input type="hidden" name="remember" defaultValue="true" />
                  <div className="rounded-md shadow-sm space-y-2">
                    <div>
                      <label
                        htmlFor="company"
                        className="text-base text-gray-700 font-bold mb-2 block"
                      >
                        Company Name
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="company"
                        autoComplete="company"
                        onChange={handleChange}
                        className="input h-[44px]"
                        placeholder="Enter your company name"
                      />
                    </div>
                    <div className="mt-4 space-y-2">
                      <label
                        htmlFor="company_type"
                        className="text-base text-gray-700 font-bold mb-2 block"
                      >
                        Select Company Type
                      </label>

                      <select
                        id="company_type"
                        name="company_type"
                        onChange={handleChange}
                        className="input h-[44px]"
                        placeholder="Select a type"
                        defaultValue="Select a type"
                      >
                        <option value="">Select a type</option>
                        <option value="business-brand">Business/Brand</option>
                        <option value="personal">Individual</option>
                        <option value="agency">Agency</option>
                        <option value="publicist">Publicist</option>
                        <option value="affiliate">Affiliate</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="email-address"
                        className="text-base text-gray-700 font-bold mb-2 block"
                      >
                        Email address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        onChange={handleChange}
                        autoComplete="email"
                        required
                        className="input h-[44px]"
                        placeholder="Enter your email address"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="text-base text-gray-700 font-bold mb-2 block"
                      >
                        Password
                      </label>
                      <input
                        id="password"
                        name="password"
                        onChange={handleChange}
                        type="password"
                        autoComplete="current-password"
                        required
                        className="input h-[44px]"
                        placeholder="Set a password"
                      />
                      <p className="mt-1 text-sm text-gray-600">
                        It should have 8 characters minimum
                      </p>
                    </div>
                    {/* <div>
                  <label htmlFor="confirm-password" className="text-base text-gray-700 font-bold mb-2 block">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    onChange={handleChange}
                    type="password"
                    autoComplete="current-password"
                    required
                    className="input h-[44px]"
                    placeholder="Confirm Password"
                  />
                </div> */}
                  </div>
                  <p className="text-red-500">{errorMessage}</p>

                  <div className="space-y-4">
                    <button
                      className="w-full button large"
                      type="submit"
                      disabled={isSigningUp}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {isSigningUp ? (
                          <MoonLoader size={20} color={"#fff"} loading={true} />
                        ) : (
                          <>
                            <span className="">Create Account</span>
                          </>
                        )}
                      </span>
                    </button>

                    <Link href="/login">
                      <button className="w-full" type="submit">
                        <span className="flex items-center justify-center gap-2">
                          <span>
                            <span className="text-sm text-gray-700 font-bold">
                              Already have an account?
                            </span>

                            <span className="text-sm font-bold text-indigo-600 hover:text-indigo-500 ml-1">
                              Login
                            </span>
                          </span>
                        </span>
                      </button>
                    </Link>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
        <div className="flex lg:hidden">
          <Slider />
        </div>
        {/* <div className="flex flex-col lg:flex-row gap-10 items-center mt-20">
          <p className="text-lg text-gray-600">You're in good company</p>
          <div class="flex flex-row gap-10 items-center">
            <div className="flex justify-center">
              <img className="h-10" src="/ibm.svg" alt="IBM" />
            </div>
            <div className="flex justify-center">
              <img className="h-10" src="/universal.svg" alt="Universal" />
            </div>
            <div className="flex justify-center">
              <img className="h-10" src="/corona.svg" alt="Corona" />
            </div>
            <div className="flex justify-center">
              <img className="h-10" src="/republic.svg" alt="Republic" />
            </div>
            <div className="flex justify-center">
              <img className="h-10" src="/boxed-water.svg" alt="Boxed Water" />
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
}

export default Example;
