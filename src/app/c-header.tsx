"use client";

import { useEffect, useState } from "react";
import { ProfilePhoto } from "@/components/profile-photo";
import Link from "next/link";
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
        <div className="social-item group">
            <Link className="social-button" href={href} aria-label={label} {...externalProps}>
                {children}
            </Link>
            <div className="social-preview">
                <a
                    href={href}
                    {...externalProps}
                    className="social-preview-card"
                    tabIndex={-1}
                    aria-label={label}
                >
                    <ProfilePhoto
                        alt=""
                        size={44}
                    />
                    <div>
                        <p className="font-instrument-serif text-lg leading-tight">{name}</p>
                        <p className="text-xs text-[var(--site-muted)] break-all">{handle}</p>
                    </div>
                    <span className="mt-0.5 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#233A48] px-3 py-1 text-xs text-[#F0F5F9]">
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
        const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
        let interval: ReturnType<typeof setInterval> | undefined;
        let swap: ReturnType<typeof setTimeout> | undefined;

        function updateMotion() {
            clearInterval(interval);
            clearTimeout(swap);
            setVisible(true);
            if (preference.matches || roles.length < 2) return;

            interval = setInterval(() => {
                setVisible(false);
                swap = setTimeout(() => {
                    setIndex((i) => (i + 1) % roles.length);
                    setVisible(true);
                }, 350);
            }, 3600);
        }

        updateMotion();
        preference.addEventListener("change", updateMotion);
        return () => {
            clearInterval(interval);
            clearTimeout(swap);
            preference.removeEventListener("change", updateMotion);
        };
    }, [roles.length]);

    return (
        <p className="profile-role">
            <span className="sr-only">{roles.join(" · ")}</span>
            <span aria-hidden="true" className={`role-label ${visible ? "" : "role-label-changing"}`}>
                {roles[index]}
            </span>
        </p>
    );
}

export function Header({ locale, dict }: HeaderProps) {
    return (
        <header className="profile-header">
            <div className="profile-mark">
                <ProfilePhoto
                    alt={dict.photoAlt}
                    size={88}
                    priority
                />
            </div>
            <div className="profile-heading home-reveal">
                <div>
                    <h1 className="profile-name font-instrument-serif">{dict.name}</h1>
                    <RoleMorph roles={dict.roles} />
                </div>
                <div className="social-dock">
                    <SocialCard
                        href="https://github.com/ericmariano"
                        label={dict.github.label}
                        name={dict.name}
                        handle="github.com/ericmariano"
                        cta={dict.github.tooltip}
                        ctaIcon={<Github className="h-3 w-3" strokeWidth={2} />}
                    >
                        <Github className="size-[17px]" strokeWidth={1.6} />
                    </SocialCard>

                    <SocialCard
                        href="https://www.linkedin.com/in/ericbfmariano/"
                        label={dict.linkedin.label}
                        name={dict.name}
                        handle="in/ericbfmariano"
                        cta={dict.linkedin.tooltip}
                        ctaIcon={<Linkedin className="h-3 w-3" strokeWidth={2} />}
                    >
                        <Linkedin className="size-[17px]" strokeWidth={1.6} />
                    </SocialCard>

                    <SocialCard
                        href="https://x.com/ericmarianodev"
                        label={dict.x.label}
                        name={dict.name}
                        handle="@ericmarianodev"
                        cta={dict.x.tooltip}
                        ctaIcon={<LogoX className="h-3 w-3" pathClassName="fill-[#F0F5F9]" />}
                    >
                        <LogoX className="size-3.5" pathClassName="fill-current" />
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
                        <Mail className="size-[17px]" strokeWidth={1.6} />
                    </SocialCard>

                    <span className="dock-divider" aria-hidden="true" />
                    <LanguageSwitcher
                        locale={locale}
                        tooltip={dict.language.tooltip}
                        label={dict.language.label}
                    />
                </div>
            </div>
            <div className="profile-rule home-reveal" aria-hidden="true" />
            <p className="profile-bio home-reveal">
                {dict.bio.lead}
                <span className="bio-emphasis">{dict.bio.tail}</span>
            </p>
        </header>
    )
}
