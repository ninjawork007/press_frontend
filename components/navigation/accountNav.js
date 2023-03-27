/* This example requires Tailwind CSS v2.0+ */
import {
  MailIcon,
  GlobeAltIcon,
  LinkIcon,
  CurrencyDollarIcon,
  OfficeBuildingIcon,
  LockClosedIcon,
} from "@heroicons/react/outline";
import { useSession } from "next-auth/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example({ activeTab }) {
  const isItemCurrent = (index) => {
    return index + 1 == activeTab;
  };
  let navigation = [];

  const { data: session } = useSession();
  if (session?.profile?.is_whitelabel) {
    navigation = [
      {
        name: "Site Details",
        href: "/settings",
        icon: GlobeAltIcon,
      },
      {
        name: "Email",
        href: "/settings/email",
        icon: MailIcon,
      },
      {
        name: "Payout",
        href: "/settings/payout",
        icon: CurrencyDollarIcon,
      },
      {
        name: "Company",
        href: "/settings/company",
        icon: OfficeBuildingIcon,
      },
      { name: "Domain", href: "/settings/domain", icon: LinkIcon },
    ];
  } else if (session?.profile?.is_affiliate) {
    navigation = [
      {
        name: "Payout",
        href: "/settings/payout",
        icon: CurrencyDollarIcon,
      },
      {
        name: "Company",
        href: "/settings/company",
        icon: OfficeBuildingIcon,
      },
    ];
  }

  return (
    <nav className="space-y-1" aria-label="Sidebar">
      {navigation.map((item, index) => (
        <a
          key={item.name}
          href={item.href}
          className={classNames(
            isItemCurrent(index)
              ? "bg-gray-200 text-gray-900"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            "flex items-center px-3 py-2 text-sm font-medium rounded-md"
          )}
          aria-current={isItemCurrent(index) ? "page" : undefined}
        >
          <item.icon
            className={classNames(
              isItemCurrent(index) ? "text-gray-500" : "text-gray-400",
              "flex-shrink-0 -ml-1 mr-3 h-6 w-6"
            )}
            aria-hidden="true"
          />
          <span className="truncate">{item.name}</span>
        </a>
      ))}
    </nav>
  );
}
