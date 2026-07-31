import { defaultLocale, htmlLang, locales } from "@/i18n/config";

export const SITE_URL = "https://www.ericmariano.com.br";

/** hreflang map for `metadata.alternates.languages`. */
export function languageAlternates(pathname = ""): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const locale of locales) {
    alternates[htmlLang[locale]] = `${SITE_URL}/${locale}${pathname}`;
  }
  alternates["x-default"] = `${SITE_URL}/${defaultLocale}${pathname}`;
  return alternates;
}
