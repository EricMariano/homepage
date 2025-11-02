"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

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

interface ManagePostsListProps {
  posts: Post[]
}

export function ManagePostsList({ posts }: ManagePostsListProps) {
  const [postsList, setPostsList] = useState(posts)
  const router = useRouter()

  const handleDeleteClick = async (postId: string) => {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.')
    
    if (!confirmDelete) return

    try {
      const response = await fetch(`/api/posts/delete/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        setPostsList(postsList.filter(post => post.id !== postId))
        router.refresh()
      } else {
        alert('Erro ao excluir post')
      }
    } catch {
      alert('Erro ao excluir post')
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'text-green-600 bg-green-50'
      case 'DRAFT':
        return 'text-yellow-600 bg-yellow-50'
      case 'ARCHIVED':
        return 'text-gray-600 bg-gray-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'Publicado'
      case 'DRAFT':
        return 'Rascunho'
      case 'ARCHIVED':
        return 'Arquivado'
      default:
        return status
    }
  }

  if (postsList.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Nenhum post encontrado</p>
        <Link href="/create-post">
          <Button className="h-9">Criar Primeiro Post</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {postsList.map((post) => (
          <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium text-gray-900">{post.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                    {getStatusText(post.status)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Categoria: {post.category.name}</span>
                  <span>Atualizado: {formatDate(post.updatedAt)}</span>
                  <span>Slug: {post.slug}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Link href={`/posts/${post.slug}`} target="_blank">
                  <Button variant="outline" size="sm" className="h-8">
                    Ver
                  </Button>
                </Link>
                <Link href={`/edit-post/${post.id}`}>
                  <Button variant="outline" size="sm" className="h-8">
                    Editar
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-red-600 hover:text-red-700 hover:border-red-300"
                  onClick={() => handleDeleteClick(post.id)}
                >
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </>
  )
}
