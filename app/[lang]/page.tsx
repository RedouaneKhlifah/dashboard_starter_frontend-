import { Locale } from "@/i18n-config";
import Footer from "@/components/shared/footer";

interface Props {
  params: {
    lang: Locale;
  };
}

export default async function HowItWorksPage(props: Props) {
  return (
    <main>
      <Footer lang={props.params.lang} isHowItWorks />
    </main>
  );
}
