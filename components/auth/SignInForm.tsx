"use client";
import { DictionaryType } from "@/lib/i18n";
import AuthForm from "./AuthForm";
import { FormTypeEnum, IAuthForm } from "@/interfaces";
import { useState } from "react";
import { PartialAuthForm } from "@/interfaces/IAuth";
import { useRouter } from "next/navigation";
import http from "@/lib/http";
import Cookies from "js-cookie";
import { useToast } from "@/components/ui/toast";

interface SignInFormProps {
  translation: DictionaryType;
  lang: "fr" | "en" | "ar";
}

const SignInForm: React.FC<SignInFormProps> = ({ translation, lang }) => {
  const [errors, setErrors] = useState<PartialAuthForm>({});
  const router = useRouter();
  const { addToast } = useToast();

  const handleSubmit = async (data: IAuthForm) => {
    try {
      const response = await http(
        process.env.NEXT_PUBLIC_API_BASE_PATH + "/api/sign-in",
        {
          method: "POST",
          lang,
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        addToast({
          type: "error",
          message: error.message || "An error occurred",
          duration: 3000
        });
        setErrors({
          general: error.message,
        });
        return;
      }

      const { token } = await response.json();
      Cookies.set("auth_token", token);

      router.push(`/${lang}/dashboard`);
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };
  return (
    <AuthForm
      formType={FormTypeEnum.SignIn}
      translation={translation}
      errors={errors}
      setErrors={setErrors}
      onSubmit={handleSubmit}
    />
  );
};

export default SignInForm;
