import { Separator } from "@/components/ui/separator";

export function Header() {
    return (
        <header className="flex flex-col items-start gap-2">
            <h1 className="font-instrument-serif md:text-3xl text-2xl">Eric Mariano - Software Engineer</h1>
            <Separator />
            <p className="text-sm md:text-base text-[#A3A3A3]">Currently a computer science student at Universidade Tiradentes, focused on the javascript ecosystem.</p>
        </header>
    )
}