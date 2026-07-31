import type { Dictionary } from "@/i18n";

interface FooterProps {
    dict: Dictionary["footer"];
}

export function Footer({ dict }: FooterProps) {
    return (
        <footer className="flex justify-center items-center">
            <p className="text-sm md:text-base text-[#8A8578] italic">{dict.text}</p>
        </footer>
    )
}
