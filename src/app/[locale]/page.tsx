import { notFound } from "next/navigation";
import { Header } from "../c-header";
import { Projects } from "../c-projects";
import { Blog } from "../c-blog";
import { Footer } from "../c-footer";
import { Artwork } from "../c-artwork";
import { getPosts } from "@/lib/posts";
import { getDictionary } from "@/i18n";
import { isLocale } from "@/i18n/config";

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const posts = await getPosts(locale);

  return (
    <div className="home-page">
      <main
        id="main-content"
        className="home-shell"
        aria-label={dict.a11y.mainContent}
      >
        <Header locale={locale} dict={dict.header} />
        <section id="projects" className="home-section" aria-labelledby="projects-heading">
          <Projects locale={locale} dict={dict.projects} />
        </section>
        <section id="blog" className="home-section" aria-labelledby="blog-heading">
          <Blog locale={locale} dict={dict.blog} posts={posts} />
        </section>
        <Artwork dict={dict.artwork} locale={locale} />
        <Footer dict={dict.footer} />
      </main>
    </div>
  );
}
