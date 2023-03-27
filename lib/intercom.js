import moment from "moment";
import CryptoJS from "crypto-js";

const INTERCOM_SECRET_KEY = process.env.NEXT_PUBLIC_INTERCOM_SECRET_KEY;
export default class Intercom {
  static log() {
    console.log(
      "%cIntercom",
      "color:#fff;background:#fd385b;padding:3px 5px;border-radius:4px",
      ...arguments
    );
  }

  static warn() {
    console.warn(
      "%cIntercom",
      "color:#fff;background:#fd385b;padding:3px 5px;border-radius:4px",
      ...arguments
    );
  }

  static init = ({ INTERCOM_ID, session }) => {
    if (!INTERCOM_ID) {
      return this.warn("Intercom not loaded because INTERCOM_ID is empty", {
        INTERCOM_ID,
      });
    }

    try {
      (function () {
        var w = window;
        var ic = w.Intercom;
        if (typeof ic === "function") {
          ic("reattach_activator");
          ic("update", w.intercomSettings);
        } else {
          var d = document;
          var i = function () {
            i.c(arguments);
          };
          i.q = [];
          i.c = function (args) {
            i.q.push(args);
          };
          w.Intercom = i;
          var l = function () {
            var s = d.createElement("script");
            s.type = "text/javascript";
            s.async = true;
            s.src = `https://widget.intercom.io/widget/${INTERCOM_ID}`;
            var x = d.getElementsByTagName("script")[0];
            x.parentNode.insertBefore(s, x);
          };
          if (document.readyState === "complete") {
            l();
          } else if (w.attachEvent) {
            w.attachEvent("onload", l);
          } else {
            w.addEventListener("load", l, false);
          }
        }
      })();

      if (session) {
        var hash = CryptoJS.HmacSHA256(
          session?.profile.email,
          INTERCOM_SECRET_KEY
        );
        var user_hash = CryptoJS.enc.Hex.stringify(hash);

        window.Intercom("boot", {
          api_base: "https://api-iam.intercom.io",
          app_id: INTERCOM_ID,
          name: session?.profile.name, // Full name
          email: session?.profile.email, // Email address
          created_at: moment(session?.profile.createdAt).format("X"), // Signup date as a Unix timestamp
          user_hash: user_hash,
        });
      } else {
        window.Intercom("boot", {
          api_base: "https://api-iam.intercom.io",
          app_id: INTERCOM_ID,
        });
      }
    } catch (error) {
      this.warn("Intercom not loaded because of an error", error);
    }
  };
}
