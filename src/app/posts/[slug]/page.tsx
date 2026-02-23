import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getPostBySlug, getAllSlugs } from '@/lib/posts'

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const slugs = getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const paragraphs = post.content
    ? post.content.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
    : []

  return (
    <div className="mx-auto flex max-w-[52rem] flex-col items-start gap-6 px-6 py-8">
      <Link
        href="/"
        className="mb-2 flex items-center gap-2 text-sm text-[#737377] hover:text-[#A3A3A3] transition-colors"
        aria-label="Voltar para a página inicial"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>
      <header>
        <h1 className="font-instrument-serif text-xl md:text-3xl">{post.title}</h1>
        {post.publishedAt && (
          <time className="text-xs text-[#737377]" dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('pt-BR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
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
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Post não encontrado' }
  return {
    title: post.title,
    description: post.excerpt || post.title,
  }
}
