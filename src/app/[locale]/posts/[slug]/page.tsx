import Link from 'next/link'
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
    <div className="mx-auto flex max-w-[52rem] flex-col items-start gap-6 px-6 py-8">
      <div className="mb-2 flex w-full items-center justify-between">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 text-sm text-[#737377] hover:text-[#A3A3A3] transition-colors"
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
      <header>
        <h1 className="font-instrument-serif text-xl md:text-3xl">{post.title}</h1>
        {post.publishedAt && (
          <time className="text-xs text-[#737377]" dateTime={post.publishedAt}>
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
      </header>
      <div className="font-sans text-[14px] leading-[1.5] text-black">
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
