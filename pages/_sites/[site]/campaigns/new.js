import { useState, useEffect } from "react";
import API from "@/lib/api";
import SiteWrapper from "@/components/siteWrapper";
import AlertMessage from "@/components/alertMessage";
import { ArrowNarrowLeftIcon } from "@heroicons/react/outline";

import Link from "next/link";

import { getSession, useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { MoonLoader } from "react-spinners";
import * as fbq from "@/lib/tracking/facebook-pixel";
import * as klaviyo from "@/lib/tracking/klaviyo";

function CreateCampaign({ siteData }) {
  const { data: session } = useSession();
  const router = useRouter();

  const [redirectedFromCheckout, setRedirectedFromCheckout] = useState(false);
  const [form, setForm] = useState({
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const redirect_status = router.query.redirect_status;
    const redirect_total = router.query.total;
    if (redirect_status === "succeeded") {
      if (siteData?.attributes?.facebook_pixel_id) {
        fbq.event("Purchase", { currency: "USD", value: redirect_total });
      }

      if (siteData?.attributes?.klaviyo_public_key) {
        klaviyo.trackPurchase({ total: redirect_total });
      }
      setRedirectedFromCheckout(true);
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.name.length == 0) {
      alert("No name");
      return;
    }

    setIsSubmitting(true);

    var profile = session?.profile;

    var campaignId;
    return API.campaigns
      .create(
        { data: { name: e.target.name.value, profile: profile.id } },
        session
      )
      .then(function (campaignResult) {
        campaignId = campaignResult.data?.data?.id;
        router.replace(`/campaigns/${campaignId}`);
      })
      .catch((err) => {
        console.log(err);
        setIsSubmitting(false);
        return null;
      });
  };

  // ARROW FUNCTIONS
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <SiteWrapper siteData={siteData}>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          <div className="">
            {redirectedFromCheckout ? (
              <AlertMessage
                status="default"
                title="Your purchase was successful!"
              ></AlertMessage>
            ) : (
              <Link href="/dashboard">
                <a className="flex items-center gap-2 text-gray-500">
                  <ArrowNarrowLeftIcon
                    className="block h-6 w-6"
                    aria-hidden="true"
                  />

                  <p className="font-bold">Go back to campaigns</p>
                </a>
              </Link>
            )}

            <h2 className="mt-6 text-4xl text-gray-900">
              Create Your Campaign
            </h2>
            <p className="mt-4">
              Your campaign name is just for your reference. It will not be used
              in any of your publications.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 bg-white rounded-3xl">
            <label htmlFor="about" className="label">
              Campaign name
            </label>
            <div className="mt-6">
              <input
                id="name"
                name="name"
                type="text"
                className="input"
                placeholder="Please write your answer here"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className=" py-3 mt-6">
              <button
                className="button large w-full"
                disabled={form.name.length <= 0 || isSubmitting}
              >
                {isSubmitting ? (
                  <MoonLoader size={20} color={"#fff"} />
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </SiteWrapper>
  );
}

export const getServerSideProps = async (context) => {
  const { params } = context;
  const { site } = params;

  let siteData;
  if (site.includes(".")) {
    siteData = await API.sites.get({ customDomain: site });
  } else {
    siteData = await API.sites.get({ subdomain: site });
  }
  return {
    props: {
      siteData,
    },
  };
};

export default CreateCampaign;
