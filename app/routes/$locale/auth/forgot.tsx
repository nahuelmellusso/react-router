import { useI18n } from "~/routes/$locale";
import { Button, FormError, Input } from "~/components";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { apiFetch } from "~/helpers/apiFetch";
import { useState } from "react";
import { showToast } from "~/helpers/showToast";
function Forgot() {
  const { locale, t } = useI18n();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const registerSchema = z.object({
    email: z.email("Invalid email address"),
    lang: z.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      lang: locale ?? "en",
    },
  });

  const ChevronIcon = () => (
    <ChevronRightIcon className="h-5 w-5 text-gray-400 text-violet-800" aria-hidden="true" />
  );

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      setIsPending(true);
      await apiFetch({
        method: "POST",
        url: "auth/forgot-password",
        data: data,
      })();
      setSuccess(true);
    } catch {
      showToast({
        type: "error",
        message: "Error",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative bg-white bg-opacity-70 shadow-md rounded-lg m-2 p-4 max-w-xs">
      {success ? (
        <>
          <p className="text-black text-center p-4 whitespace-pre-line">
            {t("forgot.link.success")}
          </p>
        </>
      ) : (
        <>
          <h1 className={"text-black text-center p-4"}>{t("forgot.explain")}</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
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
            <Button
              text={t("forgot.sendLink")}
              Icon={ChevronIcon}
              type={"submit"}
              name="save-user-bttn"
              disabled={isPending}
              isLoading={isPending}
            />
          </form>
        </>
      )}
    </div>
  );
}

export default Forgot;
