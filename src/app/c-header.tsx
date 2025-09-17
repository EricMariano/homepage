"use client";

import Link from "next/link"; 
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Github, Mail, ArrowUpRight } from "lucide-react";
import LogoX from "@/assets/logo-x";

export function Header() {
    return (
        <section className="flex flex-col items-start gap-2 pb-4">
            <div className="flex justify-between items-center w-full">
                <h1 className="font-instrument-serif md:text-3xl text-xl">Eric Mariano - Software Engineer</h1>
                <div className="flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="https://github.com/ericmariano" target="_blank">
                                    <Github className="w-4.5 h-4.5 mt-1 text-[#A3A3A3] hover:text-[#878787] transition-colors duration-200" strokeWidth={1.8} />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Star me on GitHub</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="https://x.com/ericmarianodev" target="_blank">
                                    <LogoX />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Follow me on X</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="mailto:ericbfmariano@gmail.com">
                                    <Mail className="w-4.5 h-4.5 mt-1 text-[#A3A3A3] hover:text-[#878787] transition-colors duration-200" strokeWidth={1.8} />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Send me an email</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>    
            </div>
            <Separator />
            <p className="text-[12px] md:text-base text-[#A3A3A3]">Currently a computer science student and researcher at Universidade Tiradentes, focused on the javascript ecosystem.</p>
        </section>
    )
}