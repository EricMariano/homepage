"use client";

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

export function Header({ locale, dict }: HeaderProps) {
    return (
        <header className="flex flex-col items-start gap-2 pb-4">
            <div className="flex justify-between items-center w-full">
                <h1 className="font-instrument-serif md:text-3xl text-xl">{dict.title}</h1>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher
                        locale={locale}
                        tooltip={dict.language.tooltip}
                        label={dict.language.label}
                    />

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link
                                    href="https://github.com/ericmariano"
                                    target="_blank"
                                    aria-label={dict.github.label}
                                    rel="noopener noreferrer"
                                >
                                    <Github className="w-4.5 h-4.5 mt-1 text-[#A3A3A3] hover:text-[#878787] transition-colors duration-200" strokeWidth={1.8} />
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
                                    <Linkedin className="w-4.5 h-5 mt-1 text-[#A3A3A3] hover:text-[#878787] transition-colors duration-200" strokeWidth={1.6} />
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
                                    <Mail className="w-4.5 h-4.5 mt-1 text-[#A3A3A3] hover:text-[#878787] transition-colors duration-200" strokeWidth={1.8} />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{dict.email.tooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
            <Separator />
            <p className="text-[12px] md:text-base text-[#A3A3A3]">
                {dict.bio.lead}
                <span className="text-[12px]">{dict.bio.highlight}</span>
                {dict.bio.tail}
            </p>
            <p className="text-[12px] md:text-base text-[#A3A3A3]">Currently a software engineer, computer science student and researcher at INCT SimAI (Vhlab), focused on the javascript and python<span className="text-[12px]">(AI)</span> ecosystems, RAG techniques, AI and.</p>
        </header>
    )
}
