import LocaleSwitcher from "./locale-switcher";
import Link from "next/link";
import { Locale } from "@/i18n-config";
import { ThemeToggle } from "./theme-toggle";
import { getDictionary } from "@/lib/i18n";
import Logo from "@/public/le_menu_svg_logo.svg";
import Image from "next/image";

interface NavbarProps {
  lang: Locale;
}

export default async function Navbar({ lang }: NavbarProps) {
  const dict = await getDictionary(lang);
  return (
    <header className="bg-card">
      <div className="container py-4 flex items-center justify-between">
        <Link href={`/${lang}/`} className="flex items-end gap-2">
          <Image src={Logo} alt="" width={30} />
          <p className="font-semibold text-2xl tracking-tight text-primary leading-none">
            {dict.nav.logo}
          </p>
        </Link>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
