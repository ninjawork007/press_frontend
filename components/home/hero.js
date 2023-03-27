/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from "react";
import Link from "next/link";
import { Popover, Transition } from "@headlessui/react";
import {
  ArrowRightIcon,
  PlayIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  BellIcon,
  GlobeIcon,
} from "@heroicons/react/outline";
import { ChevronDownIcon } from "@heroicons/react/solid";
import Button from "../button";
import Img from "next/image";
import VideoModal from "../../components/videoModal";
import HoriztontalLeadCaptureForm from "@/components/horiztontalLeadCaptureForm";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Hero({ showVideo, name }) {
  const [openVideo, setOpenVideo] = useState(false);

  return (
    <div className="relative py-[24px] bg-white">
      <div className="w-full h-[628px] top-0 absolute -z-20"></div>

      {/* <div className=" bg-white rounded-br-[48px] w-3/5 h-full absolute -z-20"></div> */}
      {/* <div className=" blue-gradient rounded-[48px] w-1/2 right-0 h-2/3 absolute -z-20"></div> */}

      <main className="lg:relative">
        <div className="flex flex-col-reverse sm:grid grid-cols-2 mx-auto max-w-7xl items-center">
          <div className="w-full pt-0 sm:pt-20 md:pt-24 md:pb-24 lg:text-left">
            {/* <div className=" bg-white rounded-br-[48px] top-0 left-0 w-[120%] h-full absolute -z-20"></div> */}

            <div className="py-12 sm:pt-0 px-5 sm:px-8 xl:pr-16">
              <h1 className="text-gray-900 text-4xl sm:text-6xl !leading-tight tracking-tight">
                We Make it Easy to Get Published Online in 350+ Publications
              </h1>
              <p className="mt-3 max-w-md mx-auto text-lg text-gray-600 sm:text-xl md:mt-5 md:max-w-3xl">
                {name} is a publishing platform where you only pay for
                successful media placements. Get publicity in as little as 24
                hours. No expensive retainers or hidden fees.
              </p>

              {showVideo ? (
                <HoriztontalLeadCaptureForm />
              ) : (
                <div className="mt-10 flex flex-col sm:flex-row items-start sm:justify-center lg:justify-start gap-2">
                  {showVideo && (
                    <a>
                      <button
                        className="button-secondary !py-4 !px-6 h-[56px] flex gap-2 min-w-[193px]"
                        onClick={() => setOpenVideo(true)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                          />
                        </svg>
                        How it works
                      </button>
                      <VideoModal
                        open={openVideo}
                        setOpen={() => setOpenVideo(false)}
                      />
                    </a>
                  )}
                  <Link href="/publications">
                    <a>
                      <button className="button !py-4 !px-6 h-[56px] flex gap-2 min-w-[193px]">
                        View Outlets{" "}
                        <ArrowRightIcon className="h-4 w-4 -rotate-45" />
                      </button>
                    </a>
                  </Link>
                </div>
              )}
              <div className="mt-10 hidden lg:flex flex-col sm:flex-row items-start sm:justify-center lg:justify-start gap-4">
                <p className="text-sm text-gray-600 flex gap-1 items-center">
                  <DocumentTextIcon className="h-4 w-4" />
                  <b>10,000+</b> articles published
                </p>
                <p className="text-sm text-gray-600 flex gap-1 items-center">
                  <img src="/Yotpo.svg" alt="Yotpo" />
                  <b>500+</b> 5 star reviews
                </p>
                <p className="text-sm text-gray-600 flex gap-1 items-center">
                  <GlobeIcon className="h-4 w-4" />
                  <b>200+</b> publications
                </p>
              </div>
            </div>
          </div>
          <div className="w-full pt-10 px-5 sm:p-0 relative overflow-visible">
            {/* <img
              className="hidden sm:block sm:pt-0 object-cover absolute h-[736px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10"
              src="/abstract-background.png"
              alt=""
            /> */}
            <img
              className="sm:w-[350px] lg:w-[639px] lg:h-[579px] z-10"
              src="/hero.png"
              alt=""
            />
            {/* <img
              className="hidden sm:block sm:pt-0 object-cover absolute left-0 -top-10 -right-10 w-[745px] h-[632px] -z-10"
              src="/hero-background.png"
              alt=""
            /> */}
          </div>
        </div>

        {/* <div className="bg-white rounded-3xl h-22 mx-5 sm:mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-3 gap-8 md:grid-cols-6 lg:grid-cols-6">
              <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1 items-center">
                <p className="font-bold text-sm text-gray-600">
                  Some of our clients
                </p>
              </div>
              <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
                <img className="h-12" src="/redbull.png" alt="Tuple" />
              </div>
              <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
                <img className="h-12" src="/universal.svg" alt="Mirage" />
              </div>
              <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
                <img className="h-12" src="/corona.svg" alt="StaticKit" />
              </div>
              <div className="col-span-1 flex justify-center md:col-span-3 lg:col-span-1">
                <img className="h-12" src="/republic.svg" alt="Transistor" />
              </div>
              <div className="col-span-1 flex justify-center md:col-span-3 lg:col-span-1">
                <img className="h-12" src="/boxed-water.svg" alt="Workcation" />
              </div>
            </div>
          </div>
        </div> */}
      </main>
    </div>
  );
}
