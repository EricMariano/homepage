import Image from 'next/image'
import { Link } from 'next-view-transitions'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getPosts } from '@/lib/posts'
import { LanguageSwitcher } from '@/app/c-language-switcher'
import { getDictionary } from '@/i18n'
import { htmlLang, isLocale, locales } from '@/i18n/config'
import { SITE_URL, languageAlternates } from '@/lib/site'

interface BlogPageProps {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dict = getDictionary(locale)
  const posts = await getPosts(locale)

  return (
    <div className="mx-auto flex w-full max-w-[40rem] flex-col items-start gap-6 px-6 py-12 md:py-16">
      <div className="mb-2 flex w-full items-center justify-between">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-sm text-[#66625A] hover:text-[#1B475E] transition-colors"
          aria-label={dict.post.backLabel}
        >
          <ArrowLeft className="h-4 w-4" />
          {dict.post.back}
        </Link>
        <LanguageSwitcher
          locale={locale}
          tooltip={dict.header.language.tooltip}
          label={dict.header.language.label}
        />
      </div>
      <header className="flex flex-col gap-3">
        <Link href={`/${locale}`} aria-hidden tabIndex={-1}>
          <Image
            src="/goosefella.png"
            alt=""
            width={56}
            height={51}
            className="-ml-[11px] mix-blend-darken transition-transform duration-300 ease-out hover:-rotate-6 [view-transition-name:goose]"
          />
        </Link>
        <h1 className="font-instrument-serif text-2xl md:text-4xl">{dict.blog.heading}</h1>
      </header>
      <div className="flex w-full flex-col gap-8" role="list" aria-label={dict.blog.listLabel}>
        {posts.map((post) => (
          <article key={post.slug} className="flex flex-col gap-1" role="listitem">
            <Link
              href={`/${locale}/posts/${post.slug}`}
              className="w-fit hover:text-[#1B475E] transition-colors duration-300"
            >
              <h2 className="text-base">{post.title}</h2>
            </Link>
            <p className="text-sm text-[#7A7568]">{post.excerpt}</p>
            {post.publishedAt && (
              <time className="text-xs text-[#8A8578]" dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString(htmlLang[locale], {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  timeZone: 'UTC',
                })}
              </time>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: BlogPageProps) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const dict = getDictionary(locale)
  const url = `${SITE_URL}/${locale}/blog`

  return {
    title: dict.blog.heading,
    alternates: {
      canonical: url,
      languages: languageAlternates('/blog'),
    },
  }
}
