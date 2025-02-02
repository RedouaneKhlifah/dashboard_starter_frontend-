// dashboard-layout.tsx
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { Locale } from "@/i18n-config";
import { cn } from "@/lib/utils";
import DashboardNavbar from "../shared/dashboard-navbar";

interface DashboardLayoutProps {
  children: ReactNode;
  params: { lang: Locale };
}

export default function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  return (
    <>
      <DashboardNavbar lang={params.lang} />
      <Sidebar lang={params.lang} />
      <main
        className={cn(
          " min-h-screen",
          params.lang === "ar" ? "mr-64" : "ml-64"
        )}
      >
        <div className="">{children}</div>
      </main>
    </>
  );
}
