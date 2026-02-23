import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export interface PostFrontmatter {
  title: string
  excerpt: string
  publishedAt?: string
}

export interface Post {
  slug: string
  title: string
  excerpt: string
  publishedAt: string | null
  content: string
}

function getSlugFromFilename(filename: string): string {
  return filename.replace(/\.(mdx?|md)$/, '')
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return []
  const files = fs.readdirSync(postsDirectory)
  return files
    .filter((f) => /\.(mdx?|md)$/.test(f))
    .map((f) => getSlugFromFilename(f))
}

export async function getPosts(): Promise<Post[]> {
  const slugs = getAllSlugs()
  const posts: Post[] = []
  for (const slug of slugs) {
    const post = await getPostBySlug(slug)
    if (post) posts.push(post)
  }
  posts.sort((a, b) => {
    const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
    const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
    return dateB - dateA
  })
  return posts
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const extensions = ['.mdx', '.md']
  for (const ext of extensions) {
    const filePath = path.join(postsDirectory, `${slug}${ext}`)
    if (!fs.existsSync(filePath)) continue
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(raw)
    const front = data as PostFrontmatter
    return {
      slug,
      title: front.title ?? slug,
      excerpt: front.excerpt ?? '',
      publishedAt: front.publishedAt ?? null,
      content: content.trim(),
    }
  }
  return null
}
