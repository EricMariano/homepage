import { projects } from "@/app/v-projects-list";

export function StructuredData() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Eric Mariano",
    "alternateName": "Eric BF Mariano",
    "description": "Software Engineer and Computer Science student at Universidade Tiradentes. Specialized in JavaScript, Python, AI, and full-stack development.",
    "url": "https://ericmariano.dev",
    "image": "https://ericmariano.dev/og-image.jpg",
    "sameAs": [
      "https://github.com/ericmariano",
      "https://www.linkedin.com/in/ericbfmariano/",
      "https://x.com/ericmarianodev"
    ],
    "jobTitle": "Software Engineer",
    "worksFor": {
      "@type": "EducationalOrganization",
      "name": "Universidade Tiradentes"
    },
    "alumniOf": {
      "@type": "EducationalOrganization", 
      "name": "Universidade Tiradentes"
    },
    "knowsAbout": [
      "JavaScript",
      "Python", 
      "Artificial Intelligence",
      "Machine Learning",
      "Full Stack Development",
      "React",
      "Next.js",
      "Computer Science"
    ],
    "email": "ericbfmariano@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BR"
    },
    "nationality": {
      "@type": "Country",
      "name": "Brazil"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Eric Mariano - Software Engineer & Developer",
    "description": "Personal portfolio and projects by Eric Mariano, Software Engineer and Computer Science student.",
    "url": "https://ericmariano.dev",
    "author": {
      "@type": "Person",
      "name": "Eric Mariano"
    },
    "inLanguage": "pt-BR",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://ericmariano.dev/?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const projectsSchema = projects.map((project) => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": project.title,
    "description": project.description,
    "url": project.link,
    "author": {
      "@type": "Person",
      "name": "Eric Mariano"
    },
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Web Browser",
    "programmingLanguage": ["JavaScript", "Python"],
    "dateCreated": "2023", // Ajuste conforme necessário
    "isAccessibleForFree": true,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  }));

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://ericmariano.dev"
      },
      {
        "@type": "ListItem", 
        "position": 2,
        "name": "Projects",
        "item": "https://ericmariano.dev#projects"
      }
    ]
  };

  const allSchemas = [personSchema, websiteSchema, ...projectsSchema, breadcrumbSchema];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(allSchemas)
      }}
    />
  );
}
