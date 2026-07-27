import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, Instrument_Serif } from "next/font/google";
import "../globals.css";
import { StructuredData } from "@/components/structured-data";
import { Analytics } from "@vercel/analytics/react";
import { getDictionary } from "@/i18n";
import { htmlLang, isLocale, locales, openGraphLocale } from "@/i18n/config";
import { SITE_URL, languageAlternates } from "@/lib/site";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: ["400"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.metadata.title,
      template: dict.metadata.titleTemplate,
    },
    description: dict.metadata.description,
    keywords: dict.metadata.keywords,
    authors: [{ name: "Eric Mariano", url: "https://github.com/ericmariano" }],
    creator: "Eric Mariano",
    publisher: "Eric Mariano",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: openGraphLocale[locale],
      url: `${SITE_URL}/${locale}`,
      siteName: "Eric Mariano",
      title: dict.metadata.title,
      description: dict.metadata.shortDescription,
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: dict.metadata.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.metadata.title,
      description: dict.metadata.shortDescription,
      creator: "@ericmarianodev",
      images: ["/og-image.jpg"],
    },
    verification: {
      google: "your-google-verification-code", // Substitua pelo seu código do Google Search Console
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: languageAlternates(),
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={htmlLang[locale]}>
      <head>
        <StructuredData locale={locale} />
      </head>
      <body
        className={`${inter.variable} ${instrumentSerif.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
