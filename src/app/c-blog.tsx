"use client"

import { useState, useEffect } from "react"
import { IPost } from "@/interfaces/posts"



export function Blog() {
  const [posts, setPosts] = useState<IPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts')
        if (response.ok) {
          const data = await response.json()
          const publishedPosts = data.filter((post: IPost) => post.status === 'PUBLISHED')
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

  // Limitar a 6 posts para exibição
  const displayedPosts = posts.slice(0, 6)
  const hasMorePosts = posts.length > 6

  if (loading) {
    return (
      <div className="flex flex-col items-start gap-2 pb-4">
        <h1 className="text-sm text-[#A3A3A3] pb-2.5">Blog</h1>
        <p className="text-sm text-[#737377]">Carregando posts...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start gap-2 pb-8" aria-labelledby="blog-heading">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-sm text-[#A3A3A3] pb-2.5">Blog</h1>
      </div>
      
      {/* Grid de duas colunas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-40 gap-y-10 w-full" role="list" aria-label="Lista de posts">
        {displayedPosts.map((post) => (
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

      {/* Botão See More */}
      {hasMorePosts && (
        <div className="pt-2">
          <a 
            href="/blog" 
            className="text-xs text-[#737377] hover:text-gray-900 transition-colors underline underline-offset-2"
          >
            See more...
          </a>
        </div>
      )}
    </div>
  )
}