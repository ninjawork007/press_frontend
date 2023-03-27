/* This example requires Tailwind CSS v2.0+ */
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example({ name }) {
  const faqs = [
    {
      question: "Choose Your Publications",
      answer: (
        <p>
          Our press list contains the most up to date {name} ‘pay-to-play’ press
          outlets. Writing costs and up to TWO (2) free revisions are INCLUDED.
          Simply choose the articles you want, add them to cart, and checkout.
        </p>
      ),
      imageUrl: "/ChooseYourPublications.png",
    },
    {
      question: "Build Your Story",
      answer:
        "Provide us information about your brand through our user-friendly questionnaire that makes it easy for you to share your brand's story, goals, and key messaging points. Our AI-powered writing service will then craft a compelling story to increase your chances of getting published.",
      imageUrl: "/BuildYourStory.png",
    },
    {
      question: "Review and Approve",
      answer:
        "Before we send out your pitch, you have the opportunity to review and approve it. This gives you full control over the message that gets shared with the publication.",
      imageUrl: "/ReviewAndApprove.png",
    },
    {
      question: "Get Featured",
      answer:
        "Once you've approved the pitch, our team of experienced PR professionals will send it out to your target publications. If we don't secure a placement for you, you'll receive your money back - we're that confident in our service.",
      imageUrl: "/GetFeatured.png",
    },
  ];

  return (
    <div className="" id="howItWorks">
      <div className="max-w-7xl mx-auto py-16 lg:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto ">
          <p class="lg:text-center font-extrabold text-transparent text-base bg-clip-text bg-gradient-to-r from-[#352BFD] to-[#E581BF] mb-[16px]">
            How it works
          </p>
          <h2 className="text-4xl lg:text-5xl text-gray-900 tracking-tight capitalize lg:text-center">
            Our Simple 4 Step Process
          </h2>
          <p className="text-left sm:text-center max-w-xl mx-auto mt-4 text-gray-700">
            We’ve simplified the previously tedious PR process to just a few
            simple steps so that you can get amazing press easier and faster
            than ever.
          </p>

          <dl className="mt-16 space-y-6 hidden sm:block">
            {faqs.map((faq, index) => (
              <div
                key={faq.question}
                className="bg-white rounded-xl flex items-center"
              >
                <dt className="text-lg">
                  <div className="text-left w-full flex flex-col sm:grid grid-cols-3 justify-between items-center text-gray-400">
                    <div className="col-span-2 pt-6 p-9  ">
                      <div className=" flex items-center justify-left gap-4">
                        <div className="rounded-full bg-[#E6ECFF] flex-none w-11 h-11 flex items-center justify-center text-black font-medium text-2xl">
                          {" "}
                          <span>{index + 1}</span>
                        </div>
                        <h1 className="font-medium text-gray-900 text-3xl">
                          {faq.question}
                        </h1>
                      </div>
                      <span className="mt-9 text-base text-gray-700">
                        {faq.answer}
                      </span>
                    </div>

                    <div className="col-span-1">
                      <img
                        src={faq.imageUrl}
                        className="h-full w-full flex-none"
                      />
                    </div>
                  </div>
                </dt>
              </div>
            ))}
          </dl>

          <dl className="mt-16 space-y-6 block sm:hidden">
            {faqs.map((faq, index) => (
              <Disclosure
                as="div"
                key={faq.question}
                className="pt-6 bg-white rounded-xl p-6"
              >
                {({ open }) => (
                  <>
                    <dt className="text-lg">
                      <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400">
                        <div className="flex items-center justify-center gap-4">
                          <div className="rounded-full bg-[#E9E8FF] flex-none w-11 h-11 flex items-center justify-center text-black font-medium text-2xl">
                            <h1></h1>
                            {index + 1}
                          </div>
                          <h1 className="font-medium text-gray-900 text-2xl">
                            {faq.question}
                          </h1>
                        </div>
                        <span className="ml-6 h-7 flex items-center">
                          <ChevronDownIcon
                            className={classNames(
                              open ? "-rotate-180" : "rotate-0",
                              "h-6 w-6 transform"
                            )}
                            aria-hidden="true"
                          />
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12 sm:flex">
                      <span className="text-base text-gray-500">
                        {faq.answer}
                      </span>
                      <img src={faq.imageUrl} className="max-h-[208px]" />
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
