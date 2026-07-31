export const locales = ["pt", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const htmlLang: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en-US",
};

export const openGraphLocale: Record<Locale, string> = {
  pt: "pt_BR",
  en: "en_US",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function otherLocale(locale: Locale): Locale {
  return locale === "pt" ? "en" : "pt";
}
