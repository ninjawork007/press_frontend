import { getSession, signIn, signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import SiteWrapper from "@/components/siteWrapper";
import API from "@/lib/api";

const TermsPage = ({ siteData }) => {
  const domain =
    siteData.attributes.customDomain ||
    `${siteData.attributes.subdomain}.pressbackend.com`;
  const websiteUrl = `https://${domain}`;
  const name = siteData.attributes.name;

  return (
    <SiteWrapper siteData={siteData}>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          <div className="container mx-auto flex-col px-6 max-w-7xl">
            <h1 className="text-left text-5xl">Terms of Service</h1>
            <br />
            <p>
              These Terms of Service govern your use of the website located at{" "}
              <a href={websiteUrl}>{websiteUrl}</a> and any related services
              provided by <span className="capitalize">{name}</span>.{" "}
            </p>
            <p className="mt-2">
              By accessing <a href={websiteUrl}>{websiteUrl}</a>, you agree to
              abide by these Terms of Service and to comply with all applicable
              laws and regulations. If you do not agree with these Terms of
              Service, you are prohibited from using or accessing this website
              or using any other services provided by{" "}
              <span className="capitalize">{name}</span>.{" "}
            </p>
            <p className="mt-2">
              We, <span className="capitalize">{name}</span>, reserve the right
              to review and amend any of these Terms of Service at our sole
              discretion. Upon doing so, we will update this page. Any changes
              to these Terms of Service will take effect immediately from the
              date of publication.{" "}
            </p>
            <p className="mt-2">
              These Terms of Service were last updated on 12 October 2022.{" "}
            </p>
            <br />
            <h3 className="text-xl">Limitations of Use</h3>
            <p>
              By using this website, you warrant on behalf of yourself, your
              users, and other parties you represent that you will not:{" "}
            </p>
            <ol className="list-decimal ml-4 mt-2">
              <li>
                modify, copy, prepare derivative works of, decompile, or reverse
                engineer any materials and software contained on this website;
              </li>
              <li>
                remove any copyright or other proprietary notations from any
                materials and software on this website;
              </li>
              <li>
                transfer the materials to another person or “mirror” the
                materials on any other server;
              </li>
              <li>
                knowingly or negligently use this website or any of its
                associated services in a way that abuses or disrupts our
                networks or any other service{" "}
                <span className="capitalize">{name}</span> provides;
              </li>
              <li>
                use this website or its associated services to transmit or
                publish any harassing, indecent, obscene, fraudulent, or
                unlawful material;
              </li>
              <li>
                use this website or its associated services in violation of any
                applicable laws or regulations;
              </li>
              <li>
                use this website in conjunction with sending unauthorized
                advertising or spam;
              </li>
              <li>
                harvest, collect, or gather user data without the user’s
                consent; or
              </li>
              <li>
                use this website or its associated services in such a way that
                may infringe the privacy, intellectual property rights, or other
                rights of third parties.
              </li>
            </ol>
            <br />

            <h3 className="text-xl">Intellectual Property</h3>
            <p className="mt-2">
              The intellectual property in the materials contained in this
              website are owned by or licensed to{" "}
              <span className="capitalize">{name}</span> and are protected by
              applicable copyright and trademark law. We grant our users
              permission to download one copy of the materials for personal,
              non-commercial transitory use.{" "}
            </p>
            <p className="mt-2">
              This constitutes the grant of a license, not a transfer of title.
              This license shall automatically terminate if you violate any of
              these restrictions or the Terms of Service, and may be terminated
              by <span className="capitalize">{name}</span> at any time.{" "}
            </p>
            <br />
            <h3 className="text-xl">User-Generated Content</h3>
            <p className="mt-2">
              You retain your intellectual property ownership rights over
              content you submit to us for publication on our website. We will
              never claim ownership of your content, but we do require a license
              from you in order to use it.{" "}
            </p>
            <p className="mt-2">
              When you use our website or its associated services to post,
              upload, share, or otherwise transmit content covered by
              intellectual property rights, you grant to us a non-exclusive,
              royalty-free, transferable, sub-licensable, worldwide license to
              use, distribute, modify, run, copy, publicly display, translate,
              or otherwise create derivative works of your content in a manner
              that is consistent with your privacy preferences and our Privacy
              Policy.{" "}
            </p>
            <p className="mt-2">
              The license you grant us can be terminated at any time by deleting
              your content or account. However, to the extent that we (or our
              partners) have used your content in connection with commercial or
              sponsored content, the license will continue until the relevant
              commercial or post has been discontinued by us.{" "}
            </p>
            <p className="mt-2">
              You give us permission to use your username and other identifying
              information associated with your account in a manner that is
              consistent with your privacy preferences, and our Privacy Policy.{" "}
            </p>
            <br />
            <h3 className="text-xl">Liability</h3>

            <p>
              Although our clients have had great success with Google ranking
              and social media verification, we are unable to guarantee either
              of these because they are both outside of our control. Therefore,
              we cannot guarantee that you will be verified on social media or
              that your website or articles will rank first in Google for any
              search phrase, including your name, brand name, or any other term.
            </p>
            <p className="mt-2">
              The quantity of traffic you receive from our articles will vary,
              and we {"can't"} promise you leads or purchases.
            </p>
            <p className="mt-2">
              Older articles will sometimes be removed from news websites to
              keep them current. This normally takes them three to twenty four
              months.
            </p>
            <p className="mt-2">
              This website is not affiliated with any of the news organizations
              listed on our website, including FOX, CBS, NBC, USA Today, Market
              Watch, Digital Journal, Benzinga, Google, or others.
            </p>
            <p className="mt-2">
              The article you approve (or submit to us) will be published by our
              team on the publication you choose.
              <br />
              If an article {"can't"} be published, you can choose to get a
              refund in credits, rewrite it yourself, or, if your order included
              our writing service, ask our experts to rewrite it for you.
              <br />
              There is no way for us to edit an article once it has been
              published. Any errors in the publications caused by us, the
              individual news sites, our publication partners, or our clients
              are not our responsibility. We disclaim all liability for any harm
              the publications may inflict.
            </p>

            <p className="mt-2">
              Our website and the materials on our website are provided on an
              {"'as is'"} basis. To the extent permitted by law,{" "}
              <span className="capitalize">{name}</span>
              makes no warranties, expressed or implied, and hereby disclaims
              and negates all other warranties including, without limitation,
              implied warranties or conditions of merchantability, fitness for a
              particular purpose, or non-infringement of intellectual property,
              or other violation of rights.{" "}
            </p>
            <p className="mt-2">
              In no event shall <span className="capitalize">{name}</span> or
              its suppliers be liable for any consequential loss suffered or
              incurred by you or any third party arising from the use or
              inability to use this website or the materials on this website,
              even if <span className="capitalize">{name}</span> or an
              authorized representative has been notified, orally or in writing,
              of the possibility of such damage.{" "}
            </p>
            <p className="mt-2">
              In the context of this agreement, &ldquo;consequential loss&rdquo;
              includes any consequential loss, indirect loss, real or
              anticipated loss of profit, loss of benefit, loss of revenue, loss
              of business, loss of goodwill, loss of opportunity, loss of
              savings, loss of reputation, loss of use and/or loss or corruption
              of data, whether under statute, contract, equity, tort (including
              negligence), indemnity, or otherwise.{" "}
            </p>
            <p className="mt-2">
              Because some jurisdictions do not allow limitations on implied
              warranties, or limitations of liability for consequential or
              incidental damages, these limitations may not apply to you.{" "}
            </p>
            <br />
            <h3 className="text-xl">Accuracy of Materials</h3>
            <p>
              The materials appearing on our website are not comprehensive and
              are for general information purposes only.{" "}
              <span className="capitalize">{name}</span> does not warrant or
              make any representations concerning the accuracy, likely results,
              or reliability of the use of the materials on this website, or
              otherwise relating to such materials or on any resources linked to
              this website.{" "}
            </p>
            <br />
            <h3 className="text-xl">Links</h3>
            <p>
              <span className="capitalize">{name}</span> has not reviewed all of
              the sites linked to its website and is not responsible for the
              contents of any such linked site. The inclusion of any link does
              not imply endorsement, approval, or control by{" "}
              <span className="capitalize">{name}</span> of the site. Use of any
              such linked site is at your own risk and we strongly advise you
              make your own investigations with respect to the suitability of
              those sites.{" "}
            </p>
            <br />
            <h3 className="text-xl">Right to Terminate</h3>
            <p>
              We may suspend or terminate your right to use our website and
              terminate these Terms of Service immediately upon written notice
              to you for any breach of these Terms of Service.{" "}
            </p>
            <br />
            <h3 className="text-xl">Severance</h3>
            <p>
              Any term of these Terms of Service which is wholly or partially
              void or unenforceable is severed to the extent that it is void or
              unenforceable. The validity of the remainder of these Terms of
              Service is not affected.{" "}
            </p>
            <br />
            <h3 className="text-xl">Governing Law</h3>
            <p>
              These Terms of Service are governed by and construed in accordance
              with the laws of California. You irrevocably submit to the
              exclusive jurisdiction of the courts in that State or location.{" "}
            </p>
          </div>
        </div>
      </div>
    </SiteWrapper>
  );
};

export const getServerSideProps = async (context) => {
  const { params, req } = context;

  const session = await getSession({ req });
  const { site } = params;
  // console.log("site params", site)
  let siteData;
  if (site.includes(".")) {
    siteData = await API.sites.get({ customDomain: site });
  } else {
    siteData = await API.sites.get({ subdomain: site });
  }

  return {
    props: {
      siteData: siteData,
    },
  };
};

export default TermsPage;
