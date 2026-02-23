import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { StructuredData } from "@/components/structured-data";
import { Analytics } from "@vercel/analytics/react";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: ["400"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ericmariano-homepage.vercel.app/'),
  title: {
    default: "Eric Mariano - Software Engineer & Developer",
    template: "%s | Eric Mariano"
  },
  description: "Software Engineer and Computer Science student at Universidade Tiradentes. Specialized in JavaScript, Python, AI, and full-stack development. Explore my projects and connect with me.",
  keywords: [
    "Eric Mariano",
    "Software Engineer", 
    "Developer",
    "JavaScript",
    "Python",
    "AI",
    "Machine Learning",
    "Full Stack",
    "React",
    "Next.js",
    "Computer Science",
    "Universidade Tiradentes",
    "Portfolio",
    "Projects",
    "Web Development"
  ],
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
    locale: "pt_BR",
    url: "https://ericmariano-homepage.vercel.app/",
    siteName: "Eric Mariano",
    title: "Eric Mariano - Software Engineer & Developer",
    description: "Software Engineer and Computer Science student at Universidade Tiradentes. Specialized in JavaScript, Python, AI, and full-stack development.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Eric Mariano - Software Engineer & Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eric Mariano - Software Engineer & Developer",
    description: "Software Engineer and Computer Science student at Universidade Tiradentes. Specialized in JavaScript, Python, AI, and full-stack development.",
    creator: "@ericmarianodev",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "your-google-verification-code", // Substitua pelo seu código do Google Search Console
  },
  alternates: {
    canonical: "https://ericmariano-homepage.vercel.app/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <StructuredData />
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
