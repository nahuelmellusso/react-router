import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateUser } from "~/hooks/useCreateUser";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { Button, Input } from "~/components";
import { CheckIcon, EnvelopeIcon, KeyIcon, UserIcon } from "@heroicons/react/24/outline";
import { FormError } from "~/components";
import { showToast } from "~/helpers/showToast";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { useI18n } from "~/hooks/useI18n";

const RegisterForm = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { locale } = useParams();

  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    passwordConfirm: z.string().min(6, "Password confirmation must be at least 6 characters"),
    phone: z.string().min(1, "Phone is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const { mutate: createUser, isPending } = useCreateUser();

  const onSubmit = (data: z.infer<typeof registerSchema>) => {
    setServerError(null);
    setServerSuccess(null);

    createUser(data, {
      onSuccess: () => {
        setServerSuccess("Account created successfully");
        showToast({
          type: "success",
          message: t("account.created"),
        });
        reset();
        navigate(`/${locale}/auth/login`);
      },
      onError: (err) => {
        let msg = t("account.error");

        if (axios.isAxiosError(err)) {
          const dataMsg = err.response?.data?.message;

          if (Array.isArray(dataMsg)) {
            msg = dataMsg.join(", ");
          } else if (typeof dataMsg === "string") {
            msg = dataMsg;
          }
        }

        showToast({
          type: "error",
          message: msg,
        });

        setServerError(msg);
      },
    });
  };

  const ChevronIcon = () => (
    <ChevronRightIcon className="h-5 w-5 text-gray-400 text-violet-800" aria-hidden="true" />
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-2">
        <Input id="name" type="text" placeholder={t("auth.name")} {...register("name")}>
          <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Input>
        <FormError error={errors.name} />
      </div>
      <div className="mt-2">
        <Input
          id="email"
          type="email"
          placeholder={t("auth.email.placeholder")}
          {...register("email")}
        >
          <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Input>
        <FormError error={errors.email} />
      </div>
      <div className="mt-2">
        <Input id="phone" type="phone" placeholder={t("auth.phone")} {...register("phone")}>
          <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Input>
        <FormError error={errors.phone} />
      </div>
      <div className="mt-2">
        <Input
          id="password"
          type="password"
          placeholder={t("auth.password.placeholder")}
          {...register("password")}
        >
          <KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Input>
        <FormError error={errors.password} />
      </div>
      <div className="mt-2">
        <Input
          id="passwordConfirm"
          type="password"
          placeholder={t("auth.passwordConfirm")}
          {...register("passwordConfirm")}
        >
          <CheckIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Input>
        <FormError error={errors.passwordConfirm} />
      </div>
      <Button
        text={t("auth.lestGo")}
        Icon={ChevronIcon}
        type={"submit"}
        name="save-user-bttn"
        disabled={isPending}
        isLoading={isPending}
      />
    </form>
  );
};

export default RegisterForm;
