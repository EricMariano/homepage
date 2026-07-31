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
    <div
      className="flex h-full min-h-screen w-full flex-col items-center"
      suppressHydrationWarning
    >
      <div className="flex h-full min-h-screen w-full max-w-[43rem] flex-col px-6">
        <div className="flex items-center justify-between pt-16 sm:pb-4 sm:pt-20">
          <Header locale={locale} dict={dict.header} />
        </div>
        <main
          id="main-content"
          className="flex flex-col gap-[24px] row-start-2 items-start"
          role="main"
          aria-label={dict.a11y.mainContent}
        >
          <section id="projects" aria-labelledby="projects-heading">
            <Projects locale={locale} dict={dict.projects} />
          </section>
          <section id="blog" aria-labelledby="blog-heading">
            <Blog locale={locale} dict={dict.blog} posts={posts} />
          </section>
        </main>
        <Footer dict={dict.footer} />
      </div>
    </div>
  );
}
