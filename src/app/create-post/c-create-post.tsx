"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Combobox } from "@/components/ui/combobox"

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function CreatePost({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState("")
  const [featuredImage, setFeaturedImage] = useState("")
  const [isSlugManual, setIsSlugManual] = useState(false)
  
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const categoriesData = await response.json()
        const formattedCategories = categoriesData.map((cat: { id: string; name: string }) => ({
          value: cat.id,
          label: cat.name
        }))
        setCategories(formattedCategories)
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error)
    }
  }
  // src/app/create-post/c-create-post.tsx
  useEffect(() => {
    fetchCategories()
  }, [])
  // Adicione estas funções no componente CreatePost

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  try {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        slug,
        excerpt,
        content,
        tags: tags ? JSON.stringify(tags.split(',').map(tag => tag.trim())) : null,
        featuredImage,
        status: 'PUBLISHED', // ou 'DRAFT'
        categoryId: category
      }),
    })

    if (response.ok) {
      // Sucesso - limpar formulário ou redirecionar
      console.log('Post criado com sucesso!')
    } else {
      // Erro
      console.error('Erro ao criar post')
    }
  } catch (error) {
    console.error('Erro:', error)
  }
}

// E modifique o form para usar onSubmit={handleSubmit}
// src/app/create-post/c-create-post.tsx
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    
    // Só atualiza o slug automaticamente se não foi editado manualmente
    if (!isSlugManual) {
      setSlug(generateSlug(newTitle))
    }
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value)
    setIsSlugManual(true)
  }

  const handleCreateCategory = async (newCategoryName: string) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategoryName,
          slug: generateSlug(newCategoryName)
        }),
      })
  
      if (response.ok) {
        const newCategory = await response.json()
        const formattedCategory = {
          value: newCategory.id,
          label: newCategory.name
        }
        
        // Adiciona a nova categoria à lista
        setCategories(prev => [...prev, formattedCategory])
        // Seleciona a nova categoria
        setCategory(newCategory.id)
      } else {
        console.error('Erro ao criar categoria')
      }
    } catch (error) {
      console.error('Erro:', error)
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="font-instrument-serif text-2xl font-normal">Criar Novo Post</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para criar um novo post no blog.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="title">Título do Post</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Digite o título do post"
                  value={title}
                  onChange={handleTitleChange}
                  required
                />
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  type="text"
                  placeholder="titulo-do-post"
                  value={slug}
                  onChange={handleSlugChange}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  O slug é gerado automaticamente baseado no título. Você pode editá-lo manualmente se necessário.
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="excerpt">Resumo</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Breve descrição do post..."
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea
                  id="content"
                  placeholder="Escreva o conteúdo do post aqui..."
                  rows={12}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="category">Categoria</Label>
                <Combobox
                  options={categories}
                  value={category}
                  onValueChange={setCategory}
                  onCreateNew={handleCreateCategory}
                  placeholder="Selecione uma categoria"
                />
                <p className="text-sm text-muted-foreground">
                  Digite para buscar uma categoria existente ou criar uma nova.
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <Input
                  id="tags"
                  type="text"
                  placeholder="react, nextjs, javascript"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="featured-image">URL da Imagem Destacada</Label>
                <Input
                  id="featured-image"
                  type="url"
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Criar Post
                </Button>
                <Button variant="outline" className="w-full">
                  Salvar como Rascunho
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}