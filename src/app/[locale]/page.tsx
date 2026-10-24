import { notFound } from "next/navigation";
import { Header } from "../c-header";
import { Projects } from "../c-projects";
import { Blog } from "../c-blog";
import { Footer } from "../c-footer";
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
      <div className="home-shell">
        <Header locale={locale} dict={dict.header} />
        <main
          id="main-content"
          className="home-main"
          aria-label={dict.a11y.mainContent}
        >
          <section id="projects" className="home-section home-reveal" aria-labelledby="projects-heading">
            <Projects locale={locale} dict={dict.projects} />
          </section>
          <section id="blog" className="home-section home-reveal" aria-labelledby="blog-heading">
            <Blog locale={locale} dict={dict.blog} posts={posts} />
          </section>
        </main>
        <Footer dict={dict.footer} />
      </div>
    </div>
  );
}
