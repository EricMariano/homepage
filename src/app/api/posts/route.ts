import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            include: {
                category: true,
            },
            orderBy: {
                publishedAt: 'desc',
            }
        })

        return NextResponse.json(posts)
    } catch (error) {
        console.error('Error fetching posts:', error)
        return NextResponse.json({ error: 'Failed to fetch posts' }, 
            { status: 500 })
    }
}

export async function POST(request : NextRequest) {
    try {
        const body = await request.json()

        if (!body.title || !body.excerpt || !body.content || !body.categoryId ) {
            return NextResponse.json({ error: 'Missing required fields' },
                { status: 400 })
        }

        // Verificar se slug já existe e criar um único se necessário
        let finalSlug = body.slug
        let counter = 1
        
        while (true) {
            const existingPost = await prisma.post.findUnique({
                where: { slug: finalSlug }
            })
            
            if (!existingPost) {
                break // Slug é único, podemos usar
            }
            
            // Slug já existe, adicionar contador
            finalSlug = `${body.slug}-${counter}`
            counter++
        }

        const post = await prisma.post.create({
            data: {
              title: body.title,
              slug: finalSlug,
              excerpt: body.excerpt,
              content: body.content,
              tags: body.tags,
              featuredImage: body.featuredImage,
              status: body.status || 'DRAFT',
              categoryId: body.categoryId,
              publishedAt: body.status === 'PUBLISHED' ? new Date() : null
            },
            include: {
              category: true
            }
          })

        return NextResponse.json(post, { status: 201 })
    } catch (error) {
        console.error('Error creating post:', error)
        return NextResponse.json({ error: 'Failed to create post' },
            { status: 500 })
    }
}