import { ArrowUpRight } from 'lucide-react';
import { projects } from './v-projects-list';
import { fill, type Dictionary } from '@/i18n';
import type { Locale } from '@/i18n/config';
import type { CSSProperties } from 'react';

interface ProjectsProps {
    locale: Locale;
    dict: Dictionary['projects'];
}

export function Projects({ locale, dict }: ProjectsProps) {
    return (
        <div className="section-content">
            <div className="section-heading">
                <h2 id="projects-heading">{dict.heading}</h2>
                <span className="section-line" aria-hidden="true" />
                <span className="section-count" aria-hidden="true">{String(projects.length).padStart(2, '0')}</span>
            </div>
            <div className="project-grid" role="list" aria-label={dict.listLabel}>
                {projects.map((project, index) => (
                    <article key={project.title} className="project-item home-reveal" style={{ '--item-delay': `${index * 65}ms` } as CSSProperties} role="listitem">
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-card"
                            aria-label={fill(dict.itemLabel, { title: project.title, description: project.description[locale] })}
                        >
                            <div className="project-title-row">
                                <h3>{project.title}</h3>
                                <span className="card-arrow"><ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" /></span>
                            </div>
                            <p>{project.description[locale]}</p>
                        </a>
                    </article>
                ))}
            </div>
        </div>
    )
}
