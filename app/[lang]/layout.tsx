import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../../saas-config/globals.css";
import Navbar from "@/components/shared/dashboard-navbar";
import { Locale } from "@/i18n-config";
import { ThemeProvider } from "@/components/shared/theme-provider";
import Sidebar from "@/components/layout/Sidebar";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

// TODO: fill in real metadata
export const metadata: Metadata = {
  title: "Zaroudi",
  description: "",
};

// root-layout.tsx
export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: Locale };
}>) {
  const dir = params.lang === "ar" ? "rtl" : "ltr";
  return (
    <html lang={params.lang} dir={dir} className="dark">
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={poppins.className}>
        <Toaster containerStyle={{ zIndex: 99999 }} position="top-center" />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
