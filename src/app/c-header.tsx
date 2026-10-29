"use client";

import { useState } from "react";
import { LanguageSwitcher } from "./c-language-switcher";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";

interface HeaderProps {
  locale: Locale;
  dict: Dictionary["header"];
}

export function Header({ locale, dict }: HeaderProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <header className="profile-header">
      <div className="profile-topline">
        <h1 className="profile-name">
          <a href="https://github.com/ericmariano" target="_blank" rel="noopener noreferrer">
            {dict.name}
          </a>
        </h1>
        <LanguageSwitcher locale={locale} tooltip={dict.language.tooltip} label={dict.language.label} compact />
      </div>
      <nav aria-label={dict.connectLabel} className="contact-links profile-contact-links">
        <a href="https://github.com/ericmariano" target="_blank" rel="noopener noreferrer" aria-label={dict.github.label}>GitHub</a>
        <a href="https://www.linkedin.com/in/ericbfmariano/" target="_blank" rel="noopener noreferrer" aria-label={dict.linkedin.label}>LinkedIn</a>
        <a href="https://x.com/ericmarianodev" target="_blank" rel="noopener noreferrer" aria-label={dict.x.label}>X</a>
        <a href="mailto:ericbfmariano@gmail.com" aria-label={dict.email.label}>Email</a>
      </nav>
      <section className="biography" aria-labelledby="bio-heading">
        <div className="bio-toolbar">
          <h2 id="bio-heading">{dict.bio.heading}</h2>
          <div className="bio-toggle" role="group" aria-label={dict.bio.lengthLabel}>
            <button type="button" aria-pressed={!expanded} aria-controls="bio-content" onClick={() => setExpanded(false)}>
              {dict.bio.shortLabel}
            </button>
            <button type="button" aria-pressed={expanded} aria-controls="bio-content" onClick={() => setExpanded(true)}>
              {dict.bio.longLabel}
            </button>
          </div>
        </div>
        <div id="bio-content" className="bio-copy">
          <p>{dict.bio.introduction}</p>
          <p>{dict.bio.focus}</p>
          {expanded && <p>{dict.bio.detail}</p>}
        </div>
      </section>
    </header>
  );
}
