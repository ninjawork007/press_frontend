import Navbar from "@/components/navbar";
import { getSession, useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import API from "@/lib/api";
import { useState, useEffect } from "react";
import { MoonLoader } from "react-spinners";
import FileUploadInput from "@/components/fileUploadInput";
import AlertMessage from "@/components/alertMessage";
import SettingsWrapper from "../../../components/settingsWrapper";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/outline";

function Example({ site }) {
  const { data: session } = useSession();
  const profile = session?.profile;
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState();
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({});
  const [didSave, setDidSave] = useState(false);

  const [logo, setLogo] = useState();

  const handleChange = (e) => {
    e.preventDefault();
    let newValue = e.target.value;
    let value = newValue.replace(/\s/g, "");

    setForm({
      ...form,
      [e.target.name]: value,
    });
  };

  const handleLogoChange = (files) => {
    if (files.length > 0) {
      setLogo(files[0]);
    } else {
      setLogo();
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const result = await API.sites
      .update({
        session,
        data: {
          email: form.email,
          email_password: form.email_password,
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

      <SettingsWrapper activeTab={2}>
        {didSave && (
          <AlertMessage
            status="default"
            title="Email updated successfully"
          ></AlertMessage>
        )}

        <div>
          <h2 className="mt-6 text-4xl text-gray-900">Email</h2>
        </div>

        {site?.attributes?.is_sendgrid_connected ? (
          <div className="mt-6">
            <div className="flex items-center">
              {site?.attributes?.email} is connected{" "}
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <p className="text-sm mt-2 italic">
              Please create an email account for us to send automated email
              messages for the platform through. We recommend something like
              `hello@youremail.com`. Once we have logged into your email
              account, we will delete your password from our servers to keep
              your account secure.
            </p>
            {site?.attributes?.email && site?.attributes?.email_password && (
              <div className="mt-6">
                <div className="flex items-center text-amber-600 font-bold gap-2">
                  <ClockIcon className="h-5 w-5" />
                  We are working on connecting to your email account{" "}
                </div>
              </div>
            )}
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={site?.attributes?.email}
                onChange={handleChange}
                autoComplete="email"
                required
                className="input"
                placeholder="Enter your email address"
              />
            </div>
            <div>
              <label htmlFor="email_password" className="label">
                Password
              </label>
              <input
                id="email_password"
                name="email_password"
                type="text"
                defaultValue={site?.attributes?.email_password}
                onChange={handleChange}
                autoComplete="email_password"
                required
                className="input"
                placeholder="Enter your email password"
              />
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
        )}
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
