import { ArrowUpRight } from 'lucide-react';
import { projects } from './v-projects-list';
import { fill, type Dictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';

interface ProjectsProps {
    locale: Locale;
    dict: Dictionary['projects'];
}

export function Projects({ locale, dict }: ProjectsProps) {
    return (
        <section className="flex flex-col items-start gap-2 pb-4" aria-labelledby="projects-heading">
            <div className="flex justify-between items-center w-full">
                <h2 id="projects-heading" className="text-sm text-[#7A7568] pb-2.5">{dict.heading}</h2>
            </div>
            <div className="grid md:grid-cols-2 grid-rows-1 items-start w-full gap-x-16 gap-y-8" role="list" aria-label={dict.listLabel}>
                {projects.map((project, index) => (
                    <article key={index} className="flex flex-col gap-1" role="listitem">
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#1B475E] transition-all duration-300 ease-in-out group flex items-center gap-2"
                            aria-label={fill(dict.itemLabel, { title: project.title, description: project.description[locale] })}
                        >
                            <h3 className="text-base">{project.title}</h3>
                            <ArrowUpRight className="w-3 h-4.5 text-[#8A8578] group-hover:text-[#1B475E] transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 transform translate-x-[-8px] group-hover:translate-x-0" strokeWidth={1.8} aria-hidden="true" />
                        </a>
                        <p className="text-sm text-[#66625A]">
                            {project.description[locale]}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    )
}
