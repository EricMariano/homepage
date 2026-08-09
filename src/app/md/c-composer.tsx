'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import type { BlockNoteEditor } from '@blocknote/core'
import { Download, ExternalLink, FileText, Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const Editor = dynamic(() => import('./c-editor'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[24rem] items-center justify-center rounded-lg border border-[#DCD6C2] bg-white text-sm text-[#8A8578]">
      Carregando editor…
    </div>
  ),
})

/** Matches the filename shape `posts.ts` expects, and keeps the name path-safe. */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const SUFFIX_OPTIONS = [
  { value: null, label: 'Ambos', hint: 'Um arquivo só, servido nos dois idiomas' },
  { value: 'pt', label: 'PT', hint: 'Só a versão em português' },
  { value: 'en', label: 'EN', hint: 'Só a versão em inglês' },
] as const

export interface EditablePost {
  filename: string
  slug: string
  suffix: string | null
  title: string
  excerpt: string
  publishedAt: string
  content: string
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Double-quoted YAML: the only escapes it needs are backslash and quote. Line
 * breaks would end the scalar, so they collapse to spaces — frontmatter values
 * are single-line by construction.
 */
function yamlString(value: string): string {
  const flat = value.replace(/\s+/g, ' ').trim()
  return `"${flat.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

function buildMarkdown(post: {
  title: string
  excerpt: string
  publishedAt: string
  content: string
}): string {
  const frontmatter = [
    '---',
    `title: ${yamlString(post.title)}`,
    `excerpt: ${yamlString(post.excerpt)}`,
    // Quoted, so YAML hands `posts.ts` a string instead of a Date.
    ...(post.publishedAt ? [`publishedAt: ${yamlString(post.publishedAt)}`] : []),
    '---',
  ]
  return `${frontmatter.join('\n')}\n\n${post.content.trim()}\n`
}

function downloadMarkdown(filename: string, contents: string) {
  const url = URL.createObjectURL(new Blob([contents], { type: 'text/markdown;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

/** `YYYY-MM-DD` for today in local time. */
function todayISO(): string {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10)
}

export function Composer({ posts }: { posts: EditablePost[] }) {
  const [openFile, setOpenFile] = useState<string | null>(null)
  const current = posts.find((post) => post.filename === openFile) ?? null

  return (
    <div className="mx-auto flex w-full max-w-6xl gap-8 px-6 py-10">
      <aside className="hidden w-56 shrink-0 flex-col gap-4 md:flex">
        <div className="flex flex-col gap-1">
          <h1 className="text-sm font-medium text-[#33312A]">Posts</h1>
          <p className="text-xs text-[#8A8578]">{posts.length} arquivo(s)</p>
        </div>
        <button
          type="button"
          onClick={() => setOpenFile(null)}
          className="flex items-center gap-2 rounded-md border border-dashed border-[#C9C2AC] px-3 py-2 text-sm text-[#66625A] transition-colors hover:border-[#1B475E] hover:text-[#1B475E]"
        >
          <Plus className="h-4 w-4" />
          Novo post
        </button>
        <nav className="flex flex-col gap-1">
          {posts.map((post) => (
            <button
              key={post.filename}
              type="button"
              onClick={() => setOpenFile(post.filename)}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                post.filename === openFile
                  ? 'bg-[#E4DFCD] text-[#33312A]'
                  : 'text-[#66625A] hover:bg-[#EBE7D9] hover:text-[#33312A]'
              }`}
            >
              <FileText className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{post.slug}</span>
              <span className="ml-auto text-[10px] tracking-wide text-[#8A8578] uppercase">
                {post.suffix ?? '—'}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Remounting resets every field and reloads the editor's content. */}
      <PostForm key={openFile ?? 'new'} post={current} />
    </div>
  )
}

function PostForm({ post }: { post: EditablePost | null }) {
  const editorRef = useRef<BlockNoteEditor | null>(null)

  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '')
  const [publishedAt, setPublishedAt] = useState(post?.publishedAt ?? '')
  const [suffix, setSuffix] = useState<string | null>(post?.suffix ?? null)
  const [slugTouched, setSlugTouched] = useState(Boolean(post))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filled after mount so the prerendered HTML doesn't bake in the build date.
  useEffect(() => {
    if (!post) setPublishedAt(todayISO())
  }, [post])

  const onReady = useCallback((editor: BlockNoteEditor) => {
    editorRef.current = editor
  }, [])
  const onDirty = useCallback(() => setError(null), [])

  function handleTitleChange(value: string) {
    setTitle(value)
    // Only follow the title until the slug is edited by hand.
    if (!slugTouched) setSlug(slugify(value))
  }

  async function handleDownload() {
    if (!editorRef.current) return
    if (!title.trim()) {
      setError('O post precisa de um título.')
      return
    }
    if (!SLUG_PATTERN.test(slug.trim())) {
      setError('Slug inválido — use apenas letras minúsculas, números e hifens.')
      return
    }
    if (publishedAt && !/^\d{4}-\d{2}-\d{2}$/.test(publishedAt)) {
      setError('A data precisa estar no formato AAAA-MM-DD.')
      return
    }

    setBusy(true)
    setError(null)
    try {
      const content = await editorRef.current.blocksToMarkdownLossy(editorRef.current.document)
      const filename = suffix ? `${slug.trim()}.${suffix}.md` : `${slug.trim()}.md`
      downloadMarkdown(filename, buildMarkdown({ title, excerpt, publishedAt, content }))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Falha ao gerar o arquivo.')
    } finally {
      setBusy(false)
    }
  }

  const previewLocale = suffix ?? 'en'
  const filename = slug.trim() ? (suffix ? `${slug.trim()}.${suffix}.md` : `${slug.trim()}.md`) : '…'

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs tracking-wide text-[#8A8578] uppercase">
          {post ? `Editando ${post.filename}` : 'Novo post'}
        </span>
        <div className="flex items-center gap-3">
          {post && (
            <a
              href={`/${previewLocale}/posts/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-[#66625A] transition-colors hover:text-[#1B475E]"
            >
              Ver no site
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <Button onClick={handleDownload} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Baixar .md
          </Button>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-md bg-[#F0DAD6] px-3 py-2 text-sm text-[#8A2F22]">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Título do post"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true)
              setSlug(e.target.value)
            }}
            placeholder="titulo-do-post"
          />
          <p className="text-xs text-[#8A8578]">
            /{previewLocale}/posts/{slug || '…'}
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="publishedAt">Data</Label>
          <Input
            id="publishedAt"
            type="date"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="excerpt">Resumo</Label>
          <Textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            placeholder="Aparece na listagem do blog e nos metadados."
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>Idioma do arquivo</Label>
          <div className="flex flex-wrap gap-2">
            {SUFFIX_OPTIONS.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => setSuffix(option.value)}
                title={option.hint}
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  suffix === option.value
                    ? 'border-[#1B475E] bg-[#1B475E] text-white'
                    : 'border-[#C9C2AC] text-[#66625A] hover:border-[#1B475E]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-[#8A8578]">
            {SUFFIX_OPTIONS.find((o) => o.value === suffix)?.hint}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Conteúdo</Label>
        <p className="text-xs text-[#8A8578]">
          Digite <code className="rounded bg-[#E4DFCD] px-1">/</code> para inserir títulos, listas e
          blocos de código.
        </p>
        <Editor initialMarkdown={post?.content ?? ''} onReady={onReady} onDirty={onDirty} />
      </div>

      <p className="text-xs text-[#8A8578]">
        O arquivo baixa como <code className="rounded bg-[#E4DFCD] px-1">{filename}</code> — coloque
        em <code className="rounded bg-[#E4DFCD] px-1">content/posts/</code> e faça commit para
        publicar.
      </p>
    </main>
  )
}
