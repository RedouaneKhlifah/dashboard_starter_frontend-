// dashboard-layout.tsx
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { Locale } from "@/i18n-config";
import { cn } from "@/lib/utils";
import DashboardNavbar from "../shared/dashboard-navbar";
import { DictionaryType } from "@/lib/i18n";

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
  return (
    <>
      <DashboardNavbar lang={lang} />
      <Sidebar lang={lang} translation={translation} />
      <main className={cn(" min-h-screen", lang === "ar" ? "mr-64" : "ml-64")}>
        <div className="">{children}</div>
      </main>
    </>
  );
}
