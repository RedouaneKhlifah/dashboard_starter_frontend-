import SignInForm from "@/components/auth/SignInForm";
import AuthLayout from "@/components/layout/auth-layout";
import { Locale } from "@/i18n-config";
import { DictionaryType, getDictionary } from "@/lib/i18n";

interface Props {
  params: {
    lang: Locale;
  };
}

export default async function SignIn(props: Props) {
  const translation: DictionaryType = await getDictionary(props.params.lang);
  const lang = props.params.lang;

  return (
    <AuthLayout params={props.params}>
      <div
        className="flex items-center justify-center pb[72px]"
        style={{ height: "calc(100vh - 72px)" }}
      >
        <SignInForm translation={translation} lang={lang} />
      </div>
    </AuthLayout>
  );
}
