import { NextResponse, type NextRequest } from "next/server";
import { i18n } from "./i18n-config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { jwtVerify } from "jose";

// Get the supported locales
const locales = i18n.locales;

// Locale detection
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

// Redirect handler for unauthenticated users
const createSignInRedirect = (request: NextRequest, locale: string) => {
  const redirectUrl = new URL(`/${locale}/sign-in`, request.url);
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.delete("auth_token");
  return response;
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const authToken = request.cookies.get("auth_token")?.value;

  // Check if pathname has a valid locale
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Use detected locale or existing pathname locale
  const locale = pathnameLocale || getLocale(request);

  // Redirect if no locale in pathname
  if (!pathnameLocale) {
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  // Handle unauthenticated users
  if (!authToken) {
    if (!pathname.startsWith(`/${locale}/sign-in`)) {
      return createSignInRedirect(request, locale);
    }
    return NextResponse.next();
  }

  // Prevent authenticated users from accessing sign-in
  if (pathname.startsWith(`/${locale}/sign-in`)) {
    const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Verify token for protected routes
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(authToken, secret, { algorithms: ["HS256"] });
    return NextResponse.next();
  } catch (error) {
    console.error("Authentication failed:", error);
    return createSignInRedirect(request, locale);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
