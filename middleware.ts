import { NextResponse, type NextRequest } from "next/server";
import { i18n } from "./i18n-config";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { jwtVerify } from "jose";

// Locale detection utilities
const getLocale = (request: NextRequest): string => {
  const negotiatorHeaders = Object.fromEntries(request.headers.entries());
  const locales = i18n.locales as ["en", "fr", "ar"];
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );
  return matchLocale(languages, locales, i18n.defaultLocale);
};

// Auth response handlers
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

const handleUnauthenticated = (
  request: NextRequest,
  locale: string,
  pathname: string
) => {
  if (!pathname.startsWith(`/${locale}/sign-in`)) {
    return createAuthRedirect(request, locale, "/sign-in");
  }
  return NextResponse.next();
};

const preventSignInAccess = (request: NextRequest, locale: string) => {
  return createAuthRedirect(request, locale, "/dashboard");
};

// Token verification
const verifyAuthToken = async (token: string) => {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    return await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "JWTExpired") {
        throw new Error("Token expired");
      }
      if (error.name === "JWTInvalid") {
        throw new Error("Invalid token");
      }
    }
    throw new Error("Authentication failed" + error);
  }
};

const handleTokenVerification = async (
  request: NextRequest,
  locale: string,
  token: string
) => {
  try {
    await verifyAuthToken(token);
    return NextResponse.next();
  } catch (error) {
    return createAuthRedirect(request, locale, "/sign-in");
  }
};

// Main middleware handler
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = getLocale(request);
  const authToken = request.cookies.get("auth_token")?.value;

  if (!authToken) {
    return handleUnauthenticated(request, locale, pathname);
  }

  if (pathname.startsWith(`/${locale}/sign-in`)) {
    return preventSignInAccess(request, locale);
  }

  return await handleTokenVerification(request, locale, authToken);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
