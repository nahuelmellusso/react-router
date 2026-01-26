export type CreateUserPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirm: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

type CreateUserOptions = {
  onSuccess?: () => void;
  onError?: (err: unknown) => void;
};
