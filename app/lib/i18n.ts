import en from "../i18n/en.json";
import es from "../i18n/es.json";

export type Locale = "en" | "es";
export type Messages = Record<string, string>;

const catalogs: Record<Locale, Messages> = {
    en,
    es,
};

export function isSupportedLocale(value: string | undefined): value is Locale {
    return value === "en" || value === "es";
}

export function getMessages(locale: Locale): Messages {
    return catalogs[locale];
}

export function createTranslator(messages: Messages) {
    return (key: string, fallback?: string) => messages[key] ?? fallback ?? key;
}
