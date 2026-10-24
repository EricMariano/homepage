import type { Dictionary } from "@/i18n";

interface FooterProps {
  dict: Dictionary["footer"];
}

export function Footer({ dict }: FooterProps) {
  return (
    <footer className="home-footer">
      <nav aria-label={dict.connectLabel} className="contact-links">
        <a href="https://github.com/ericmariano" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/ericbfmariano/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://x.com/ericmarianodev" target="_blank" rel="noopener noreferrer">X</a>
        <a href="mailto:ericbfmariano@gmail.com">Email</a>
      </nav>
      <p>{dict.text}</p>
    </footer>
  );
}
