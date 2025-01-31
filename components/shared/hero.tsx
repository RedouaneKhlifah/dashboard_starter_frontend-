import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface HeroProps {
  params: {
    lang: Locale;
  };
}

export async function Hero({ params }: HeroProps) {
  const dict = await getDictionary(params.lang);

  return (
    <section className="relative bg-card mb-10 shadow-md">
      <div className="container py-16 md:py-28 flex flex-col items-center relative">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
          {dict.hero.heading}
        </h1>
        <p className="leading-7 text-center [&:not(:first-child)]:mt-3 mb-5">
          {dict.hero.description}
        </p>
        {/* <SearchBar placeholder={dict.hero["search-bar-placeholder"]} /> */}

        {/* Decoration */}
      </div>
    </section>
  );
}

export function SearchBar({ placeholder }: { placeholder: string }) {
  return (
    <div className="flex w-full max-w-md items-center gap-2">
      <Input type="text" placeholder={placeholder} />
      <Button type="submit" variant="secondary">
        <Search size={20} />
      </Button>
    </div>
  );
}
