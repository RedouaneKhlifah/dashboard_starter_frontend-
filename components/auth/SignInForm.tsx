"use client";
import { DictionaryType } from "@/lib/i18n";
import AuthForm from "./AuthForm";
import { FormTypeEnum, IAuthForm } from "@/interfaces";
import { useState } from "react";
import { PartialAuthForm } from "@/interfaces/IAuth";
import { useRouter } from "next/navigation";
import http from "@/lib/http";
import Cookies from "js-cookie";
import useToast from "@/hooks/useToast";
import { set } from "lodash";
import { toastError } from "@/lib/toast";

interface SignInFormProps {
  translation: DictionaryType;
  lang: "fr" | "en" | "ar";
}

const SignInForm: React.FC<SignInFormProps> = ({ translation, lang }) => {
  const [errors, setErrors] = useState<PartialAuthForm>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: IAuthForm) => {
    setIsLoading(true);
    try {
      const response = await http(
        process.env.NEXT_PUBLIC_API_BASE_PATH + "/api/sign-in",
        {
          method: "PUT",
          lang,
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        setErrors({
          general: error.message,
        });
        setIsLoading(false);
        setSuccess(false);
        return;
      }
      const { token } = await response.json();
      setSuccess(true);
      Cookies.set("auth_token", token);
      router.replace(`/${lang}/dashboard`);
    } catch (error) {
      console.error("Error during sign-in:", error);
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      formType={FormTypeEnum.SignIn}
      translation={translation}
      success={success}
      errors={errors}
      setErrors={setErrors}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};

export default SignInForm;
