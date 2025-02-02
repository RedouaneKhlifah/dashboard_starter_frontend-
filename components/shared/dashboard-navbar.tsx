import LocaleSwitcher from "./locale-switcher";
import { Locale } from "@/i18n-config";
import { ThemeToggle } from "./theme-toggle";
import { getDictionary } from "@/lib/i18n";

interface NavbarProps {
  lang: Locale;
}

export default async function DashboardNavbar({ lang }: NavbarProps) {
  const dict = await getDictionary(lang);
  return (
    <header className="bg-card  w-full z-10 border-b">
      <div className="container py-4 flex justify-end items-center">
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
