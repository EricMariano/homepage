import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

// Força renderização no servidor (não estática)
export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  // Buscar estatísticas com tratamento de erro
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
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">Bem-vindo ao painel administrativo</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Total de Posts</h3>
            <p className="text-3xl font-bold text-blue-600">{totalPosts}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Posts Publicados</h3>
            <p className="text-3xl font-bold text-green-600">{publishedPosts}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Rascunhos</h3>
            <p className="text-3xl font-bold text-yellow-600">{draftPosts}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Categorias</h3>
            <p className="text-3xl font-bold text-purple-600">{totalCategories}</p>
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
          <div className="flex gap-4">
            <Link href="/create-post">
              <Button>Criar Novo Post</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Ver Blog</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}