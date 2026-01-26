import { useI18n } from "~/routes/$locale";
import { Button, Input } from "~/components";
import { showToast } from "~/helpers/showToast";

import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { apiFetch } from "~/helpers/apiFetch";
import { CheckIcon, KeyIcon } from "@heroicons/react/24/outline";
function ResetPassword() {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const { locale } = useParams();
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      return;
    }
  }, [token]);

  const ChevronIcon = () => (
    <ChevronRightIcon className="h-5 w-5 text-gray-400 text-violet-800" aria-hidden="true" />
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (password !== passwordConfirm) {
      setServerError(t("auth.passwordNotMatch"));
      return;
    }

    try {
      setIsPending(true);
      await apiFetch({
        method: "POST",
        url: "auth/reset-password",
        data: { token, password, passwordConfirm },
      })();
      showToast({
        type: "success",
        message: t("reset.success"),
      });
      navigate(`/${locale}/auth/login`);
    } catch {
      setServerError(t("reset.error"));
      showToast({
        type: "error",
        message: serverError ?? "Error",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative bg-white bg-opacity-70 shadow-md rounded-lg m-2 p-4 max-w-xs">
      <h1 className={"text-black text-center p-4"}>{t("reset.enterNewPassword")}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mt-2">
          <Input
            id="password"
            type="password"
            required
            minLength={6}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("auth.password.placeholder")}
          >
            <KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Input>
        </div>
        <div className="mt-2">
          <Input
            id="passwordConfirm"
            type="password"
            required
            minLength={6}
            placeholder={t("auth.passwordConfirm")}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          >
            <CheckIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Input>
        </div>
        <Button
          text={t("reset.myPassword")}
          Icon={ChevronIcon}
          type={"submit"}
          name="save-user-bttn"
          disabled={isPending}
          isLoading={isPending}
        />
      </form>
    </div>
  );
}
export default ResetPassword;
