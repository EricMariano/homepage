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
          {expanded ? (
            <>
              {dict.bio.long.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <ul className="bio-highlights">
                {dict.bio.long.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
              </ul>
              {dict.bio.long.outro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <div className="bio-stack">
                <h3>{dict.bio.long.stackHeading}</h3>
                <dl>
                  {dict.bio.long.stack.map(({ label, items }) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{items}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </>
          ) : (
            dict.bio.short.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
          )}
        </div>
      </section>
    </header>
  );
}
