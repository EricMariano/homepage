import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { defaultLocale, isLocale, locales, type Locale } from '@/i18n/config'

const postsDirectory = path.join(process.cwd(), 'content/posts')

const extensions = ['.mdx', '.md']

export interface PostFrontmatter {
  title: string
  excerpt: string
  /** YAML turns an unquoted `2025-02-23` into a Date, a quoted one into a string. */
  publishedAt?: string | Date
}

export interface Post {
  slug: string
  title: string
  excerpt: string
  publishedAt: string | null
  content: string
}

/**
 * Strips the extension and an optional locale suffix, so that
 * `post.en.md` and `post.md` both resolve to the slug `post`.
 */
function getSlugFromFilename(filename: string): string {
  const withoutExtension = filename.replace(/\.(mdx?|md)$/, '')
  const localeSuffix = withoutExtension.match(/\.(\w+)$/)?.[1]
  return localeSuffix && isLocale(localeSuffix)
    ? withoutExtension.slice(0, -(localeSuffix.length + 1))
    : withoutExtension
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return []
  const files = fs.readdirSync(postsDirectory)
  const slugs = files
    .filter((f) => /\.(mdx?|md)$/.test(f))
    .map((f) => getSlugFromFilename(f))
  return [...new Set(slugs)]
}

/** Normalises the frontmatter date to a plain `YYYY-MM-DD`, whatever YAML gave us. */
function normalizePublishedAt(value: PostFrontmatter['publishedAt']): string | null {
  if (!value) return null
  return value instanceof Date ? value.toISOString().slice(0, 10) : value
}

/**
 * Files are looked up as `<slug>.<locale>.md`, then the default locale, then
 * the bare `<slug>.md` — so an untranslated post still shows up in both locales.
 */
function resolvePostPath(slug: string, locale: Locale): string | null {
  const basenames = [`${slug}.${locale}`, `${slug}.${defaultLocale}`, slug]
  for (const basename of basenames) {
    for (const ext of extensions) {
      const filePath = path.join(postsDirectory, `${basename}${ext}`)
      if (fs.existsSync(filePath)) return filePath
    }
  }
  return null
}

export async function getPosts(locale: Locale = defaultLocale): Promise<Post[]> {
  const slugs = getAllSlugs()
  const posts: Post[] = []
  for (const slug of slugs) {
    const post = await getPostBySlug(slug, locale)
    if (post) posts.push(post)
  }
  posts.sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
    return dateB - dateA
  })
  return posts
}

export async function getPostBySlug(slug: string, locale: Locale = defaultLocale): Promise<Post | null> {
  const filePath = resolvePostPath(slug, locale)
  if (!filePath) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const front = data as PostFrontmatter
  return {
    slug,
    title: front.title ?? slug,
    excerpt: front.excerpt ?? '',
    publishedAt: normalizePublishedAt(front.publishedAt),
    content: content.trim(),
  }
}

/** Every `{ locale, slug }` pair, for `generateStaticParams`. */
export function getAllPostParams(): { locale: Locale; slug: string }[] {
  return locales.flatMap((locale) => getAllSlugs().map((slug) => ({ locale, slug })))
}
