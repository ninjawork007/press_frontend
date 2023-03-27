import Link from "next/link";
/* This example requires Tailwind CSS v2.0+ */
const navigation = {
  solutions: [
    { name: "Marketing", href: "#" },
    { name: "Analytics", href: "#" },
    { name: "Commerce", href: "#" },
    { name: "Insights", href: "#" },
  ],
  support: [
    { name: "Pricing", href: "#" },
    { name: "Documentation", href: "#" },
    { name: "Guides", href: "#" },
    { name: "API Status", href: "#" },
  ],
  company: [{ name: "Publications", href: "/publications" }],
  legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ],
};

export default function Example({ logo, name }) {
  return (
    <footer className="" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="flex flex-col sm:grid sm:grid-cols-4 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/">
              <a className="text-primary">
                {logo?.data?.attributes?.url ? (
                  <img
                    className="block h-[55px] w-auto"
                    src={logo?.data?.attributes?.url}
                    alt="Workflow"
                  />
                ) : (
                  <h1 className="text-xl p-0 m-0">{name}</h1>
                )}
              </a>
            </Link>

            {/* <p className="text-gray-500 text-base">We make magic happen</p> */}
          </div>

          <div></div>
          <div>
            <h3 className="text-sm text-gray-600">Legal</h3>
            <ul role="list" className="mt-4 space-y-4">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-base font-bold text-gray-500 hover:text-gray-700"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 md:mt-0">
            <h3 className="text-sm text-gray-600">Sitemap</h3>
            <ul role="list" className="mt-4 space-y-4">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-base font-bold text-gray-500 hover:text-gray-700"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-end">
          <p className="text-base text-gray-600 xl:text-center">
            &copy; 2022 {name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
