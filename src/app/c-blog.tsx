"use client"

import { useState, useEffect } from "react"

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  publishedAt: string
  status: string
  category: {
    name: string
  }
}

export function Blog() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts')
        if (response.ok) {
          const data = await response.json()
          // Filtrar apenas posts publicados
          const publishedPosts = data.filter((post: Post) => post.status === 'PUBLISHED')
          setPosts(publishedPosts)
        }
      } catch (error) {
        console.error('Erro ao buscar posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-start gap-2 pb-4">
        <h1 className="text-sm text-[#A3A3A3] pb-2.5">Blog</h1>
        <p className="text-sm text-[#737377]">Carregando posts...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start gap-2 pb-4" aria-labelledby="blog-heading">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-sm text-[#A3A3A3] pb-2.5">Blog</h1>
      </div>
      <div className="grid md:grid-cols-3 grid-rows-1 items-start w-full gap-x-24 gap-y-10" role="list" aria-label="Lista de posts">
        {posts.map((post) => (
          <article key={post.id} className="flex flex-col gap-1" role="listitem">
            <a 
              href={`/posts/${post.slug}`} 
              className="hover:text-[#737377] transition-all duration-300 ease-in-out group flex items-center gap-2" 
              aria-label={`Ler post ${post.title}: ${post.excerpt}`}
            >
              <span className="text-sm text-[#737377]">{post.title}</span>
            </a>
            <p className="text-xs text-[#A3A3A3]">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  )
}