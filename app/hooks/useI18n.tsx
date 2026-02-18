import { type LoaderFunctionArgs, useMatches } from "react-router";
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
    throw new Response("Not Found", { status: 404 });
  }
  const locale = l as Locale;
  const messages = getMessages(locale);
  return { locale, messages };
}

function isLoaderData(x: unknown): x is LoaderData {
  return !!x && typeof x === "object" && "locale" in x && "messages" in x;
}

export function useI18n() {
  const matches = useMatches();

  const data = [...matches]
    .reverse()
    .map((m) => m.data)
    .find(isLoaderData);

  if (!data) {
    return {
      locale: "en" as Locale,
      t: (k: string, f?: string) => f ?? k,
    };
  }

  return { locale: data.locale, t: createTranslator(data.messages) };
}
