"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { isLocale, otherLocale, type Locale } from "@/i18n/config";

interface LanguageSwitcherProps {
    locale: Locale;
    tooltip: string;
    label: string;
}

/** Swaps the leading locale segment of the current path, keeping the reader in place. */
function localizedPath(pathname: string, target: Locale) {
    const segments = pathname.split("/");
    if (isLocale(segments[1])) {
        segments[1] = target;
        return segments.join("/");
    }
    return `/${target}${pathname === "/" ? "" : pathname}`;
}

// Locale changes remount the transition provider, so use a regular Next link.
export function LanguageSwitcher({ locale, tooltip, label }: LanguageSwitcherProps) {
    const pathname = usePathname();
    const target = otherLocale(locale);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href={localizedPath(pathname, target)}
                        prefetch={true}
                        scroll={false}
                        aria-label={label}
                        hrefLang={target}
                        lang={target}
                        className="social-button language-button"
                    >
                        <Languages className="size-[17px]" strokeWidth={1.6} />
                    </Link>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
