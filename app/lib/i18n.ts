import en from "../i18n/en.json";
import es from "../i18n/es.json";

export type Locale = "en" | "es";

export type MessageValue = string | { [key: string]: MessageValue };
export type Messages = Record<string, MessageValue>;

const catalogs: Record<Locale, Messages> = {
  en: en as Messages,
  es: es as Messages,
};

export function isSupportedLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "es";
}

export function getMessages(locale: Locale): Messages {
  return catalogs[locale];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
function getByPath(obj: Messages, path: string): string | undefined {
  const parts = path.split(".");
  let cur: unknown = obj;

  for (const p of parts) {
    if (!isRecord(cur)) return undefined;
    cur = cur[p];
  }

  return typeof cur === "string" ? cur : undefined;
}

export function createTranslator(messages: Messages) {
  return (key: string, fallback?: string) => getByPath(messages, key) ?? fallback ?? key;
}
