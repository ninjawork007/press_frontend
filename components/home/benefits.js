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
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import {
  BookmarkAltIcon,
  CalendarIcon,
  ChartBarIcon,
  CheckIcon as CheckIconOutline,
  CursorClickIcon,
  MenuIcon,
  PhoneIcon,
  PlayIcon,
  RefreshIcon,
  ShieldCheckIcon,
  SupportIcon,
  ViewGridIcon,
  XIcon,
} from "@heroicons/react/outline";
import {
  CheckIcon as CheckIconSolid,
  ChevronDownIcon,
} from "@heroicons/react/solid";
import classNames from "classnames";
import Link from "next/link";

export default function Example({ name }) {
  const benefits = [
    {
      title: "Build Social Proof",
      details: `Gain credibility and trust by sharing full-feature articles about you or your client. Utilize those outlet logos on your website and create an "As Featured In" section on your landing page.`,
      iconUrl: "/BuildSocialProof.svg",
    },
    {
      title: "Improve SEO",
      details: `Join the leading SEO agencies that use ${name} for their clients overall SEO health. Use some of our many filters, such as Do-Follow and Domain Authority, to find backlinks from websites that meet your marketing needs.`,
      iconUrl: "/ImproveSEO.svg",
    },
    {
      title: "Generate Traffic",
      details: `${name}'s media placements increase overall brand exposure and drive organic traffic to your website and/or social media account.`,
      iconUrl: "/GenerateTraffic.svg",
    },
    {
      title: "Establish Thought Leadership",
      details: `Getting published can position you as a thought leader in your industry, demonstrating your knowledge and expertise and helping to establish your brand as a go-to source for information.`,
      iconUrl: "/EstablishThoughtLeadership.svg",
    },
    {
      title: "Attract Talent and Investments",
      details: `Getting published in top-tier publications can attract more talented employees and investment opportunities, boosting your company's growth potential.`,
      iconUrl: "/AttractTalentAndInvestments.svg",
    },
    {
      title: "Differentiate from Competitors",
      details: `Getting featured in top-tier publications helps establish your company as a thought leader in your industry, differentiating you from competitors and building a strong, reputable brand.`,
      iconUrl: "/DifferentiateFromCompetitors.svg",
    },
  ];

  return (
    <div className="bg-[#F0F4FF]">
      {/* Pricing with four tiers and toggle */}
      <div className="">
        <div className="py-32">
          <div className="sm:flex sm:flex-col sm:align-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p class="lg:text-center font-extrabold text-transparent text-base bg-clip-text bg-gradient-to-r from-[#352BFD] to-[#E581BF] mb-[16px]">
              The Benefits
            </p>
            <h2 className="text-4xl lg:text-5xl text-gray-900 tracking-tight capitalize lg:text-center">
              How Does Press Help Me?
            </h2>
            {/* <p className="max-w-4xl mx-auto mt-5 text-xl text-gray-500 sm:text-center">
              Getting press is a great way for you to promote yourself or your
              business.
            </p> */}
          </div>
          <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3 max-w-7xl mx-auto xl:grid-cols-3 pb-12 px-5">
            {benefits.map((benefit, index) => (
              <div key={index} className={classNames("benefit-card")}>
                <div className="flex gap-2 items-center">
                  <img src={benefit.iconUrl} className="h-8 w-8" />
                  <p className="text-xl font-bold text-gray-800">
                    {benefit.title}
                  </p>
                </div>
                <p className="text-base text-gray-700">{benefit.details}</p>
              </div>
            ))}
          </div>
          <div className="flex sm:justify-start lg:justify-center px-5">
            <Link href="/publications">
              <a className="button-secondary !py-4 !px-6 h-[56px]">
                <span>View Outlets</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5 ml-2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              </a>
            </Link>
          </div>
        </div>

        {/* Feature list */}
      </div>
    </div>
  );
}
