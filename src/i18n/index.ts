import type { Locale } from "./config";
import { en, type Dictionary } from "./dictionaries/en";
import { pt } from "./dictionaries/pt";

const dictionaries: Record<Locale, Dictionary> = { pt, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Fills `{placeholders}` in a dictionary string. */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/{(\w+)}/g, (match, key) => values[key] ?? match);
}

export type { Dictionary };
