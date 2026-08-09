import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

/** The site's `<html>` lives in `[locale]/layout.tsx`, so this branch needs its own. */
export const metadata: Metadata = {
  title: 'Editor',
  robots: { index: false, follow: false },
}

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} bg-[#F4F1E8] antialiased`}>{children}</body>
    </html>
  )
}
