import Image from 'next/image'
import { Link } from 'next-view-transitions'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getPostBySlug, getAllPostParams } from '@/lib/posts'
import { LanguageSwitcher } from '@/app/c-language-switcher'
import { getDictionary } from '@/i18n'
import { htmlLang, isLocale } from '@/i18n/config'
import { languageAlternates } from '@/lib/site'

interface PostPageProps {
  params: Promise<{
    locale: string
    slug: string
  }>
}

export function generateStaticParams() {
  return getAllPostParams()
}

export default async function PostPage({ params }: PostPageProps) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const dict = getDictionary(locale)
  const post = await getPostBySlug(slug, locale)

  if (!post) {
    notFound()
  }

  const paragraphs = post.content
    ? post.content.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
    : []

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
        <div className="flex flex-col gap-1">
          <h1 className="font-instrument-serif text-2xl md:text-4xl">{post.title}</h1>
          {post.publishedAt && (
            <time className="text-xs text-[#7A7568]" dateTime={post.publishedAt}>
              {/* Frontmatter dates are date-only, so they parse as UTC midnight —
                  format in UTC too, or timezones behind it render the day before. */}
              {new Date(post.publishedAt).toLocaleDateString(htmlLang[locale], {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC',
              })}
            </time>
          )}
        </div>
      </header>
      <div className="flex flex-col gap-4 font-sans text-[15px] leading-[1.7] text-[#33312A]">
        {paragraphs.map((para, i) => (
          <p key={i} className="whitespace-pre-line">
            {para}
          </p>
        ))}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PostPageProps) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const dict = getDictionary(locale)
  const post = await getPostBySlug(slug, locale)
  if (!post) return { title: dict.post.notFound }

  return {
    title: post.title,
    description: post.excerpt || post.title,
    alternates: {
      languages: languageAlternates(`/posts/${slug}`),
    },
  }
}
