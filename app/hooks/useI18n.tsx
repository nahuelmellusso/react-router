import { type LoaderFunctionArgs, useRouteLoaderData } from "react-router";
import {
  createTranslator,
  getMessages,
  isSupportedLocale,
  type Locale,
  type Messages,
} from "~/lib/i18n";

type LoaderData = {
  locale: Locale;
  messages: Messages;
};
export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderData> {
  const l = params.locale;
  if (!isSupportedLocale(l)) {
    // Si el locale no es válido, 404
    throw new Response("Not Found", { status: 404 });
  }
  const locale = l as Locale;
  const messages = getMessages(locale);
  return { locale, messages };
}
export function useI18n() {
  const data = useRouteLoaderData("locale-root") as LoaderData | undefined;
  if (!data) {
    // Fallback por si algo falla
    return {
      locale: "en" as Locale,
      t: (k: string, f?: string) => f ?? k,
    };
  }
  const t = createTranslator(data.messages);
  return { locale: data.locale, t };
}