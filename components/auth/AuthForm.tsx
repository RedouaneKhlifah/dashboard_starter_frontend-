"use client";

import { DictionaryType } from "@/lib/i18n";
import { Dispatch, SetStateAction, useState } from "react";
import { InputField, GoogleButton } from "../ui";
import { Condition } from "../utils";
import { AuthValidation } from "@/validation";
import { FormTypeEnum } from "@/interfaces";
import { IAuthForm, PartialAuthForm } from "@/interfaces/IAuth";
import { Spinner, Button } from "@material-tailwind/react";

interface AuthFormProps {
  formType: FormTypeEnum;
  translation: DictionaryType;
  errors: PartialAuthForm;
  setErrors: Dispatch<SetStateAction<PartialAuthForm>>;
  onSubmit: (formData: IAuthForm, error?: string | undefined) => void;
  isLoading?: boolean;
}

const AuthForm = ({
  formType,
  translation,
  errors,
  setErrors,
  onSubmit,
  isLoading,
}: AuthFormProps) => {
  const { auth } = translation;
  const { validateAuthForm } = AuthValidation;

  const [formData, setFormData] = useState<IAuthForm>({
    email: "",
    password: "",
    fullName: "", // This will be used only for SignUp
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    // Clear error when user starts typing
    if (errors[id as keyof PartialAuthForm]) {
      setErrors((prev: PartialAuthForm) => ({
        ...prev,
        [id]: undefined,
      }));
    }
    setErrors((prev: PartialAuthForm) => ({
      ...prev,
      ["general"]: undefined,
    }));
  };

  // Handle form submission and validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateAuthForm(formData, formType, translation);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      await onSubmit(formData);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-sm bg-defaultground border border-border">
      {/* Form header */}
      <h1 className="text-2xl font-semibold text-foreground text-center mb-2">
        {formType === FormTypeEnum.SignIn
          ? auth.welcomeBack
          : auth.createAccount}
      </h1>
      <p className="text-sm text-muted-foreground text-center mb-6">
        {formType === FormTypeEnum.SignIn
          ? auth.enterCredentials
          : auth.enterDetails}
      </p>

      <Condition
        if={errors.general}
        render={
          <p
            className="mt-1 text-sm text-center text-red-500 mb-5"
            role="alert"
          >
            {errors.general}
          </p>
        }
      />

      {/* Form body */}
      <form onSubmit={handleSubmit}>
        <div className="lg:space-y-4 space-y-5">
          {/* Conditionally render Full Name field for SignUp */}
          <Condition
            if={formType === FormTypeEnum.SignUp}
            render={
              <InputField
                id="fullName"
                label={auth.fullName}
                value={formData.fullName}
                onChange={handleChange}
                placeholder={auth.fullNamePlaceholder}
                error={errors.fullName}
                required={formType === FormTypeEnum.SignUp}
              />
            }
          />

          {/* Email field */}
          <InputField
            id="email"
            label={auth.email}
            value={formData.email}
            onChange={handleChange}
            placeholder="name@example.com"
            error={errors.email}
            required={true}
          />

          {/* Password field */}
          <InputField
            id="password"
            label={auth.password}
            type="password"
            value={formData.password}
            onChange={handleChange}
            showPasswordToggle={true}
            error={errors.password}
            required={true}
          />

          {/* Conditionally render "Forgot password?" link for SignIn */}
          {/* <Condition
            if={formType === FormTypeEnum.SignIn}
            render={
              <div className="flex items-center justify-end">
                <a
                  href="/forgot-password"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Forgot password?
                </a>
              </div>
            }
          /> */}

          {/* Submit button */}

          <button
            type="submit"
            className="w-full !mt-6 lg:py-2 py-3 px-3 bg-button text-button-foreground hover:bg-button-hover disabled:opacity-80 disabled:cursor-not-allowed rounded-sm font-medium transition-colors"
            disabled={isLoading}
          >
            <Condition
              if={isLoading}
              render={
                <div className="flex items-center justify-center gap-2">
                  <Spinner
                    className="h-4 w-4"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                  {translation.shared["loading "]}
                </div>
              }
              else={
                formType === FormTypeEnum.SignIn ? auth.signIn : auth.signUp
              }
            />
          </button>

          {/* Divider between buttons */}
          {/* <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-foreground">
                {auth.continueWith}
              </span>
            </div>
          </div> */}

          {/* Google login button */}
          {/* <GoogleButton /> */}
        </div>
      </form>

      {/* Footer with sign-up/sign-in switch */}
      {/* <p className="mt-6 text-center text-sm text-foreground">
        {formType === FormTypeEnum.SignIn
          ? auth.dontHaveAccount
          : auth.alreadyHaveAccount}
        <a
          href={`/${
            formType === FormTypeEnum.SignIn
              ? FormTypeEnum.SignUp
              : FormTypeEnum.SignIn
          }`}
          className="text-button hover:text-button-hover mx-1"
        >
          {formType === FormTypeEnum.SignIn ? auth.signUp : auth.signIn}
        </a>
      </p> */}
    </div>
  );
};

export default AuthForm;
