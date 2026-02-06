import { useI18n } from "~/hooks/useI18n";

export default function LocaleHome() {
  const { t } = useI18n();
  return (
    <section>
      <h2 className="text-xl font-bold">{t("nav.home")}</h2>
      <p className="mt-2">({t("app.title")})</p>
    </section>
  );
}
