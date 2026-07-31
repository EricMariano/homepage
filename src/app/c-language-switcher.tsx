"use client";

import { Link } from "next-view-transitions";
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

export function LanguageSwitcher({ locale, tooltip, label }: LanguageSwitcherProps) {
    const pathname = usePathname();
    const target = otherLocale(locale);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href={localizedPath(pathname, target)}
                        aria-label={label}
                        hrefLang={target}
                        lang={target}
                    >
                        <Languages className="w-4.5 h-4.5 mt-1 text-[#8A8578] hover:text-[#1B475E] transition-colors duration-200" strokeWidth={1.8} />
                    </Link>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
