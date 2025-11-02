import { prisma } from '@/lib/prisma'
import { ManagePostsList } from './c-manage-posts-list'

export const dynamic = 'force-dynamic'

interface Post {
  id: string
  title: string
  slug: string
  status: string
  updatedAt: Date
  category: {
    name: string
  }
}

export default async function ManagePostsPage() {
  let posts: Post[] = []

  try {
    posts = await prisma.post.findMany({
      include: {
        category: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })
  } catch (error) {
    console.error('Erro ao carregar posts:', error)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-1">Gerenciar Posts</h1>
          <p className="text-gray-500">Edite, exclua ou visualize seus posts</p>
        </div>

        {/* Posts List */}
        <ManagePostsList posts={posts} />
      </div>
    </div>
  )
}
