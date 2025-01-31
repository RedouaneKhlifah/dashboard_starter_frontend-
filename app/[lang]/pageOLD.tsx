import Footer from "@/components/shared/footer";
import { Hero } from "@/components/shared/hero";
import PopularCities from "@/components/shared/popular-cities";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/i18n";

interface HomeProps {
  params: {
    lang: Locale;
  };
}

export default async function Home({ params }: HomeProps) {
  const dictionary = await getDictionary(params.lang);

  return (
    <main>
      <div className="min-h-[80vh] pb-12">
        <Hero params={params} />
        <PopularCities lang={params.lang} />
      </div>
      <Footer lang={params.lang} />
    </main>
  );
}
