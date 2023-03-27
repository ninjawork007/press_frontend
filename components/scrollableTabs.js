import classNames from "classnames";
import { ArrowRightIcon } from "@heroicons/react/solid";
export default function Example({ tabs, handleTabClick, selectedTab }) {
  return (
    <div className="relative">
      <div className="overflow-x-scroll bg-white/50 rounded-full p-2">
        <nav className="flex space-x-4 items-center" aria-label="Tabs">
          {tabs.map((tab) => (
            <a
              key={tab?.name}
              onClick={() => handleTabClick(tab)}
              className={classNames(
                "capitalize",
                tab?.name == selectedTab.name
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-500 hover:text-gray-700",
                "px-3 py-2 font-bold text-sm rounded-full flex-none cursor-pointer"
              )}
              aria-current={tab?.name == selectedTab.name ? "page" : undefined}
            >
              {tab?.name}
            </a>
          ))}
        </nav>
      </div>
      {/* <div className="absolute right-0 top-0 w-[200px] h-[52px] flex items-center justify-end bg-gradient-to-r from-[transparent] to-[#F8F7FC]">
        <ArrowRightIcon className="h-4 w-4" />
      </div> */}
    </div>
  );
}
