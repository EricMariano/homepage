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
    "url": SITE_URL,
    "image": `${SITE_URL}/og-image.jpg`,
    "sameAs": [
      "https://github.com/ericmariano",
      "https://www.linkedin.com/in/ericbfmariano/",
      "https://x.com/ericmarianodev"
    ],
    "jobTitle": "Software Engineer",
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
    "inLanguage": htmlLang[locale]
  };

  const allSchemas = [personSchema, websiteSchema];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(allSchemas)
      }}
    />
  );
}
