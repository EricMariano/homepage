'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Download, GripVertical, Images, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  drawSlide,
  emptySlide,
  isCover,
  newSlideId,
  SLIDE_H,
  SLIDE_W,
  starterDeck,
  TEMPLATES,
  TEMPLATE_IDS,
  type DeckMeta,
  type DrawEnv,
  type Slide,
  type SlideItem,
  type TemplateId,
} from '@/lib/slides'

/** LinkedIn re-encodes whatever it gets, so export at 2x and let it downsample. */
const EXPORT_SCALE = 2

interface Fonts {
  serif: string
  sans: string
}

interface FontChoice {
  id: string
  label: string
  family: string
}

/** Recolours the duck mask; the asset ships as white-on-transparent coverage. */
function tint(source: HTMLImageElement, color: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = source.naturalWidth
  canvas.height = source.naturalHeight
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(source, 0, 0)
  ctx.globalCompositeOperation = 'source-in'
  ctx.fillStyle = color
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  return canvas
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

/**
 * Canvas can't lay out text until the webfonts are actually loaded, and
 * `document.fonts.ready` alone resolves before faces that nothing has requested
 * yet. Asking for each face by name forces them in.
 */
function useFontsReady(serif: string, sans: string): boolean {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let live = true
    setReady(false)
    const faces = [
      `400 96px ${serif}`,
      `italic 400 96px ${serif}`,
      `300 30px ${sans}`,
      `400 32px ${sans}`,
      `italic 400 30px ${sans}`,
      `500 36px ${sans}`,
    ]
    Promise.all(faces.map((face) => document.fonts.load(face)))
      .then(() => document.fonts.ready)
      .then(() => {
        if (live) setReady(true)
      })
      .catch(() => {
        if (live) setReady(true)
      })
    return () => {
      live = false
    }
  }, [serif, sans])
  return ready
}

function useDuck(): { ink: CanvasImageSource | null; cream: CanvasImageSource | null; aspect: number } {
  const [state, setState] = useState<{
    ink: CanvasImageSource | null
    cream: CanvasImageSource | null
    aspect: number
  }>({ ink: null, cream: null, aspect: 1.077 })

  useEffect(() => {
    const img = new Image()
    img.src = '/duck-mark.png'
    img.onload = () =>
      setState({
        ink: tint(img, '#1B475E'),
        cream: tint(img, '#F2EEE0'),
        aspect: img.naturalWidth / img.naturalHeight,
      })
  }, [])

  return state
}

export function PostBuilder({
  serifChoices,
  sansChoices,
}: {
  serifChoices: FontChoice[]
  sansChoices: FontChoice[]
}) {
  const [slides, setSlides] = useState<Slide[]>(starterDeck)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [author, setAuthor] = useState('Eric Mariano')
  const [handle, setHandle] = useState('ericmariano.com.br')
  const [hint, setHint] = useState('arraste')
  const [serifId, setSerifId] = useState(serifChoices[0].id)
  const [sansId, setSansId] = useState(sansChoices[0].id)
  const [busy, setBusy] = useState(false)

  // Typography is a deck-wide choice — a carousel that changes face mid-swipe
  // reads as two different posts.
  const fonts: Fonts = {
    serif: (serifChoices.find((f) => f.id === serifId) ?? serifChoices[0]).family,
    sans: (sansChoices.find((f) => f.id === sansId) ?? sansChoices[0]).family,
  }

  const fontsReady = useFontsReady(fonts.serif, fonts.sans)
  const duck = useDuck()

  const selected = slides.find((s) => s.id === selectedId) ?? slides[0] ?? null
  useEffect(() => {
    if (slides.length && !slides.some((s) => s.id === selectedId)) {
      setSelectedId(slides[0].id)
    }
  }, [slides, selectedId])

  const metaFor = useCallback(
    (slide: Slide): DeckMeta => ({
      author,
      handle,
      hint,
      index: slides.findIndex((s) => s.id === slide.id) + 1,
      total: slides.length,
    }),
    [author, handle, hint, slides],
  )

  const { serif, sans } = fonts
  const envFor = useCallback(
    (slide: Slide): DrawEnv => ({
      serif,
      sans,
      duck: slide.template === 'cover-ink' ? duck.cream : duck.ink,
      duckAspect: duck.aspect,
    }),
    [duck, serif, sans],
  )

  const paint = useCallback(
    (canvas: HTMLCanvasElement, slide: Slide, scale: number) => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      canvas.width = SLIDE_W * scale
      canvas.height = SLIDE_H * scale
      ctx.setTransform(scale, 0, 0, scale, 0, 0)
      drawSlide(ctx, slide, metaFor(slide), envFor(slide))
    },
    [envFor, metaFor],
  )

  function update(patch: Partial<Slide>) {
    if (!selected) return
    setSlides((prev) => prev.map((s) => (s.id === selected.id ? { ...s, ...patch } : s)))
  }

  function updateItem(index: number, patch: Partial<SlideItem>) {
    if (!selected) return
    const items = selected.items.map((item, i) => (i === index ? { ...item, ...patch } : item))
    update({ items })
  }

  function addSlide(template: TemplateId) {
    const slide = emptySlide(template)
    setSlides((prev) => [...prev, slide])
    setSelectedId(slide.id)
  }

  function duplicateSlide(id: string) {
    setSlides((prev) => {
      const index = prev.findIndex((s) => s.id === id)
      if (index < 0) return prev
      const copy = { ...prev[index], id: newSlideId(), items: prev[index].items.map((i) => ({ ...i })) }
      return [...prev.slice(0, index + 1), copy, ...prev.slice(index + 1)]
    })
  }

  function removeSlide(id: string) {
    setSlides((prev) => prev.filter((s) => s.id !== id))
  }

  function move(id: string, direction: -1 | 1) {
    setSlides((prev) => {
      const from = prev.findIndex((s) => s.id === id)
      const to = from + direction
      if (from < 0 || to < 0 || to >= prev.length) return prev
      const next = [...prev]
      ;[next[from], next[to]] = [next[to], next[from]]
      return next
    })
  }

  const exportSlide = useCallback(
    (slide: Slide): Promise<void> =>
      new Promise((resolve) => {
        const canvas = document.createElement('canvas')
        paint(canvas, slide, EXPORT_SCALE)
        const index = slides.findIndex((s) => s.id === slide.id) + 1
        canvas.toBlob((blob) => {
          if (blob) {
            download(blob, `slide-${String(index).padStart(2, '0')}-${slide.template}.png`)
          }
          resolve()
        }, 'image/png')
      }),
    [paint, slides],
  )

  async function exportAll() {
    setBusy(true)
    try {
      for (const slide of slides) {
        await exportSlide(slide)
        // Browsers drop bursts of downloads triggered in the same tick.
        await new Promise((r) => setTimeout(r, 250))
      }
    } finally {
      setBusy(false)
    }
  }

  const spec = selected ? TEMPLATES[selected.template] : null

  return (
    <div className="mx-auto flex w-full max-w-[92rem] flex-col gap-6 px-6 py-8 lg:h-screen lg:overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Images className="h-4 w-4 text-[#8A8578]" />
          <h1 className="text-sm font-medium text-[#33312A]">Post builder</h1>
          <span className="text-xs text-[#8A8578]">
            {slides.length} slide(s) · 1080×1350
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/md"
            className="text-sm text-[#66625A] transition-colors hover:text-[#1B475E]"
          >
            Editor de posts
          </Link>
          <Button variant="outline" onClick={() => selected && exportSlide(selected)} disabled={!selected}>
            <Download className="h-4 w-4" />
            Este slide
          </Button>
          <Button onClick={exportAll} disabled={busy || !slides.length}>
            <Download className="h-4 w-4" />
            {busy ? 'Baixando…' : 'Baixar todos'}
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:min-h-0 lg:flex-1 lg:grid-cols-[15rem_minmax(0,1fr)_22rem]">
        <SlideRail
          slides={slides}
          selectedId={selected?.id ?? null}
          onSelect={setSelectedId}
          onAdd={addSlide}
          onMove={move}
          onDuplicate={duplicateSlide}
          onRemove={removeSlide}
          paint={paint}
          ready={fontsReady && Boolean(duck.ink)}
        />

        <section className="flex flex-col items-center justify-center gap-3 lg:min-h-0">
          {selected && (
            <Preview
              slide={selected}
              paint={paint}
              ready={fontsReady && Boolean(duck.ink)}
              deps={[author, handle, hint, slides]}
            />
          )}
          {spec && <p className="text-xs text-[#8A8578]">{spec.description}</p>}
        </section>

        <aside className="flex flex-col gap-5 lg:min-h-0 lg:overflow-y-auto lg:pr-2 lg:pb-4">
          {selected && spec && (
            <>
              <div className="flex flex-col gap-2">
                <Label>Template</Label>
                <div className="grid grid-cols-3 gap-1.5">
                  {TEMPLATE_IDS.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => update({ template: id })}
                      title={TEMPLATES[id].description}
                      className={`rounded-md border px-2 py-1.5 text-xs transition-colors ${
                        selected.template === id
                          ? 'border-[#1B475E] bg-[#1B475E] text-white'
                          : 'border-[#C9C2AC] text-[#66625A] hover:border-[#1B475E]'
                      }`}
                    >
                      {TEMPLATES[id].label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-[#8A8578]">
                  {isCover(selected.template)
                    ? 'Capas mostram “arraste →” no lugar da paginação.'
                    : 'Slides de conteúdo numeram sozinhos conforme a ordem.'}
                </p>
              </div>

              {spec.fields.map((field) =>
                field.key === 'items' ? (
                  <div key="items" className="flex flex-col gap-3">
                    <Label>{field.label}</Label>
                    {selected.items.map((item, i) => (
                      <div key={i} className="flex flex-col gap-1.5">
                        <Input
                          value={item.title}
                          onChange={(e) => updateItem(i, { title: e.target.value })}
                          placeholder={`Item ${i + 1}`}
                        />
                        <Textarea
                          value={item.description}
                          onChange={(e) => updateItem(i, { description: e.target.value })}
                          rows={2}
                          placeholder="Descrição"
                        />
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => update({ items: [...selected.items, { title: '', description: '' }] })}
                        className="text-xs text-[#66625A] underline underline-offset-2 hover:text-[#1B475E]"
                      >
                        Adicionar item
                      </button>
                      {selected.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => update({ items: selected.items.slice(0, -1) })}
                          className="text-xs text-[#8A8578] underline underline-offset-2 hover:text-[#1B475E]"
                        >
                          Remover último
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-[#8A8578]">Itens vazios não são desenhados.</p>
                  </div>
                ) : (
                  <div key={field.key} className="flex flex-col gap-1.5">
                    <Label htmlFor={field.key}>{field.label}</Label>
                    {field.type === 'area' ? (
                      <Textarea
                        id={field.key}
                        value={selected[field.key] as string}
                        onChange={(e) => update({ [field.key]: e.target.value })}
                        rows={field.rows ?? 3}
                        className={field.key === 'code' ? 'font-mono text-xs' : undefined}
                      />
                    ) : (
                      <Input
                        id={field.key}
                        value={selected[field.key] as string}
                        onChange={(e) => update({ [field.key]: e.target.value })}
                      />
                    )}
                    {field.hint && <p className="text-xs text-[#8A8578]">{field.hint}</p>}
                  </div>
                ),
              )}
            </>
          )}

          <div className="flex flex-col gap-3 border-t border-[#DCD6C2] pt-4">
            <p className="text-xs tracking-wide text-[#8A8578] uppercase">Tipografia</p>
            <FontPicker
              label="Serifada"
              hint="Manchetes, numerais e citações."
              choices={serifChoices}
              value={serifId}
              onChange={setSerifId}
            />
            <FontPicker
              label="Sem serifa"
              hint="Corpo de texto, chapéu e rodapé."
              choices={sansChoices}
              value={sansId}
              onChange={setSansId}
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-[#DCD6C2] pt-4">
            <p className="text-xs tracking-wide text-[#8A8578] uppercase">Rodapé do deck</p>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="author">Nome</Label>
              <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="handle">Domínio</Label>
              <Input id="handle" value={handle} onChange={(e) => setHandle(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="hint">Chamada da capa</Label>
              <Input id="hint" value={hint} onChange={(e) => setHint(e.target.value)} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function FontPicker({
  label,
  hint,
  choices,
  value,
  onChange,
}: {
  label: string
  hint: string
  choices: FontChoice[]
  value: string
  onChange: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <div className="grid grid-cols-2 gap-1.5">
        {choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            onClick={() => onChange(choice.id)}
            // Each option previews itself, which is the only way to pick a face.
            style={{ fontFamily: choice.family }}
            className={`rounded-md border px-2 py-1.5 text-sm transition-colors ${
              value === choice.id
                ? 'border-[#1B475E] bg-[#1B475E] text-white'
                : 'border-[#C9C2AC] text-[#66625A] hover:border-[#1B475E]'
            }`}
          >
            {choice.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-[#8A8578]">{hint}</p>
    </div>
  )
}

function Preview({
  slide,
  paint,
  ready,
  deps,
}: {
  slide: Slide
  paint: (canvas: HTMLCanvasElement, slide: Slide, scale: number) => void
  ready: boolean
  deps: unknown[]
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (ref.current && ready) paint(ref.current, slide, 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- redraw whenever any copy changes
  }, [slide, paint, ready, ...deps])

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label={`Prévia do slide: ${slide.headline.replace(/<\/?em>/g, '') || 'sem título'}`}
      className="max-h-full w-full max-w-[26rem] rounded-lg border border-[#DCD6C2] object-contain shadow-sm lg:w-auto"
      style={{ aspectRatio: `${SLIDE_W} / ${SLIDE_H}` }}
    />
  )
}

function SlideRail({
  slides,
  selectedId,
  onSelect,
  onAdd,
  onMove,
  onDuplicate,
  onRemove,
  paint,
  ready,
}: {
  slides: Slide[]
  selectedId: string | null
  onSelect: (id: string) => void
  onAdd: (template: TemplateId) => void
  onMove: (id: string, direction: -1 | 1) => void
  onDuplicate: (id: string) => void
  onRemove: (id: string) => void
  paint: (canvas: HTMLCanvasElement, slide: Slide, scale: number) => void
  ready: boolean
}) {
  return (
    <aside className="flex flex-col gap-3 lg:min-h-0 lg:overflow-y-auto lg:pr-2 lg:pb-4">
      <div className="flex items-center justify-between">
        <span className="text-xs tracking-wide text-[#8A8578] uppercase">Slides</span>
      </div>

      <div className="flex flex-col gap-2">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`group relative rounded-lg border p-1.5 transition-colors ${
              slide.id === selectedId
                ? 'border-[#1B475E] bg-[#E4DFCD]'
                : 'border-[#DCD6C2] hover:border-[#C9C2AC]'
            }`}
          >
            <button
              type="button"
              onClick={() => onSelect(slide.id)}
              aria-current={slide.id === selectedId}
              aria-label={`Slide ${index + 1}, ${TEMPLATES[slide.template].label}${
                slide.headline ? `: ${slide.headline.replace(/<\/?em>/g, '')}` : ''
              }`}
              className="flex w-full items-center gap-2 text-left"
            >
              <Thumb slide={slide} paint={paint} ready={ready} />
              <span className="flex min-w-0 flex-col">
                <span className="text-xs font-medium text-[#33312A]">
                  {index + 1}. {TEMPLATES[slide.template].label}
                </span>
                <span className="truncate text-[11px] text-[#8A8578]">
                  {slide.headline.replace(/<\/?em>/g, '') || 'sem título'}
                </span>
              </span>
            </button>
            <div className="mt-1 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <RailAction label="Subir" onClick={() => onMove(slide.id, -1)}>
                <GripVertical className="h-3 w-3 rotate-180" />
              </RailAction>
              <RailAction label="Descer" onClick={() => onMove(slide.id, 1)}>
                <GripVertical className="h-3 w-3" />
              </RailAction>
              <RailAction label="Duplicar" onClick={() => onDuplicate(slide.id)}>
                <Plus className="h-3 w-3" />
              </RailAction>
              <RailAction label="Remover" onClick={() => onRemove(slide.id)}>
                <Trash2 className="h-3 w-3" />
              </RailAction>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1.5 border-t border-[#DCD6C2] pt-3">
        <span className="text-xs text-[#8A8578]">Adicionar</span>
        <div className="grid grid-cols-3 gap-1.5">
          {TEMPLATE_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => onAdd(id)}
              title={TEMPLATES[id].description}
              className="rounded-md border border-dashed border-[#C9C2AC] px-2 py-1.5 text-xs text-[#66625A] transition-colors hover:border-[#1B475E] hover:text-[#1B475E]"
            >
              {TEMPLATES[id].label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

function RailAction({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="rounded p-1 text-[#8A8578] transition-colors hover:bg-[#EBE7D9] hover:text-[#1B475E]"
    >
      {children}
    </button>
  )
}

function Thumb({
  slide,
  paint,
  ready,
}: {
  slide: Slide
  paint: (canvas: HTMLCanvasElement, slide: Slide, scale: number) => void
  ready: boolean
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (ref.current && ready) paint(ref.current, slide, 0.05)
  }, [slide, paint, ready])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="h-14 w-11 shrink-0 rounded border border-[#DCD6C2] bg-[#E9E4D2]"
    />
  )
}
