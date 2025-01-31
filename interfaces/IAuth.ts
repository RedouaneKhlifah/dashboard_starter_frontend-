enum FormTypeEnum {
  SignIn = "sign-in",
  SignUp = "sign-up",
}

interface IAuthForm {
  fullName: string;
  email: string;
  password: string;
}

interface PartialAuthForm extends Partial<IAuthForm> {
  general?: string;
}

export { FormTypeEnum };
export type { IAuthForm, PartialAuthForm };
