import type { Dictionary } from "@/i18n";

interface FooterProps {
  dict: Dictionary["footer"];
}

export function Footer({ dict }: FooterProps) {
  return (
    <footer className="home-footer">
      <p>{dict.text}</p>
    </footer>
  );
}
