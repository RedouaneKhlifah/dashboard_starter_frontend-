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
    <header className="bg-card fixed top-0 w-full z-10 border-b">
      <div className="container py-4 flex justify-between items-center">
        <Link href={`/${lang}/dashboard`} className="flex items-center gap-2">
          <Image src={Logo} alt="Logo" width={40} height={40} />
          <span className="font-bold">Le Menu</span>
        </Link>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
