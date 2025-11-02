import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  let totalPosts = 0
  let publishedPosts = 0
  let draftPosts = 0
  let totalCategories = 0

  try {
    totalPosts = await prisma.post.count()
    publishedPosts = await prisma.post.count({
      where: { status: 'PUBLISHED' }
    })
    draftPosts = await prisma.post.count({
      where: { status: 'DRAFT' }
    })
    totalCategories = await prisma.category.count()
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error)
    // Em caso de erro, os valores permanecem 0
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-2xl font-medium text-gray-900 mb-1">Dashboard</h1>
          <p className="text-gray-500">Painel administrativo</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="text-center">
            <div className="text-3xl font-light text-gray-900 mb-1">{totalPosts}</div>
            <div className="text-sm text-gray-500">Total Posts</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-light text-gray-900 mb-1">{publishedPosts}</div>
            <div className="text-sm text-gray-500">Publicados</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-light text-gray-900 mb-1">{draftPosts}</div>
            <div className="text-sm text-gray-500">Rascunhos</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-light text-gray-900 mb-1">{totalCategories}</div>
            <div className="text-sm text-gray-500">Categorias</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link href="/create-post">
            <Button variant="outline" className="h-9">
              Criar Post
            </Button>
          </Link>
          
          <Link href="/">
            <Button variant="outline" className="h-9">
              Ver Blog
            </Button>
          </Link>
          
          <Link href="/manage-posts">
            <Button variant="outline" className="h-9">
              Gerenciar Posts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}