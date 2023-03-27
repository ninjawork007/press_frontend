export default function Example({ name }) {
  return (
    <div className="py-16 bg-[#F0F4FF] overflow-hidden lg:py-24">
      <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
        <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div className="mt-10 -mx-4 relative lg:mt-0" aria-hidden="true">
            <img
              className="relative mx-auto"
              width={490}
              src="/magic.png"
              alt=""
            />
          </div>
          <div className="relative">
            <h3 className="pt-5 text-4xl text-gray-900 tracking-tight sm:text-5xl capitalize">
              The <span className="capitalize">{name}</span> Guarantee
            </h3>
            <p className="mt-3 text-lg text-gray-500">
              We are committed to providing you the best service possible. We
              are so confident that we have the best prices available, that if
              you find a cheaper rate, we will beat it! Of course, if for any
              reason, we are unable to publish your article, you will receive
              your money back, no questions asked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
