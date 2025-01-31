"use client";
import { DictionaryType } from "@/lib/i18n";
import AuthForm from "./AuthForm";
import { FormTypeEnum, IAuthForm } from "@/interfaces";
import { useState } from "react";
import { PartialAuthForm } from "@/interfaces/IAuth";
import { ERROR_CODES_ENUM } from "@/constant/errorCodes";
import http from "@/lib/http";

interface SignInFormProps {
  translation: DictionaryType;
  lang: "fr" | "en" | "ar";
}

const SignInForm: React.FC<SignInFormProps> = ({ translation, lang }) => {
  const [errors, setErrors] = useState<PartialAuthForm>({});

  const handleSubmit = async (data: IAuthForm) => {
    try {
      // Add the Accept-Language header to the request
      const response = await http("http://localhost:8000/api/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": lang,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        setErrors({
          general: error.message,
        });
        return;
      }

      const result = await response.json();
      console.log("Sign-in successful:", result);
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
