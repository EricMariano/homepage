import { projects } from "./v-projects-list";
import { fill, type Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";

interface ProjectsProps {
  locale: Locale;
  dict: Dictionary["projects"];
}

export function Projects({ locale, dict }: ProjectsProps) {
  return (
    <>
      <h2 id="projects-heading" className="section-title">{dict.heading}</h2>
      <ul className="project-list" aria-label={dict.listLabel}>
        {projects.map((project) => (
          <li key={project.title}>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              title={project.description[locale]}
              aria-label={fill(dict.itemLabel, { title: project.title, description: project.description[locale] })}
            >
              {project.title}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
