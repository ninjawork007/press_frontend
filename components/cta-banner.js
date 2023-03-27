import Link from "next/link";
/* This example requires Tailwind CSS v2.0+ */
export default function CTA({ isInternalSite }) {
  return (
    <div className="mx-5">
      <div className="max-w-7xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8 primary-radial-gradient rounded-3xl relative">
        <div
          className="absolute inset-0 rounded-3xl z-0"
          style={{
            backgroundImage: `url("cta-background.png")`,
            backgroundSize: "cover",
          }}
        ></div>
        <div className="z-10 relative">
          <h2 className="text-4xl text-white tracking-tight sm:text-5xl capitalize text-center">
            Ready to Grow Your Brand?
          </h2>
          <p className="text-white text-base mt-4 max-w-lg mx-auto">
            Your brand deserves more recognition. Start getting real exposure
            for your brand and drive high-quality traffic to your page today!
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-2 justify-center">
            {/* <Link href="/publications">
<button
          type="button"
          className="inline-flex items-center px-8 py-5 border border-transparent text-sm font-bold rounded-full shadow-sm text-white bg-[#2302FD] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 justify-center"
        >
          VIEW OUTLETS
        </button>
</Link> */}

            <Link href={isInternalSite ? "/start" : "/publications"}>
              <a className="button !py-4 !px-6 h-[56px]">
                <span>Get Started</span>
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
      </div>
    </div>
  );
}
