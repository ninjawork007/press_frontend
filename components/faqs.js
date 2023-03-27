import { Disclosure } from "@headlessui/react";
import {
  ChevronDownIcon,
  PlusCircleIcon,
  MinusCircleIcon,
} from "@heroicons/react/outline";
import WritingGuidelines from "./writing-guidelines";
import { useState } from "react";
import Link from "next/link";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
/* This example requires Tailwind CSS v2.0+ */

export default function FAQs({ email, siteName }) {
  const [openGuidelines, setOpenGuidelines] = useState(false);
  const [showMoreArticleFAQs, setShowMoreArticleFAQs] = useState(false);
  const [showMoreGeneralFAQs, setShowMoreGeneralFAQs] = useState(false);

  const faqs = [
    {
      question: "Why haven’t I heard about this method of press?",
      answer: `The only thing new about ${siteName} is our proprietary press platform. Our method, of providing high-quality press without the backandforth of traditional pr is of our own creation. ${siteName} has exclusivity agreements with Tribune Publishing, A360, Hearst Media, and more. For the past 6 years, these longstanding relationships have grown into ironclad partnerships. It is because of these partnerships, that we are able to create a reliable, and automated platform for press placements.`,
      category: "general",
    },
    {
      question: "How is this different than a press release?",
      answer: `Press releases are a companies mouthpiece to the public. They are best utlized when bringing attention toward large company updates. Press releases do not contribute to your overall SEO health. These releases make it highly apparent that a company has paid for this to be published and they’re generally not accepted as true press coverage. ${siteName} does not publish press releases; we only publish high-quality, organic and partnered articles. The articles our clients publish through ${siteName} are exactly the same as an organic article you would see in any major publication.`,
      category: "general",
    },
    {
      question: "Are there any requirements?",
      answer:
        "Some outlets have requirements, some do not. Upon adding a publication to your cart, please view any requirements outlined in red at that time. Only upload an article that meets the published requirements. Articles that do not meet these publishing requirements will be automatically rejected by the publisher.",
      category: "general",
    },
    {
      question: "How long does this process take?",
      answer: (
        <>
          <p>
            Turnaround times are accurate and displayed directly on our media
            list. Please view all turnaround times,{" "}
            <Link href="/publications">here</Link>.
          </p>
          <p>
            For those who have {siteName} write an article for them, your
            turanaround time will begin once you approve our final draft.
          </p>
        </>
      ),
      category: "general",
    },
    {
      question: "How does payment work?",
      answer: `The ${siteName} purchase experience is powered by Stripe. Simply add articles into your cart and checkout. We accept payment via card, bank account, Afterpay, Klarna, and Affirm.`,
      category: "general",
    },
    {
      question: "Can I promote affiliate products?",
      answer:
        "No, you can not promote affiliate links within any purchased article. ",
      category: "general",
    },
    {
      question: "Are there prohibited topics you can't publish?",
      answer: (
        <>
          <p>We can accept almost all niches except for: </p>
          <br />
          <ul>
            <li>
              <b>Gambling</b> - Topics regarding gambling of any variety.
            </li>
            <li>
              <b>Negative Press</b> - Topics regarding negative about a person,
              website, or company.
            </li>
            <li>
              <b>Firearms</b> - Topics regarding weapons or ammunition.
            </li>
            <li>
              <b>Medical Advice</b> - Topics regarding medical advice.
            </li>
          </ul>
          <br />

          <p>
            There are certain publications that have more strict requirements on
            what topics they can publish. Please feel free to check the outlets
            and reach out if you have any specific questions. Keep in mind, if
            we cannot publish an article for any reason, you will receive a full
            refund no questions asked!
          </p>
        </>
      ),
      category: "general",
    },
    {
      question: "Will the articles be published word for word?",
      answer:
        "Yes, unless marked otherwise. Our articles are published word-for-word as you approve.",
      category: "articles",
    },
    {
      question: "Can you write my articles?",
      answer: `Yes we can. ${siteName} is at it's core, a publishing company. With that being said, we do offer writing as a free service for our clients. We recommend this service for agencies who are looking for a high-output publishing partner. For individuals who would like to invest in standalone, quality writing we suggest uploading your own article. Our biggest advantage is being able to provide you with a platform for you to control your own narrative.`,
      category: "articles",
    },
    {
      question: "Can I write my own articles?",
      answer: (
        <>
          <p>
            We recommend you upload your own articles. However, our publishing
            team will need to review your piece prior to submitting it for
            publishing.
          </p>
        </>
      ),
      category: "articles",
    },
    {
      question: "Is it cheaper if I upload my own article?",
      answer:
        "It is not, as our writing division is a complimentary service provided by our team at no cost.",
      category: "articles",
    },
    {
      question: "Can I rewrite my article?    ",
      answer:
        "Our clients have the opportunity to give immediate feedback to our writers in real-time. Clients are given two free revisions. Once you approve an article for publishing, you will not be able to make changes as publishing team will have sent your approved piece to the outlet for immediate publishing.",
      category: "articles",
    },
    {
      question: "Can I promote my published article?",
      answer: "Yes of course! Share your articles in any capacity you wish.",
      category: "articles",
    },
    {
      question: "My article has been denied by the publisher, now what?",
      answer: (
        <>
          <p>There are two options: </p>
          <br />
          <ol>
            <li>
              You are given a full refund, processed via your financial
              institution in 5-10 business days.
            </li>
            <li>
              You can checkout an alternate publication of your choice that is
              the same price as your original selection. We will add credit to
              your account in the backend upon request so no payment is
              required.
            </li>
          </ol>
        </>
      ),
      category: "articles",
    },
    {
      question: "Will my article be archived by the publisher?",
      answer:
        "Each live permalink will remain on the publishers website, indefinitely.",
      category: "articles",
    },
    {
      question: "How many backlinks can I add to my article?",
      answer:
        "Yes, we recommend up to 5 backlinks. This is simply a suggestion, as more backlinks can be added if necessary.",
      category: "articles",
    },
    {
      question: "Do your articles include photos?",
      answer:
        "Yes, you must upload at least one quality, relevant, 16:9 aspect ratio image.",
      category: "articles",
    },
    {
      question: "Are your permalinks SEO-friendly?",
      answer:
        "Yes, our permalinks are properly structured to maximize each articles benefit to your overall SEO health.",
      category: "articles",
    },
    {
      question: "Do I have an Account Manager?",
      answer: `No, because ${siteName} is an automated publishing platform, there’s no need for a dedicated account manager. You can view, edit, and approve all of your articles directly from within the ${siteName} account dashboard.`,
      category: "general",
    },
    {
      question: "Can multiple outlets publish the same article?",
      answer: `No, due to laws against plagerism we do not allow a single article to be circulated among multiple outlets. In addition, this type of publishing will hurt the overall SEO health of your business or client.`,
      category: "articles",
    },
    {
      question: "Will you always have the same outlets available?",
      answer: `No, in an instance where a publisher or ${siteName} choose not to renew a publishing contract, the outlet will be immediately removed from our platform.`,
      category: "articles",
    },
    {
      question: "Will you add new outlets?",
      answer: `Yes, we update our platform once per month. Upon creating an account, you will receive an email notification as soon as we have added a particular months newest publications.`,
      category: "articles",
    },
    {
      question: "What topics do you publish?",
      answer: `News 
      Business
      Lifestyle 
      Technology
      Entertainment 
      Fashion
      Music 
      Cryptocurrency 
      Luxury
      Real Estate 
      Gaming `,
      category: "articles",
    },
    {
      question: "Will readers see if I paid to post my article? ",
      answer: `Simply filter our media list and add a checkmark for Non-Sponsored. Now you will only see publications that are non-sponsored. 
      If you remove this filter, you will see some publications marked at Sponsored. 
      In this case, users will see that you paid for your article. `,
      category: "articles",
    },
    {
      question: "What does “Exclusive” mean?",
      answer: `We are proud to have exclusivity agreements with three of the largest media companies anywhere in the world. This agreement authorizes ${siteName} as an exclusive 3rd party reseller, with the lowest prices possible.`,
      category: "articles",
    },
    {
      question: "What does “Google News” mean?",
      answer: `Your permalink will show in the Google News feed.`,
      category: "articles",
    },
    {
      question: "What does “Indexed” mean?",
      answer: `Your permalink will show on Google’s feed.`,
      category: "articles",
    },
    {
      question: "What does “Do Follow” mean?",
      answer: `The permalink will be indexed and ranked on Google.`,
      category: "articles",
    },
    {
      question: "What does “Inquire” mean?",
      answer: `If you would like to purchase an article with such option, please input the information asked when prompted on our platform. 
      A publication is set as an inquiry-first option if there are additional points you must review with a ${siteName} account manager. 
      Please email us about any interest at ${email}`,
      category: "articles",
    },
    {
      question: "How can I see pricing?",
      answer: (
        <>
          <p>
            You have instant access to pricing across all of our publications
            once you create an account <Link href="/register">here</Link>.
          </p>
        </>
      ),
      category: "articles",
    },
    {
      question: "How do I start publishing?",
      answer: (
        <>
          <p>Here are the next steps to begin publishing on our site. </p>
          <br />
          <ol>
            <li>
              Create an account, <Link href="/register">here</Link>.
            </li>
            <li>Choose your publications</li>
            <li>Add to cart</li>
            <li>Checkout</li>
          </ol>
          <br />

          <p>
            Once you checkout, {"you'll"} be prompted to submit a draft, or you
            can fill out the provided questionnaire and our writers will upload
            first drafts directly to your dashboard.
          </p>
        </>
      ),
      category: "articles",
    },
  ];

  const faqsToDisplay = ({ category, limit = null }) => {
    let faqsToDisplay = faqs.filter((faq) => faq.category === category);
    if (limit) {
      faqsToDisplay = faqsToDisplay.slice(0, limit);
    }
    return faqsToDisplay;
  };

  return (
    <div className="">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-24">
          <div>
            <h2 className="text-4xl lg:text-5xl text-gray-900 lg:tracking-tight capitalize text-left">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {"Can't"} find the answer {"you're"} looking for? Reach out to our{" "}
              <a
                href={`mailto:${email}`}
                className="font-bold text-gray-600 hover:text-indigo-500"
              >
                customer support team.
              </a>
            </p>
          </div>
          <div className="mt-12 lg:mt-0 lg:col-span-2">
            <dl className="space-y-4">
              <h3 className="text-4xl font-medium text-gray-900">General</h3>
              {faqsToDisplay({
                category: "general",
                limit: showMoreGeneralFAQs ? null : 3,
              }).map((faq, index) => (
                <Disclosure
                  as="div"
                  key={faq.question}
                  className="pt-6 bg-white rounded-xl p-6"
                >
                  {({ open }) => (
                    <>
                      <dt className="text-lg">
                        <Disclosure.Button className="text-left w-full flex justify-start items-start text-gray-400 gap-4">
                          <span className="ml-6 h-7 flex items-center">
                            {open ? (
                              <MinusCircleIcon
                                className={classNames(
                                  "h-6 w-6 transform text-blue-500"
                                )}
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusCircleIcon
                                className={classNames(
                                  "h-6 w-6 transform text-blue-500"
                                )}
                                aria-hidden="true"
                              />
                            )}
                          </span>
                          <div className="flex items-center justify-center gap-4">
                            <p className="text-gray-800 font-bold text-base">
                              {faq.question}
                            </p>
                          </div>
                        </Disclosure.Button>
                      </dt>
                      <Disclosure.Panel as="dd" className="mt-2 pl-16 flex">
                        <span className="text-base text-gray-700">
                          {faq.answer}
                        </span>
                        <img src={faq.imageUrl} className="max-h-[208px]" />
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
              <div className="mt-2">
                <a
                  onClick={() => setShowMoreGeneralFAQs(!showMoreGeneralFAQs)}
                  className="font-bold text-gray-500 cursor-pointer"
                >
                  {showMoreGeneralFAQs ? "Show less" : "Show more"}
                </a>
              </div>
              <h3 className="text-4xl font-medium text-gray-900 pt-4">
                Articles
              </h3>
              {faqsToDisplay({
                category: "articles",
                limit: showMoreArticleFAQs ? null : 3,
              }).map((faq, index) => (
                <Disclosure
                  as="div"
                  key={faq.question}
                  className="pt-6 bg-white rounded-xl p-6"
                >
                  {({ open }) => (
                    <>
                      <dt className="text-lg">
                        <Disclosure.Button className="text-left w-full flex justify-start items-start text-gray-400 gap-4">
                          <span className="ml-6 h-7 flex items-center">
                            {open ? (
                              <MinusCircleIcon
                                className={classNames(
                                  "h-6 w-6 transform text-blue-500"
                                )}
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusCircleIcon
                                className={classNames(
                                  "h-6 w-6 transform text-blue-500"
                                )}
                                aria-hidden="true"
                              />
                            )}
                          </span>
                          <div className="flex items-center justify-center gap-4">
                            <p className="text-gray-900 font-bold">
                              {faq.question}
                            </p>
                          </div>
                        </Disclosure.Button>
                      </dt>
                      <Disclosure.Panel as="dd" className="mt-2 pl-16 flex">
                        <span className="text-base text-gray-500">
                          {faq.answer}
                        </span>
                        <img src={faq.imageUrl} className="max-h-[208px]" />
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
              <div className="mt-2">
                <a
                  onClick={() => setShowMoreArticleFAQs(!showMoreArticleFAQs)}
                  className="font-bold text-gray-500 cursor-pointer"
                >
                  {showMoreArticleFAQs ? "Show less" : "Show more"}
                </a>
              </div>
            </dl>
            <WritingGuidelines
              open={openGuidelines}
              setOpen={setOpenGuidelines}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
