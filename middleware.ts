import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. /examples (inside /public)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api|_next|fonts|examples|[\\w-]+\\.\\w+).*)",
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers.get("host") || "pressbackend.com";

  /*  You have to replace ".vercel.pub" with your own domain if you deploy this example under your domain.
      You can also use wildcard subdomains on .vercel.app links that are associated with your Vercel team slug
      in this case, our team slug is "platformize", thus *.platformize.vercel.app works. Do note that you'll
      still need to add "*.platformize.vercel.app" as a wildcard domain on your Vercel dashboard. */
  const currentHost =
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
      ? hostname
          .replace(`.pressbackend.com`, "")
          .replace(`.press-backend.vercel.app`, "")
          .replace(`.staging`, "")
      : hostname
          .replace(`.localhost:3000`, "")
          .replace(`.staging.pressbackend.com`, "");

  // rewrites for app pages
  if (currentHost == "app") {
    if (
      url.pathname === "/login" &&
      (req.cookies.get("next-auth.session-token") ||
        req.cookies.get("__Secure-next-auth.session-token"))
    ) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    if(url.search === '?redirect=true'){
      url.pathname = `${url.pathname}`
    } else {
      url.pathname = `/app${url.pathname}`;
    }
    return NextResponse.rewrite(url);
  }

  // rewrite root application to `/home` folder
  if (
    hostname === "localhost:3000" ||
    hostname === "press-backend.vercel.app" ||
    hostname === "staging.pressbackend.com"
  ) {
    url.pathname = `/home${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // rewrite everything else to `/_sites/[site] dynamic route

  if (
    (url.pathname === `_sites/${currentHost}/login` ||
      url.pathname === `_sites/${currentHost}/register`) &&
    (req.cookies.get("next-auth.session-token") ||
      req.cookies.get("__Secure-next-auth.session-token"))
  ) {
    url.pathname = `_sites/${currentHost}/`;
    return NextResponse.redirect(url);
  }

  url.pathname = `/_sites/${currentHost}${url.pathname}`;
  return NextResponse.rewrite(url);
}
