/* This example requires Tailwind CSS v2.0+ */

export default function OurGuarantee({ name, isInternal }) {
  return (
    <div className="pb-24 lg:py-12 overflow-hidden">
      <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
        <div className="relative flex flex-col-reverse sm:flex lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div className="relative mt-10 lg:mt-0 space-y-4">
            <h2 className="text-4xl text-gray-900 tracking-tight sm:text-5xl capitalize text-left">
              The <span className="capitalize">{name}</span> Promise
            </h2>
            <hr className="my-4" />
            <div>
              <p className="font-bold text-3xl text-gray-600 tracking-tight sm:text-xl">
                How We Get You Publicity
              </p>
              <p className="mt-1 text-lg text-gray-600">
                <span className="capitalize">{name}</span> gets you publicity
                through ironclad relationships with Fortune 500 publishing
                partners and an AI-powered writing service that crafts the most
                compelling pitch to get you published
              </p>
            </div>
            <div>
              <p className="font-bold text-3xl text-gray-600 tracking-tight sm:text-xl">
                {isInternal ? "Best Price Promise" : "Exclusive rates"}
              </p>
              <p className="mt-1 text-lg text-gray-600">
                {isInternal ? (
                  <span>
                    <span className="capitalize">{name}</span> ensures you
                    receive the best rates available by passing along our
                    exclusive rates and cutting out the middle man. {"We're"} so
                    confident, if you find a lower price elsewhere, let us know
                    and we will beat it!
                  </span>
                ) : (
                  <span>
                    We provide exclusive rates by cutting out the middleman,
                    ensuring that you receive the best rates available. If you
                    have any questions about our rates or want to learn more
                    about how we can help you save money, please {"don't"}{" "}
                    hesitate to reach out to our team.
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="relative" aria-hidden="true">
            <img className="relative mx-auto" src="/Shield.png" alt="" />
          </div>
        </div>
        {/* <div className="relative mt-12 lg:mt-24 flex flex-col-reverse lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center justify-between">
          <div className="relative mt-10 lg:mt-0 "></div>

          <div className="-mx-4 relative w-60 sm:w-[490px]" aria-hidden="true">
            <img
              className="relative mx-0 sm:mx-auto"
              src="/guarantee.png"
              alt=""
            />
          </div>
        </div> */}
      </div>
    </div>
  );
}
