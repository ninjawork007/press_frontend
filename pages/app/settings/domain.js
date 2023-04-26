import Navbar from "@/components/navbar";
import { getSession, useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import API from "@/lib/api";
import { useState, useEffect } from "react";
import { MoonLoader } from "react-spinners";
import FileUploadInput from "@/components/fileUploadInput";
import AlertMessage from "@/components/alertMessage";
import SettingsWrapper from "../../../components/settingsWrapper";
import { Switch } from "@headlessui/react";
import classNames from "classnames";
function Example({ site }) {
  const { data: session } = useSession();
  const profile = session?.profile;
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState();
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    subdomain: site?.attributes?.subdomain,
    domain: site?.attributes?.domain,
  });
  const [didSave, setDidSave] = useState(false);

  const [logo, setLogo] = useState();

  const handleChange = (e) => {
    e.preventDefault();
    let newValue = e.target.value;
    let value;
    if (e.target.name === "domain") {
      value = newValue.replace(/[^a-z0-9-.]/gi, "");
    } else {
      value = newValue.replace(/[^a-z0-9-]/gi, "");
    }

    setForm({
      ...form,
      [e.target.name]: value.toLowerCase(),
    });
  };

  const handleLogoChange = (files) => {
    if (files.length > 0) {
      setLogo(files[0]);
    } else {
      setLogo();
    }
  };

  const handlePublishSite = async () => {
    //TODO: check if site can be published
    setIsSaving(true);

    const result = await API.sites
      .update({
        session,
        data: {
          is_live: !site?.attributes?.is_live,
        },
        id: site.id,
      })
      .then(function (result) {
        setIsSaving(false);
        setDidSave(true);
        setTimeout(() => {
          setDidSave(false);
        }, 5000);

        return;
      })
      .catch((err) => {
        setErrorMessage("There was an error saving your changes");
        console.log(err.message);
        setIsSaving(false);

        return null;
        // alert(err.message)
      });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const result = await API.sites
      .update({
        session,
        data: {
          subdomain: form.subdomain,
          customDomain: form.domain,
        },
        id: site.id,
      })
      .then(function (profileRes) {
        return profileRes;
      })
      .then(function (result) {
        setIsSaving(false);
        setDidSave(true);
        setTimeout(() => {
          setDidSave(false);
        }, 5000);

        return;
      })
      .catch((err) => {
        setErrorMessage("There was an error saving your changes");
        console.log(err.message);
        setIsSaving(false);

        return null;
        // alert(err.message)
      });
  };

  return (
    <>
      <Navbar name="Press Backend" isManager={true} />

      <SettingsWrapper activeTab={5}>
        {didSave && (
          <AlertMessage
            status="default"
            title="Domain updated successfully"
          ></AlertMessage>
        )}

        <div>
          <h2 className="mt-6 text-4xl text-gray-900">Domain</h2>
        </div>
        <div className="flex gap-2 items-center mt-8 ">
          <p className="font-bold">Site Live</p>
          <Switch
            checked={site?.attributes?.is_live}
            onChange={() => handlePublishSite()}
            className={classNames(
              site?.attributes?.is_live ? "bg-indigo-600" : "bg-gray-200",
              "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            )}
          >
            <span className="sr-only">Use setting</span>
            <span
              aria-hidden="true"
              className={classNames(
                site?.attributes?.is_live ? "translate-x-5" : "translate-x-0",
                "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
              )}
            ></span>
          </Switch>
        </div>
        <form className="space-y-4 mt-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="subdomain" className="label">
              Project Name
            </label>
            <input
              id="subdomain"
              name="subdomain"
              type="text"
              defaultValue={site?.attributes?.subdomain}
              value={form.subdomain}
              onChange={handleChange}
              autoComplete="subdomain"
              className="input"
              placeholder="Enter project name"
            />
            <p className="text-sm my-2">
              {form.subdomain || "project-name"}.pressbackend.com
            </p>
            <p className="text-sm mt-2 italic">
              This will be the name for your project on our domain so that you
              can preview your site before you connect it to your domain
            </p>
          </div>

          <div>
            <label htmlFor="domain" className="label">
              Domain
            </label>
            <div className="mt-1 flex rounded-md shadow-sm relative">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                https://
              </span>
              <input
                id="domain"
                name="domain"
                type="text"
                defaultValue={site?.attributes?.customDomain}
                value={form.domain}
                onChange={handleChange}
                autoComplete="domain"
                className="input !rounded-l-none"
                placeholder="Enter your domain"
              />
            </div>
            <p className="text-sm mt-2 italic">
              This will be the custom domain that you own that you want the
              whitelabel site to be connected to
            </p>
            <br />
            {/* {form.domain && ( */}
            <div className="p-5 bg-white rounded-3xl">
              <p>
                Once you enter your custom domain and click save. Go to the
                service where you bought the domain to enter either an A Record
                (if you are using a root domain) or a CNAME Record (if you are
                using a subdomain)
              </p>
              <br />
              <p>
                <span className="font-bold">Root Domain</span> (ex: joseph.com)
              </p>
              <ol className="list-decimal ml-4">
                <li>
                  Create (or update) an <span className="text-red-500">A</span>{" "}
                  Record
                </li>
                <li>
                  Set the Host to <span className="text-red-500">@</span> and
                  the value to <span className="text-red-500">76.76.21.21</span>
                </li>
                <li>
                  Create (or update) an{" "}
                  <span className="text-red-500">CNAME</span> Record
                </li>
                <li>
                  Set the Host to whatever you want to name your subdomain and
                  the value to{" "}
                  <span className="text-red-500">cname.vercel-dns.com.</span>
                </li>
              </ol>
              <br />
              <p>
                <span className="font-bold">Subdomain</span> (ex:
                press.joseph.com)
              </p>
              <ol className="list-decimal ml-4">
                <li>
                  Create (or update) an{" "}
                  <span className="text-red-500">CNAME</span> Record
                </li>
                <li>
                  Set the Host to whatever you want to name your subdomain and
                  the value to{" "}
                  <span className="text-red-500">cname.vercel-dns.com.</span>
                </li>
              </ol>
            </div>
            {/* )} */}
          </div>

          <p className="text-red-500">{errorMessage}</p>

          <button
            className="w-full button large"
            type="submit"
            disabled={isSaving}
          >
            <span className="flex items-center justify-center gap-2">
              {isSaving ? (
                <MoonLoader size={20} color={"#fff"} loading={true} />
              ) : (
                <>
                  <span className="">Save Changes</span>
                </>
              )}
            </span>
          </button>
        </form>
      </SettingsWrapper>
    </>
  );
}

export const getServerSideProps = async ({ req, resolvedUrl }) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: `/login?return_url=${resolvedUrl}`,
      },
    };
  }

  let site = await API.sites.get({ profile_id: session.profile.id });

  return {
    props: {
      site,
      session,
    },
  };
};

export default Example;
