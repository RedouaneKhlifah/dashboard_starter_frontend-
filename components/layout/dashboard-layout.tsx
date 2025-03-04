// dashboard-layout.tsx
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { Locale } from "@/i18n-config";
import { cn } from "@/lib/utils";
import DashboardNavbar from "../shared/dashboard-navbar";
import { DictionaryType } from "@/lib/i18n";
import { cookies } from "next/headers";

interface DashboardLayoutProps {
  children: ReactNode;
  lang: Locale;
  translation: DictionaryType;
}

export default function DashboardLayout({
  children,
  lang,
  translation,
}: DashboardLayoutProps) {
  const authToken = cookies().get("auth_token")?.value;

  return (
    <>
      <DashboardNavbar lang={lang} />
      <Sidebar lang={lang} translation={translation} authToken={authToken} />
      <main
        id="container-dashboard"
        className={cn(
          " min-h-screen",
          lang === "ar"
            ? "mr-64"
            : "ml-64 , transition-all , ease-in-out , duration-200"
        )}
      >
        <div className="">{children}</div>
      </main>
    </>
  );
}
