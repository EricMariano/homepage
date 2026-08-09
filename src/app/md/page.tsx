import { getPostFile, getPostFiles } from '@/lib/posts'
import { Composer, type EditablePost } from './c-composer'

/**
 * The editor never touches the filesystem at runtime — it hands you a `.md`
 * download — so the existing posts are read once at build time and shipped with
 * the page. That keeps the route fully static and safe to deploy.
 */
export default function MarkdownEditorPage() {
  const posts: EditablePost[] = getPostFiles().map((file) => {
    const post = getPostFile(file.slug, file.suffix)
    return {
      filename: file.filename,
      slug: file.slug,
      suffix: file.suffix,
      title: post?.title ?? '',
      excerpt: post?.excerpt ?? '',
      publishedAt: post?.publishedAt ?? '',
      content: post?.content ?? '',
    }
  })

  return <Composer posts={posts} />
}
