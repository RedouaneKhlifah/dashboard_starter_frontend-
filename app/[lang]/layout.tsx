import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../../saas-config/globals.css";
import Navbar from "@/components/shared/navbar";
import { Locale } from "@/i18n-config";
import { ThemeProvider } from "@/components/shared/theme-provider";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

// TODO: fill in real metadata
export const metadata: Metadata = {
  title: "Le Menu",
  description: "",
};

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
      <body className={poppins.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar lang={params.lang} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
