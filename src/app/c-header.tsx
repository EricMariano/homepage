"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Github, Mail, Linkedin } from "lucide-react";
import LogoX from "@/assets/logo-x";
import { LanguageSwitcher } from "./c-language-switcher";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";

interface HeaderProps {
    locale: Locale;
    dict: Dictionary["header"];
}

interface SocialCardProps {
    href: string;
    label: string;
    name: string;
    handle: string;
    cta: string;
    ctaIcon: React.ReactNode;
    external?: boolean;
    children: React.ReactNode;
}

function SocialCard({ href, label, name, handle, cta, ctaIcon, external = true, children }: SocialCardProps) {
    const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
    return (
        <div className="group relative">
            <Link href={href} aria-label={label} {...externalProps}>
                {children}
            </Link>
            <div className="pointer-events-none invisible absolute right-0 top-full z-50 hidden translate-y-1 pt-2 opacity-0 transition-all duration-200 ease-out group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 sm:block">
                <a
                    href={href}
                    {...externalProps}
                    className="flex w-56 flex-col gap-2.5 rounded-xl border border-[#DAD4C0] bg-[#F2EEE0] p-4 shadow-sm"
                >
                    <Image
                        src="/goosefella.png"
                        alt=""
                        width={44}
                        height={40}
                        className="mix-blend-darken"
                    />
                    <div>
                        <p className="font-instrument-serif text-lg leading-tight">{name}</p>
                        <p className="text-xs text-[#7A7568] break-all">{handle}</p>
                    </div>
                    <span className="mt-0.5 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#1B475E] px-3 py-1 text-xs text-[#F2EEE0]">
                        {ctaIcon}
                        {cta}
                    </span>
                </a>
            </div>
        </div>
    );
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
                    <SocialCard
                        href="https://github.com/ericmariano"
                        label={dict.github.label}
                        name={dict.name}
                        handle="github.com/ericmariano"
                        cta={dict.github.tooltip}
                        ctaIcon={<Github className="h-3 w-3" strokeWidth={2} />}
                    >
                        <Github className="w-4.5 h-4.5 mt-1 text-[#8A8578] group-hover:text-[#1B475E] transition-colors duration-200" strokeWidth={1.8} />
                    </SocialCard>

                    <SocialCard
                        href="https://www.linkedin.com/in/ericbfmariano/"
                        label={dict.linkedin.label}
                        name={dict.name}
                        handle="in/ericbfmariano"
                        cta={dict.linkedin.tooltip}
                        ctaIcon={<Linkedin className="h-3 w-3" strokeWidth={2} />}
                    >
                        <Linkedin className="w-4.5 h-5 mt-1 text-[#8A8578] group-hover:text-[#1B475E] transition-colors duration-200" strokeWidth={1.6} />
                    </SocialCard>

                    <SocialCard
                        href="https://x.com/ericmarianodev"
                        label={dict.x.label}
                        name={dict.name}
                        handle="@ericmarianodev"
                        cta={dict.x.tooltip}
                        ctaIcon={<LogoX className="h-3 w-3" pathClassName="fill-[#F2EEE0]" />}
                    >
                        <LogoX pathClassName="fill-[#8A8578] group-hover:fill-[#1B475E] transition-colors duration-200" />
                    </SocialCard>

                    <SocialCard
                        href="mailto:ericbfmariano@gmail.com"
                        label={dict.email.label}
                        name={dict.name}
                        handle="ericbfmariano@gmail.com"
                        cta={dict.email.tooltip}
                        ctaIcon={<Mail className="h-3 w-3" strokeWidth={2} />}
                        external={false}
                    >
                        <Mail className="w-4.5 h-4.5 mt-1 text-[#8A8578] group-hover:text-[#1B475E] transition-colors duration-200" strokeWidth={1.8} />
                    </SocialCard>

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
