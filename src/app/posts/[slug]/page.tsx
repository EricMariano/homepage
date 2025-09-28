import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      category: true
    }
  })

  if (!post) {
    notFound()
  }

  return post
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <article className="prose prose-lg max-w-none">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Categoria: {post.category.name}</span>
              <span>•</span>
              <time dateTime={post.publishedAt?.toISOString()}>
                {post.publishedAt?.toLocaleDateString('pt-BR')}
              </time>
            </div>
            {post.excerpt && (
              <p className="text-lg text-gray-700 mt-4">{post.excerpt}</p>
            )}
          </header>
          
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </article>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  return {
    title: post.title,
    description: post.excerpt || post.title,
  }
}