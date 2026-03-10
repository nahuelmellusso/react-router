import type { User } from "./types/types";

export const getDefaultValues = (user?: User | null) => {
  if (user) {
    return {
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      primaryPosition: user.primaryPosition ?? "",
      secondaryPosition: user.secondaryPosition ?? "",
      password: "",
      passwordConfirm: "",
      avatar: null,
    };
  }

  return {
    name: "",
    email: "",
    phone: "",
    primaryPosition: "",
    secondaryPosition: "",
    password: "",
    passwordConfirm: "",
    avatar: null,
    generatePassword: true,
  };
};
