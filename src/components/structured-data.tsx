import { projects } from "@/app/v-projects-list";
import { getDictionary } from "@/i18n";
import { htmlLang, type Locale } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";

interface StructuredDataProps {
  locale: Locale;
}

export function StructuredData({ locale }: StructuredDataProps) {
  const dict = getDictionary(locale);
  const localeUrl = `${SITE_URL}/${locale}`;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Eric Mariano",
    "alternateName": "Eric BF Mariano",
    "description": dict.metadata.shortDescription,
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
    "name": dict.metadata.title,
    "description": dict.metadata.description,
    "url": localeUrl,
    "author": {
      "@type": "Person",
      "name": "Eric Mariano"
    },
    "inLanguage": htmlLang[locale],
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${localeUrl}?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const projectsSchema = projects.map((project) => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": project.title,
    "description": project.description[locale],
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
        "item": localeUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": dict.projects.heading,
        "item": `${localeUrl}#projects`
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
