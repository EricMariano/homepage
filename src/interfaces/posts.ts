export interface IPost {
    id: string
    title: string
    slug: string
    excerpt: string | null
    publishedAt: Date | string | null
    status: string
    category: {
      name: string
    }
}