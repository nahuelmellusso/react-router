import { useI18n } from "~/hooks/useI18n";
import RegisterForm from "~/features/users/RegisterForm";
function Register() {
  const { t } = useI18n();

  return (
    <div className="relative bg-white bg-opacity-70 shadow-md rounded-lg m-2 p-4">
      <h1 className={"text-black text-center p-4"}>{t("auth.createAccount")}</h1>
      <RegisterForm />
    </div>
  );
}

export default Register;
