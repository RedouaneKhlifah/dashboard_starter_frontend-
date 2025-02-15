import { NextResponse, type NextRequest } from "next/server";
import { i18n } from "./i18n-config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { jwtVerify } from "jose";

// Get the supported locales
const locales = i18n.locales;

// Locale detection with proper types
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

// Auth redirect handler
const createAuthRedirect = (
  request: NextRequest,
  locale: string,
  path: string
) => {
  const redirectUrl = new URL(`/${locale}${path}`, request.url);
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.delete("auth_token");
  return response;
};

// Main middleware
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

  // Handle authentication
  if (!authToken) {
    if (!pathname.startsWith(`/${locale}/sign-in`)) {
      return createAuthRedirect(request, locale, "/sign-in");
    }
    return NextResponse.next();
  }

  // Prevent accessing sign-in when authenticated
  if (pathname.startsWith(`/${locale}/sign-in`)) {
    return createAuthRedirect(request, locale, "/dashboard");
  }

  // Verify token for protected routes
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(authToken, secret, { algorithms: ["HS256"] });
    return NextResponse.next();
  } catch (error) {
    console.error("Authentication failed:", error);
    return createAuthRedirect(request, locale, "/sign-in");
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
