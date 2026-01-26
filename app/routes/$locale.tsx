import { Outlet, Link, useRouteLoaderData, useParams, useLocation } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { createTranslator, getMessages, isSupportedLocale, type Locale, type Messages } from "~/lib/i18n";
import {useLocaleHref} from "~/hooks/useLocaleHref";
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

// Helper hook para subrutas
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

export default function LocaleLayout() {
    const { locale, t } = useI18n();
    const { locale: current } = useParams();
    const { pathname, search, hash } = useLocation();
    const makeHref = useLocaleHref();


    return (
        <div className="min-h-screen">
            <header className="p-4 border-b flex items-center gap-4">
              {/*  <h1 className="text-lg font-semibold">{t("app.title")}</h1>
                <nav className="flex gap-3">
                    <Link to={`/${locale}`}>{t("nav.home")}</Link>
                    <Link to={`/${locale}/dashboard`}>{t("nav.dashboard")}</Link>
                </nav>*/}
                <div className="ml-auto flex gap-2">
                    <Link to={makeHref("en")}>EN</Link>
                    <span>|</span>
                    <Link to={makeHref("es")}>ES</Link>
                </div>
            </header>
            <main className="p-4">
                <Outlet />
            </main>
        </div>
    );
}
