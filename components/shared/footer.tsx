import { Locale } from "@/i18n-config";
import { Button } from "../ui/button";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n";
import { Mail, Phone } from "lucide-react";

export default async function Footer({
  lang,
  isHowItWorks = false,
}: {
  lang: Locale;
  isHowItWorks?: boolean;
}) {
  const { footer } = await getDictionary(lang);

  return (
    <footer className="border-t bg-card justify-self-center h-full py-8">
      <div className="container">
        <h1 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0">
          {footer.heading}
        </h1>
        <p className="text-muted-foreground pb-4">{footer.description}</p>
        <div className="flex gap-3">
          {!isHowItWorks && (
            <Link href={`/${lang}/how-it-works`}>
              <Button size="lg">{footer.learn_cta}</Button>
            </Link>
          )}
          <Link
            target="_blank"
            href={`mailto:contact.le.menu.ma@gmail.com?bcc=yboukhiri@gmail.com&subject=${footer.email_subject}&body=${footer.email_body}`}
          >
            <Button size="lg" variant={isHowItWorks ? "default" : "secondary"}>
              {footer.contact_cta}
            </Button>
          </Link>
        </div>

        <div className="border-b my-5 border-dashed"></div>

        <h2 className="scroll-m-20 pb-3 font-medium tracking-tight first:mt-0">
          {footer.info}
        </h2>

        <div className="space-y-2">
          <Link href="tel:0701172213" target="_blank">
            <div className="text-muted-foreground flex items-center gap-1">
              <Phone strokeWidth={1.2} className="text-primary" />
              <p dir="ltr">07 01 17 22 13</p>
            </div>
          </Link>
          <div className="text-muted-foreground flex items-center gap-1">
            <Mail strokeWidth={1.2} className="text-primary" />
            <p>contact.le.menu.ma@gmail.com</p>
          </div>
        </div>

        <div className="border-b my-5"></div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-5">
          <p className="text-muted-foreground pt-4 sm:pt-0">
            contact.le.menu.ma@gmail.com
          </p>
          <p className="text-muted-foreground text-sm">© 2024, Le-Menu.ma</p>
        </div>
      </div>
    </footer>
  );
}
