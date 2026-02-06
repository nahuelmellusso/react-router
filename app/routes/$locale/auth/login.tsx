import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import { KeyIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { Button, FormError, Input } from "~/components";
import { Link, useLocation, useNavigate, useParams } from "react-router";

import type { LoginPayload } from "~/features/users/types/types";
import { useAuth } from "~/features/users/hooks/useAuth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { showToast } from "~/helpers/showToast";
import { useI18n } from "~/hooks/useI18n";

export default function Login() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { locale = "en" } = useParams<{ locale: string }>();
  const { mutate: login, isPending } = useAuth();
  const location = useLocation();
  const loginSchema = z.object({
    email: z.email(t("auth.email.invalid")),
    password: z.string().min(6, t("auth.password.invalid.min")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const from = location.state?.from as string | undefined;

  const onSubmit = (data: LoginPayload) => {
    login(data, {
      onSuccess: () => {
        reset();
        navigate(from ?? `/${locale}/dashboard`, { replace: true });
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
      },
    });
  };

  const ChevronIcon = () => (
    <ChevronRightIcon className="h-5 w-5 text-gray-400 text-violet-800" aria-hidden="true" />
  );

  return (
    <div className="relative bg-white bg-opacity-70 shadow-md rounded-lg m-2 p-4">
      <div className="absolute inset-0 bg-white rounded-lg"></div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative p-4">
          <div>
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
          <div className="mt-4">
            <Input
              id="password"
              type="password"
              placeholder={t("auth.password.placeholder")}
              required
              minLength={6}
              {...register("password")}
            >
              <KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </Input>
            <FormError error={errors.password} />
          </div>
          <div className="mt-4 text-right">
            <Link to={`/${locale}/auth/forgot-password`} className="text-gray-900 text-xs">
              {t("auth.password.forgot")}
            </Link>
          </div>

          <Button
            text={t("auth.singIn")}
            Icon={ChevronIcon}
            type={"submit"}
            name="save-user-bttn"
            disabled={isPending}
            isLoading={isPending}
          />

          <div className="flex items-center justify-center mt-2">
            <Link
              to={`/${locale}/auth/register`}
              className="flex items-center px-2 py-1 bg-white border-violet-800 border-2 text-gray-900 text-xs rounded-full w-full justify-between"
            >
              {t("auth.singUp")}
              <UserPlusIcon className="h-5 w-5 text-gray-400 text-violet-800" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
