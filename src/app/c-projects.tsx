import { projects } from './v-projects-list';

export function Projects() {
    return (
        <section className="flex flex-col items-start gap-2 pb-4">
            <div className="flex justify-between items-center w-full">
                <h2 className="text-sm text-[#A3A3A3] pb-2.5">Projects</h2>
            </div>
            <div className="grid md:grid-cols-3 grid-rows-1 items-start w-full gap-x-24 gap-y-10">
                {projects.map((project, index) => (
                    <div key={index} className="flex flex-col gap-1">
                        <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-[#737377] transition-colors duration-200"
                        >
                            {project.title}
                        </a>
                        <p className="text-sm text-[#A3A3A3]">{project.description}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}