import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Eric Mariano - Software Engineer & Developer',
    short_name: 'Eric Mariano',
    description: 'Portfolio pessoal de Eric Mariano, Software Engineer e estudante de Ciência da Computação na Universidade Tiradentes.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ],
    categories: ['portfolio', 'developer', 'software', 'education'],
    lang: 'pt-BR',
    scope: '/',
    prefer_related_applications: false
  }
}
