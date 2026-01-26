import { useLocation } from "react-router";
import type { Locale } from "~/lib/i18n";

export function useLocaleHref() {
    const { pathname, search, hash } = useLocation();

    return (target: Locale) => {
        const hasLeadingLocale = /^\/[^/]+(?=\/|$)/.test(pathname);
        const rest = hasLeadingLocale ? pathname.replace(/^\/[^/]+/, "") : pathname;
        return `/${target}${rest}${search}${hash}`;
    };
}
