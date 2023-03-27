import Navbar from "@/components/navbar";
import { getSession, useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import API from "@/lib/api";
import { useState, useEffect } from "react";
import { MoonLoader } from "react-spinners";
import FileUploadInput from "@/components/fileUploadInput";
import AlertMessage from "@/components/alertMessage";
import SettingsWrapper from "@/components/settingsWrapper";

function Example({ site }) {
  // console.log('Top Site: ', site);
  const { data: session } = useSession();
  // console.log(session);
  const profile = session?.profile;
  // console.log('Profile: ', profile.id);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState();
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({});
  const [didSave, setDidSave] = useState(false);

  const [logo, setLogo] = useState();
  const [ogImage, setOgImage] = useState();
  const [favicon, setFavicon] = useState();

  const handleChange = (e) => {
    e.preventDefault();
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogoChange = (files) => {
    if (files[0] && files[0].size > 250000) {
      //dont allow files over 250kb
      alert("File is too big!");
      return;
    }
    if (files.length > 0) {
      setLogo(files[0]);
    } else {
      setLogo();
    }
  };

  const handleOgImageChange = (files) => {
    if (files[0] && files[0].size > 3000000) {
      //dont allow files over 3mb
      alert("File is too big!");
      return;
    }
    if (files.length > 0) {
      setOgImage(files[0]);
    } else {
      setOgImage();
    }
  };

  const handleFaviconChange = (files) => {
    if (files[0] && files[0].size > 100000) {
      //dont allow files over 0.1mb
      alert("File is too big!");
      return;
    }
    if (files.length > 0) {
      setFavicon(files[0]);
    } else {
      setFavicon();
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const result = await API.sites
      .update({
        session,
        data: {
          name: form.site_name,
          description: form.site_description,
          primary_color: form.primary_color,
          secondary_color: form.secondary_color,
          primary_font: form.primary_font,
          secondary_font: form.secondary_font,
        },
        id: site.id,
      })
      .then(function (profileRes) {
        // console.log('ProfileRes: ', profileRes);
        // console.log('SiteID: ', site.id);
        if (logo) {
          // console.log('Logo: ', logo);
          // const sites = API.sites.find(session);
          // console.log('Sites: ', sites);
          const existingLogoID = site.attributes?.logo?.data?.id;
          // console.log("Existing Logo ID: ", existingLogoID);
          if (existingLogoID) {
            API.uploads.delete({
              id: existingLogoID,
              session,
            });
          }

          // const files = API.uploads.find(session);
          // console.log('Files: ', files);

          // console.log('Logo: ', logo);
          const formData = new FormData();

          formData.append("files", logo);
          formData.append("ref", "api::site.site");
          formData.append("field", "logo");
          formData.append("refId", site.id);

          // console.log('Appended Logo: ', formData);

          return API.uploads.create({
            data: formData,
            session,
          });
        } else {
          return profileRes;
        }
      })
      .then(function (logoRes) {
        if (ogImage) {
          const existingOGImageID = site.attributes?.ogImage?.data?.id;
          // console.log("Existing OG Image ID: ", existingOGImageID);
          if (existingOGImageID) {
            API.uploads.delete({
              id: existingOGImageID,
              session,
            });
          }

          // console.log('OG: ', ogImage);
          const formData = new FormData();

          formData.append("files", ogImage);
          formData.append("ref", "api::site.site");
          formData.append("field", "ogImage");
          formData.append("refId", site.id);

          // console.log('Appended OG: ', formData);

          return API.uploads.create({
            data: formData,
            session,
          });
        } else {
          return logoRes;
        }
      })
      .then(function (faviconRes) {
        if (favicon) {
          const existingFaviconID = site.attributes?.favicon?.data?.id;
          // console.log("Existing Favicon ID: ", existingFaviconID);
          if (existingFaviconID) {
            API.uploads.delete({
              id: existingFaviconID,
              session,
            });
          }

          // console.log('Favicon: ', favicon);
          const formData = new FormData();

          formData.append("files", favicon);
          formData.append("ref", "api::site.site");
          formData.append("field", "favicon");
          formData.append("refId", site.id);

          // console.log('Appended Favicon: ', formData);

          return API.uploads.create({
            data: formData,
            session,
          });
        } else {
          return faviconRes;
        }
      })
      .then(function (result) {
        setIsSaving(false);
        setDidSave(true);
        setTimeout(() => {
          setDidSave(false);
          router.reload(window.location.pathname);
        }, 5000);
        console.log("Saved Successfully: ", result);

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

      <SettingsWrapper activeTab={1}>
        {didSave && (
          <AlertMessage
            status="default"
            title="Site updated successfully"
          ></AlertMessage>
        )}

        <div>
          <h2 className="mt-6 text-4xl text-gray-900">Site Details</h2>
        </div>

        <form className="mt-8 space-y-4 mb-8" onSubmit={onSubmit}>
          <div>
            <label htmlFor="site_name" className="label">
              Name
            </label>
            <input
              id="site_name"
              name="site_name"
              type="text"
              defaultValue={site?.attributes?.name}
              autoComplete="site_name"
              onChange={handleChange}
              className="input"
              placeholder="Enter the name for your website"
            />
            <p className="text-sm mt-2 italic">
              This will be the name of your website that shows up across the
              site for your customers
            </p>
          </div>
          <div>
            <label htmlFor="site_description" className="label">
              Description
            </label>
            <textarea
              id="site_description"
              name="site_description"
              type="text"
              autoComplete="site_description"
              defaultValue={site?.attributes?.description}
              onChange={handleChange}
              className="input"
              placeholder="Enter a description for your website"
            />
            <p className="text-sm mt-2 italic">
              This description will show in search results and on social media
            </p>
          </div>
          <div>
            <label htmlFor="logo_upload" className="label">
              Logo
            </label>
            <FileUploadInput
              name="logo_upload"
              files={logo && [logo]}
              handleChange={handleLogoChange}
              acceptedFileTypes=".jpg,.jpeg,.png,.svg"
              initialFileUrls={[site?.attributes?.logo?.data?.attributes?.url]}
            />
            <p className="text-sm mt-2 italic">
              This will show in your site navbar. Maximum file dimensions
              250x150 pixels.
            </p>
          </div>
          <div>
            <label htmlFor="ogImage_upload" className="label">
              Image
            </label>
            <FileUploadInput
              name="ogImage_upload"
              files={ogImage && [ogImage]}
              initialFileUrls={[
                site?.attributes?.ogImage?.data?.attributes?.url,
              ]}
              handleChange={handleOgImageChange}
              acceptedFileTypes=".jpg,.jpeg,.png,.svg"
            />
            <p className="text-sm mt-2 italic">
              This is the image that will be shown when users share your website
              through text messages or socials. Maximum file dimensions 1200x630
              pixels.
            </p>
          </div>
          <div>
            <label htmlFor="favicon_upload" className="label">
              Favicon
            </label>
            <FileUploadInput
              name="favicon_upload"
              files={favicon && [favicon]}
              initialFileUrls={[
                site?.attributes?.favicon?.data?.attributes?.url,
              ]}
              handleChange={handleFaviconChange}
              acceptedFileTypes=".jpg,.jpeg,.png,.svg,.ico"
            />
            <p className="text-sm mt-2 italic">
              This is the image that will be shown next to your site name on the
              browser tab. The dimensions can be 16x16, 32x32 or 48x48 pixels.
            </p>
          </div>
          <div className="flex gap-2">
            <div>
              <label htmlFor="primary_color" className="label">
                Primary Color e.g. #ff4500
              </label>
              <div className="mt-1 flex rounded-md shadow-sm relative">
                <input
                  type="text"
                  name="primary_color"
                  id="primary_color"
                  className="input !rounded-l-none !z-0"
                  placeholder="000000"
                  defaultValue={site?.attributes?.primary_color || "000000"}
                  onChange={handleChange}
                  autoComplete="primary_color"
                  maxLength={6}
                  required
                />
                <div
                  className="h-5 w-5 rounded-full pointer-events-none absolute inset-y-0 right-2 top-0 bottom-0 my-auto flex items-center pr-3 z-100"
                  style={{
                    backgroundColor: `#${
                      form.primary_color ||
                      site?.attributes?.primary_color ||
                      "#000000"
                    }`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <label htmlFor="secondary_color" className="label">
                Secondary Color e.g. #ff4500
              </label>
              <div className="mt-1 flex rounded-md shadow-sm relative">
                <input
                  type="text"
                  name="secondary_color"
                  id="secondary_color"
                  className="input !rounded-l-none !z-0"
                  placeholder="000000"
                  defaultValue={site?.attributes?.secondary_color || "000000"}
                  onChange={handleChange}
                  autoComplete="secondary_color"
                  maxLength={6}
                  required
                />
                <div
                  className="h-5 w-5 rounded-full pointer-events-none absolute inset-y-0 right-2 top-0 bottom-0 my-auto flex items-center pr-3 z-100"
                  style={{
                    backgroundColor: `#${
                      form.secondary_color ||
                      site?.attributes?.secondary_color ||
                      "#000000"
                    }`,
                  }}
                ></div>
              </div>
            </div>
          </div>
          {/* Google Fonts */}
          <div className="">
            <div className="my-4">
              <label htmlFor="primary_font" className="label">
                Primary Font - this will be the font for your websites headings
              </label>
              <div className="mt-1 flex rounded-md shadow-sm relative">
                <input
                  type="text"
                  name="primary_font"
                  id="primary_font"
                  className="input !rounded-l-none !z-0"
                  placeholder="Enter your preferred Google font"
                  defaultValue={site?.attributes?.primary_font || ""}
                  onChange={handleChange}
                  autoComplete="primary_font"
                />
              </div>
            </div>
            <p className="text-sm mt-2 italic">
              Type in the font family name that you want to use from Google
              Fonts e.g. Play. If the font name contains spaces, replace the
              spaces with a + e.g. Source Code Pro becomes Source+Code+Pro
            </p>
            <div className="my-4">
              <label htmlFor="secondary_font" className="label">
                Secondary Font - this will be the font for your website content
              </label>
              <div className="mt-1 flex rounded-md shadow-sm relative">
                <input
                  type="text"
                  name="secondary_font"
                  id="secondary_font"
                  className="input !rounded-l-none !z-0"
                  placeholder="Enter your preferred Google font"
                  defaultValue={site?.attributes?.secondary_font || ""}
                  onChange={handleChange}
                  autoComplete="secondary_font"
                />
              </div>
            </div>
            <p className="text-sm mt-2 italic">
              Type in the font family name that you want to use from Google
              Fonts e.g. Play. If the font name contains spaces, replace the
              spaces with a + e.g. Source Code Pro becomes Source+Code+Pro
            </p>
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

export const getServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
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
