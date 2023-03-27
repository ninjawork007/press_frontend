export const init = (FACEBOOK_PIXEL_ID) => {
  if (!window.fbq) {
    try {
      var noscript = document.createElement("noscript");
      var img = document.createElement("img");
      img.setAttribute("height", 1);
      img.setAttribute("width", 1);
      img.setAttribute("style", "display:none");
      img.setAttribute(
        "src",
        `https://www.facebook.com/tr?id=${FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`
      );
      noscript.appendChild(img);
      document.body.appendChild(noscript);

      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        "script",
        "https://connect.facebook.net/en_US/fbevents.js"
      );
      window.fbq("init", FACEBOOK_PIXEL_ID);
    } catch (n) {
      console.log(n);
    }
  }
};

export const pageview = () => {
  if (window.fbq) {
    try {
      window.fbq("track", "PageView");
    } catch (n) {
      console.log(n);
    }
  }
};

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name, options = {}) => {
  if (window.fbq) {
    try {
      window.fbq("track", name, options);
    } catch (n) {
      console.log(n);
    }
  }
};
