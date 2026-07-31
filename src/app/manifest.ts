import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Eric Mariano - Software Engineer & Developer',
    short_name: 'Eric Mariano',
    description: 'Personal site of Eric Mariano, software engineer, researcher and computer science student.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#E9E4D2',
    theme_color: '#1B475E',
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
      }
    ],
    categories: ['portfolio', 'developer', 'software', 'education'],
    lang: 'en-US',
    scope: '/',
    prefer_related_applications: false
  }
}
