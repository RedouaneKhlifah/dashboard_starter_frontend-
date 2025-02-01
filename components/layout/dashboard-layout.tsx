// dashboard-layout.tsx
import { ReactNode } from "react";
import Navbar from "../shared/navbar";
import Sidebar from "./Sidebar";
import { Locale } from "@/i18n-config";

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
      <Navbar lang={params.lang} />
      <Sidebar lang={params.lang}/>
      <main className="ml-64 pt-16 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </>
  );
}
