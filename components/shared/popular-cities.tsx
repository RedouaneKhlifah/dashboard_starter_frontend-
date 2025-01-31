"use server";
import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import Link from "next/link";
import { Locale } from "@/i18n-config";
import { City, TranslatedCityDto } from "@/generated";
import { getDictionary } from "@/lib/i18n";
import http from "@/lib/http";
import { getDotenv } from "@/utils";

async function getCities(lang: Locale): Promise<TranslatedCityDto[]> {
  const API_BASE_PATH = getDotenv("API_BASE_PATH");
  const res = await http(`${API_BASE_PATH}/cities`, {
    headers: {
      "X-Locale": lang,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function PopularCities({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);
  const cities = await getCities(lang);

  return (
    <section>
      <div className="container">
        <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
          {dict.popular_cities}
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {cities.map((city, index) =>
            city.isPublished ? (
              <Link key={index} href={`/${lang}/${city.slug}?categoryId=${city.categories?.[0].id}`}>
                <div key={index} className="rounded-md bg-card overflow-hidden">
                  <AspectRatio ratio={16 / 10} className="overflow-hidden">
                    <Image
                      // TODO: jma3 kerek chwi
                      src={city.imageUrl || "/images/banner.jpg"}
                      alt={city.name || "city image"}
                      fill
                      className="rounded-t-md object-cover"
                    />
                  </AspectRatio>
                  <div className="px-3 py-1 border-x border-b rounded-b-md">
                    <h2 className="scroll-m-20 text-lg font-semibold tracking-tight">
                      {city.name}
                    </h2>
                  </div>
                </div>
              </Link>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
}
