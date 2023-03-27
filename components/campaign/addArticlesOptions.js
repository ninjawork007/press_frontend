import DateHandler from "@/lib/date-handler";
import Link from "next/link";

import { ArrowRightIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

export default function Example({ campaign }) {
  const router = useRouter();
  const campaignId = router.query.id;

  return (
    <div className="space-y-2">
      <Link href={`/campaigns/${campaignId}/upload-articles`}>
        <div className="border p-6 bg-white rounded-xl space-y-2 cursor-pointer">
          <div className="flex items-center gap-4">
            <img src="/upload-articles.svg" className="w-10" />
            <h3 className="text-xl">Upload My Own Articles</h3>
          </div>

          <p className="pt-4 py-6">
            If you have already written your own articles, you can upload them
            for our team to approve.
          </p>
          <div className="button large w-full gap-2">
            <p>Continue</p>
            <ArrowRightIcon className="h-4 w-4" />
          </div>
        </div>
      </Link>
      <Link href={`/campaigns/${campaignId}/questionnaire`}>
        <div className="border p-6 bg-white rounded-xl space-y-2 cursor-pointer">
          <div className="flex items-center gap-4">
            <img src="/write-articles.svg" className="w-10" />
            <h3 className="text-xl">Write Articles For Me</h3>
          </div>
          <p className="pt-4 py-6">
            Answer our questionnaire and our talented team of writers will craft
            a story unique to you.
          </p>
          <div className="button large gap-2 w-full">
            <p>Continue to questionnaire</p>
            <ArrowRightIcon className="h-4 w-4" />
          </div>
        </div>
      </Link>
    </div>
  );
}
