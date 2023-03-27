import BulletPoint from "../bullet-point.js";

export default function AgencyComparison({ name, isInternal }) {
  return (
    <div className="">
      {/* Pricing with four tiers and toggle */}
      <div className="">
        <div className="max-w-7xl mx-auto py-16 lg:py-32 px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center">
            <p class="lg:text-center font-extrabold text-transparent text-base bg-clip-text bg-gradient-to-r from-[#352BFD] to-[#E581BF] mb-[16px]">
              Why {"We're"} Different
            </p>
            <h2 className="text-4xl lg:text-5xl text-gray-900 tracking-tight capitalize lg:text-center">
              Traditional PR vs <span className="capitalize">{name}</span>
            </h2>
            <p className="max-w-4xl mx-auto mt-5 text-xl text-gray-500 sm:text-center">
              Streamline your press coverage and get featured in top-tier
              publications without the high fees and lack of control. Choose{" "}
              {name} for a better, more efficient PR solution.
            </p>
          </div>
          <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-2">
            <div className="rounded-3xl divide-y divide-gray-200">
              <div className="py-6 sm:py-12 px-6 sm:px-14 bg-white/[.5] rounded-[32px] sm:rounded-[48px]">
                <h2 className="text-4xl font-medium text-gray-900">
                  Traditional
                </h2>
                <ul role="list" className="mt-6 space-y-4">
                  <BulletPoint
                    text="Expensive Monthly Retainers"
                    isPositive={false}
                  />
                  <BulletPoint
                    text="Exorbitant fees with little ROI"
                    isPositive={false}
                  />
                  <BulletPoint
                    text="No Control of Brand Messaging"
                    isPositive={false}
                  />

                  <BulletPoint
                    text="Painfully Slow Turnaround Times"
                    isPositive={false}
                  />
                </ul>
              </div>
            </div>

            <div className="rounded-3xl divide-y divide-gray-200">
              <div className="py-6 sm:py-12 px-6 sm:px-14 bg-white/[.75] rounded-[32px] sm:rounded-[48px] shadow-lg">
                <h2 className="text-4xl font-medium text-blue-800">
                  <span className="capitalize">{name}</span>
                </h2>
                <ul role="list" className="mt-6 space-y-4">
                  <BulletPoint
                    text="No Monthly Fees"
                    isPositive={true}
                    iconPath="/NoMonthlyFees.svg"
                  />
                  <BulletPoint
                    text={
                      isInternal
                        ? "Best Price Promise or We'll Beat It"
                        : "Affordable Pricing"
                    }
                    isPositive={true}
                    iconPath="/BestPrice.svg"
                  />
                  <BulletPoint
                    text="Full Control of Pitch and Who You Pitch"
                    isPositive={true}
                    iconPath="/FullControl.svg"
                  />

                  <BulletPoint
                    text="Lightning Fast Turnaround Times (as fast as 24 hours)"
                    isPositive={true}
                    iconPath="/Lightning.svg"
                  />
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Feature list */}
      </div>
    </div>
  );
}
