"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { i18n, type Locale } from "@/i18n-config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "../ui/button";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { isoLangs } from "@/lib/iso-langs";

export default function LocaleSwitcher() {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const redirectedPathName = (locale: Locale) => {
    if (!pathName) return "/";
    const segments = pathName.split("/");
    segments[1] = locale;
    const searchParamsString = new URLSearchParams(searchParams).toString();
    const pathnameWithSearchParams = searchParamsString
      ? `${segments.join("/")}?${searchParamsString}`
      : segments.join("/");
    return pathnameWithSearchParams;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
      >
        <Languages />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {i18n.locales.map((locale) => {
          return (
            <Link
              key={locale}
              locale={locale}
              href={redirectedPathName(locale)}
            >
              <DropdownMenuItem>{isoLangs.get(locale)?.nativeName}</DropdownMenuItem>
            </Link>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
