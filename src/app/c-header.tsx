"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Github, Mail, Linkedin } from "lucide-react";
import LogoX from "@/assets/logo-x";
import { LanguageSwitcher } from "./c-language-switcher";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";

interface HeaderProps {
    locale: Locale;
    dict: Dictionary["header"];
}

function RoleMorph({ roles }: { roles: readonly string[] }) {
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(false);
            const swap = setTimeout(() => {
                setIndex((i) => (i + 1) % roles.length);
                setVisible(true);
            }, 400);
            return () => clearTimeout(swap);
        }, 3200);
        return () => clearInterval(interval);
    }, [roles.length]);

    return (
        <p
            className={`text-sm text-[#7A7568] transition-all duration-[400ms] ease-in-out motion-reduce:transition-none ${
                visible ? "opacity-100 blur-0 translate-y-0" : "opacity-0 blur-[6px] translate-y-0.5"
            }`}
        >
            {roles[index]}
        </p>
    );
}

export function Header({ locale, dict }: HeaderProps) {
    return (
        <header className="flex flex-col items-start gap-2 pb-4">
            <Image
                src="/goosefella.png"
                alt={dict.duckAlt}
                width={96}
                height={87}
                priority
                className="mb-1 -ml-[18px] mix-blend-darken transition-transform duration-300 ease-out hover:-rotate-6 [view-transition-name:goose]"
            />
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="font-instrument-serif text-3xl md:text-4xl">{dict.name}</h1>
                    <RoleMorph roles={dict.roles} />
                </div>
                <div className="flex items-center gap-2 sm:pb-1.5">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="https://github.com/ericmariano"
                                    target="_blank"
                                    aria-label={dict.github.label}
                                    rel="noopener noreferrer"
                                >
                                    <Github className="w-4.5 h-4.5 mt-1 text-[#8A8578] hover:text-[#1B475E] transition-colors duration-200" strokeWidth={1.8} />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{dict.github.tooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="https://www.linkedin.com/in/ericbfmariano/"
                                    target="_blank"
                                    aria-label={dict.linkedin.label}
                                    rel="noopener noreferrer"
                                >
                                    <Linkedin className="w-4.5 h-5 mt-1 text-[#8A8578] hover:text-[#1B475E] transition-colors duration-200" strokeWidth={1.6} />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{dict.linkedin.tooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="https://x.com/ericmarianodev"
                                    target="_blank"
                                    aria-label={dict.x.label}
                                    rel="noopener noreferrer"
                                >
                                    <LogoX />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{dict.x.tooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="mailto:ericbfmariano@gmail.com"
                                    aria-label={dict.email.label}
                                >
                                    <Mail className="w-4.5 h-4.5 mt-1 text-[#8A8578] hover:text-[#1B475E] transition-colors duration-200" strokeWidth={1.8} />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{dict.email.tooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <LanguageSwitcher
                        locale={locale}
                        tooltip={dict.language.tooltip}
                        label={dict.language.label}
                    />
                </div>
            </div>
            <Separator className="bg-[#DAD4C0]" />
            <p className="text-sm md:text-base text-[#66625A]">
                {dict.bio.lead}
                {dict.bio.tail}
            </p>
        </header>
    )
}
