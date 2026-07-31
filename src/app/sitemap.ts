import { MetadataRoute } from 'next'
import { locales } from '@/i18n/config'
import { getPosts } from '@/lib/posts'
import { SITE_URL, languageAlternates } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()

  const homePages: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 1,
    alternates: { languages: languageAlternates() },
  }))

  const blogPages: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${SITE_URL}/${locale}/blog`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
    alternates: { languages: languageAlternates('/blog') },
  }))

  const postPages: MetadataRoute.Sitemap = (
    await Promise.all(
      locales.map(async (locale) => {
        const posts = await getPosts(locale)
        return posts.map((post) => ({
          url: `${SITE_URL}/${locale}/posts/${post.slug}`,
          lastModified: post.publishedAt ? new Date(post.publishedAt) : lastModified,
          changeFrequency: 'monthly' as const,
          priority: 0.7,
          alternates: { languages: languageAlternates(`/posts/${post.slug}`) },
        }))
      })
    )
  ).flat()

  return [...homePages, ...blogPages, ...postPages]
}
