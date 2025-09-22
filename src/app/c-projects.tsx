import { ArrowUpRight } from 'lucide-react';
import { projects } from './v-projects-list';

export function Projects() {
    return (
        <section className="flex flex-col items-start gap-2 pb-4" aria-labelledby="projects-heading">
            <div className="flex justify-between items-center w-full">
                <h2 id="projects-heading" className="text-sm text-[#A3A3A3] pb-2.5">Projects</h2>
            </div>
            <div className="grid md:grid-cols-3 grid-rows-1 items-start w-full gap-x-24 gap-y-10" role="list" aria-label="Lista de projetos">
                {projects.map((project, index) => (
                    <article key={index} className="flex flex-col gap-1" role="listitem">
                        <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-[#737377] transition-all duration-300 ease-in-out group flex items-center gap-2"
                            aria-label={`Visitar projeto ${project.title}: ${project.description}`}
                        >
                            <h3 className="text-base">{project.title}</h3>
                            <ArrowUpRight className="w-3 h-4.5 text-[#A3A3A3] group-hover:text-[#878787] transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 transform translate-x-[-8px] group-hover:translate-x-0" strokeWidth={1.8} aria-hidden="true" />
                        </a>
                        <p className="text-sm text-[#737377]">
                            {project.description} 
                            {project.status && (
                                <span className="text-xs text-[#A3A3A3] font-normal ml-1 italic">
                                    {project.status}
                                </span>
                            )}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    )
}