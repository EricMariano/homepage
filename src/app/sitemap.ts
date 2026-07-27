import { MetadataRoute } from 'next'
import { locales } from '@/i18n/config'
import { getAllSlugs } from '@/lib/posts'
import { SITE_URL, languageAlternates } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const homePages: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 1,
    alternates: { languages: languageAlternates() },
  }))

  const postPages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    getAllSlugs().map((slug) => ({
      url: `${SITE_URL}/${locale}/posts/${slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: { languages: languageAlternates(`/posts/${slug}`) },
    }))
  )

  return [...homePages, ...postPages]
}
