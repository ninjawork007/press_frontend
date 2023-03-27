import AccountNav from "@/components/navigation/accountNav";

export default function SettingsWrapper({ activeTab, children }) {
  return (
    <div className=" py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto  max-h-screen">
      <div className="grid grid-cols-3 gap-6">
        <div className="max-w-[320px] relative">
          <div className="sticky w-full top-20 pt-10">
            <AccountNav activeTab={activeTab} />
          </div>
        </div>
        <div className="col-span-2">{children}</div>
      </div>
    </div>
  );
}
