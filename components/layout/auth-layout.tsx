// dashboard-layout.tsx
import { ReactNode } from "react";
import Navbar from "../shared/navbar";
import { Locale } from "@/i18n-config";

interface AuthLayoutProps {
  children: ReactNode;
  params: { lang: Locale };
}

export default function AuthLayout({ children, params }: AuthLayoutProps) {
  return (
    <>
      <Navbar lang={params.lang} />
      <main>
        <div>{children}</div>
      </main>
    </>
  );
}
