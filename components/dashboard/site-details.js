import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/outline";
import { CheckCircleIcon } from "@heroicons/react/solid";
import SiteManager from "@/lib/site-manager";
import { useSession } from "next-auth/react";

export default function SiteDetails({ siteData }) {
  const { data: session } = useSession();
  const profile = session?.profile;

  return (
    <div className="bg-white p-8 rounded-xl">
      <h1 className="text-xl font-bold text-gray-800">Account Setup</h1>
      <div className="flex flex-col gap-6 justify-center py-4">
        <Link href="/settings">
          <div className="flex justify-between cursor-pointer">
            <a className="text-gray-700 font-bold">Setup your site</a>
            {SiteManager.isSiteDetailsComplete(siteData) ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            ) : (
              <ArrowRightIcon className="h-5 w-5 text-blue-500" />
            )}
          </div>
        </Link>
        <Link href="/settings/email">
          <div className="flex justify-between cursor-pointer">
            <a className="text-gray-700 font-bold">Connect an email</a>
            {SiteManager.isEmailConnected(siteData) ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            ) : (
              <ArrowRightIcon className="h-5 w-5 text-blue-500" />
            )}
          </div>
        </Link>
        <Link href="/settings/payout">
          <div className="flex justify-between cursor-pointer">
            <a className="text-gray-700 font-bold">Payout Info</a>
            {SiteManager.isPayoutInfoComplete(profile) ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            ) : (
              <ArrowRightIcon className="h-5 w-5 text-blue-500" />
            )}
          </div>
        </Link>
        <Link href="/publications">
          <div className="flex justify-between cursor-pointer">
            <a className="text-gray-700 font-bold">Manage publications</a>
            <ArrowRightIcon className="h-5 w-5 text-blue-500" />
          </div>
        </Link>

        <Link href="/settings/domain">
          <div className="flex justify-between cursor-pointer">
            <a className="text-gray-700 font-bold">Connect your domain</a>
            {SiteManager.isDomainConnected(siteData) ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            ) : (
              <ArrowRightIcon className="h-5 w-5 text-blue-500" />
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
