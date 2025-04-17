import { NextResponse, type NextRequest } from "next/server";
import { i18n } from "./i18n-config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { jwtVerify } from "jose";

const locales = i18n.locales;

const getLocale = (request: NextRequest): string => {
  const negotiatorHeaders = Object.fromEntries(request.headers.entries());
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales as unknown as string[]
  );

  try {
    return matchLocale(languages, locales, i18n.defaultLocale);
  } catch (error) {
    return i18n.defaultLocale;
  }
};

const createSignInRedirect = (request: NextRequest, locale: string) => {
  const redirectUrl = new URL(`/${locale}/sign-in`, request.url);
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.delete("auth_token");
  return response;
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const authToken = request.cookies.get("auth_token")?.value;

  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  const locale = pathnameLocale || getLocale(request);

  if (!pathnameLocale) {
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  if (!authToken) {
    if (!pathname.startsWith(`/${locale}/sign-in`)) {
      return createSignInRedirect(request, locale);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith(`/${locale}/sign-in`)) {
    const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(authToken, secret, { algorithms: ["HS256"] });

    // Redirect root locale path to dashboard
    if (pathname === `/${locale}`) {
      const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Authentication failed:", error);
    return createSignInRedirect(request, locale);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
