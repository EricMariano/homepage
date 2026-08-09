/**
 * Slide templates for LinkedIn posts, drawn straight onto a canvas.
 *
 * Everything draws in a fixed 1080x1350 coordinate space (LinkedIn's 4:5, the
 * ratio that takes the most height in the feed). The caller scales the context,
 * so the same code paints the editor preview, the sidebar thumbnails and the
 * exported PNG — there is no second implementation to drift out of sync.
 */

export const SLIDE_W = 1080
export const SLIDE_H = 1350

const PAD_X = 84
const PAD_TOP = 88
const PAD_BOTTOM = 76

/** The homepage palette, same hexes the site hardcodes. */
const C = {
  paper: '#E9E4D2',
  card: '#F2EEE0',
  ink: '#1B475E',
  fg: '#262626',
  prose: '#33312A',
  muted: '#7A7568',
  body: '#66625A',
  rule: '#DAD4C0',
  dark: '#33312A',
  darkFg: '#EDE8D8',
  inkGlow: '#24596F',
  inkSoft: '#A8C6D4',
  inkSub: '#C6D8E0',
  codeMuted: '#9A9384',
} as const

export type TemplateId = 'cover-serif' | 'cover-ink' | 'cover-card' | 'text' | 'list' | 'quote'

export interface SlideItem {
  title: string
  description: string
}

/**
 * One flat shape for every template. Each template reads the subset it needs
 * (see `TEMPLATES[id].fields`), which keeps switching templates non-destructive —
 * you don't lose the copy you already typed.
 */
export interface Slide {
  id: string
  template: TemplateId
  eyebrow: string
  headline: string
  sub: string
  body: string
  items: SlideItem[]
  codeLabel: string
  code: string
}

export interface DeckMeta {
  author: string
  handle: string
  hint: string
  /** 1-based; covers show the hint instead of a counter. */
  index: number
  total: number
}

export interface DrawEnv {
  serif: string
  sans: string
  /** White-on-transparent duck mask; tinted per slide. */
  duck: CanvasImageSource | null
  duckAspect: number
}

const MONO = 'ui-monospace, "SF Mono", Menlo, monospace'

// --------------------------------------------------------------- text ------

interface Piece {
  text: string
  em: boolean
}

/** Splits `foo <em>bar</em>` into styled runs. Unclosed tags are treated as text. */
export function parseRich(src: string): Piece[] {
  const out: Piece[] = []
  const re = /<em>([\s\S]*?)<\/em>/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(src))) {
    if (m.index > last) out.push({ text: src.slice(last, m.index), em: false })
    out.push({ text: m[1], em: true })
    last = m.index + m[0].length
  }
  if (last < src.length) out.push({ text: src.slice(last), em: false })
  return out.filter((p) => p.text.length > 0)
}

interface Word {
  text: string
  em: boolean
  w: number
}
type Line = Word[]

function wrap(
  ctx: CanvasRenderingContext2D,
  pieces: Piece[],
  maxWidth: number,
  fontFor: (em: boolean) => string,
): Line[] {
  const words: Word[] = []
  for (const piece of pieces) {
    ctx.font = fontFor(piece.em)
    for (const raw of piece.text.split(/\s+/)) {
      if (!raw) continue
      words.push({ text: raw, em: piece.em, w: ctx.measureText(raw).width })
    }
  }

  const lines: Line[] = []
  let line: Line = []
  let width = 0
  for (const word of words) {
    ctx.font = fontFor(word.em)
    const space = line.length ? ctx.measureText(' ').width : 0
    if (line.length && width + space + word.w > maxWidth) {
      lines.push(line)
      line = [word]
      width = word.w
    } else {
      line.push(word)
      width += space + word.w
    }
  }
  if (line.length) lines.push(line)
  return lines.length ? lines : [[]]
}

function drawLines(
  ctx: CanvasRenderingContext2D,
  lines: Line[],
  x: number,
  top: number,
  size: number,
  lineHeight: number,
  fontFor: (em: boolean) => string,
  colorFor: (em: boolean) => string,
) {
  ctx.textBaseline = 'top'
  lines.forEach((line, i) => {
    // CSS puts the extra leading half above and half below the glyphs.
    let cursor = x
    const y = top + i * lineHeight + (lineHeight - size) / 2
    line.forEach((word, j) => {
      ctx.font = fontFor(word.em)
      ctx.fillStyle = colorFor(word.em)
      if (j > 0) cursor += ctx.measureText(' ').width
      ctx.fillText(word.text, cursor, y)
      cursor += word.w
    })
  })
}

interface TextBlock {
  h: number
  draw: (top: number) => void
}

function richBlock(
  ctx: CanvasRenderingContext2D,
  src: string,
  opts: {
    x: number
    maxWidth: number
    size: number
    lineHeight: number
    font: (em: boolean) => string
    color: (em: boolean) => string
  },
): TextBlock {
  const lines = wrap(ctx, parseRich(src), opts.maxWidth, opts.font)
  return {
    h: lines.length * opts.lineHeight,
    draw: (top) =>
      drawLines(ctx, lines, opts.x, top, opts.size, opts.lineHeight, opts.font, opts.color),
  }
}

function plainBlock(
  ctx: CanvasRenderingContext2D,
  src: string,
  opts: {
    x: number
    maxWidth: number
    size: number
    lineHeight: number
    font: string
    color: string
  },
): TextBlock {
  return richBlock(ctx, src.replace(/<\/?em>/g, ''), {
    ...opts,
    font: () => opts.font,
    color: () => opts.color,
  })
}

/** Vertically centres a stack of blocks in `[top, bottom]`, never overflowing the top. */
function centerStack(
  blocks: { h: number; gap?: number; draw: (top: number) => void }[],
  top: number,
  bottom: number,
) {
  const total = blocks.reduce((sum, b) => sum + b.h + (b.gap ?? 0), 0)
  let y = Math.max(top, top + (bottom - top - total) / 2)
  for (const block of blocks) {
    y += block.gap ?? 0
    block.draw(y)
    y += block.h
  }
}

// ------------------------------------------------------------ painting -----

function font(family: string, size: number, weight = 400, italic = false): string {
  return `${italic ? 'italic ' : ''}${weight} ${size}px ${family}`
}

/** Canvas gradients are circular, so squash the context to get the CSS ellipse. */
function paintGlow(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  color: string,
) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(1, ry / rx)
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx)
  grad.addColorStop(0, color)
  grad.addColorStop(1, `${color}00`)
  ctx.fillStyle = grad
  ctx.fillRect(-rx, -rx, rx * 2, rx * 2)
  ctx.restore()
}

function pill(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  opts: { font: string; bg: string; fg: string; padX: number; height: number; tracking?: string },
): number {
  ctx.font = opts.font
  ctx.letterSpacing = opts.tracking ?? '0px'
  const w = ctx.measureText(text).width + opts.padX * 2
  ctx.fillStyle = opts.bg
  ctx.beginPath()
  ctx.roundRect(x, y, w, opts.height, opts.height / 2)
  ctx.fill()
  ctx.fillStyle = opts.fg
  ctx.textBaseline = 'middle'
  ctx.fillText(text, x + opts.padX, y + opts.height / 2 + 1)
  ctx.textBaseline = 'top'
  ctx.letterSpacing = '0px'
  return w
}

function drawDuck(
  ctx: CanvasRenderingContext2D,
  env: DrawEnv,
  x: number,
  y: number,
  width: number,
) {
  if (!env.duck) return
  ctx.drawImage(env.duck, x, y, width, width / env.duckAspect)
}

/** Eyebrow: a short rule then spaced small caps. Returns its height. */
function drawEyebrow(
  ctx: CanvasRenderingContext2D,
  env: DrawEnv,
  text: string,
  y: number,
  color: string,
): number {
  if (!text) return 0
  ctx.fillStyle = color
  ctx.fillRect(PAD_X, y + 11, 44, 2)
  ctx.font = font(env.sans, 21, 500)
  ctx.letterSpacing = '3.4px'
  ctx.textBaseline = 'top'
  ctx.fillText(text, PAD_X + 62, y)
  ctx.letterSpacing = '0px'
  return 24
}

function drawKicker(
  ctx: CanvasRenderingContext2D,
  env: DrawEnv,
  text: string,
  y: number,
): number {
  if (!text) return 0
  ctx.font = font(env.sans, 20, 500)
  ctx.letterSpacing = '3px'
  ctx.fillStyle = C.muted
  ctx.textBaseline = 'top'
  ctx.fillText(text, PAD_X, y)
  ctx.letterSpacing = '0px'
  return 23
}

/**
 * The shared footer. Returns the y of its rule so the body knows where to stop.
 */
function drawFooter(
  ctx: CanvasRenderingContext2D,
  env: DrawEnv,
  meta: DeckMeta,
  opts: { x?: number; right?: number; bottom?: number; dark?: boolean; ruleColor?: string } = {},
): number {
  const x = opts.x ?? PAD_X
  const right = opts.right ?? SLIDE_W - PAD_X
  const bottom = opts.bottom ?? SLIDE_H - PAD_BOTTOM
  const rowH = 56
  const rowTop = bottom - rowH
  const ruleY = rowTop - 26

  ctx.fillStyle = opts.ruleColor ?? (opts.dark ? 'rgba(242,238,224,0.22)' : C.rule)
  ctx.fillRect(x, ruleY, right - x, 1)

  drawDuck(ctx, env, x, rowTop, rowH)

  const mid = rowTop + rowH / 2 + 1
  ctx.textBaseline = 'middle'
  let cursor = x + 76
  ctx.font = font(env.sans, 22)
  ctx.fillStyle = opts.dark ? C.card : C.fg
  ctx.fillText(meta.author, cursor, mid)
  cursor += ctx.measureText(meta.author).width + 20
  ctx.fillStyle = opts.dark ? C.inkSoft : C.muted
  ctx.fillText(meta.handle, cursor, mid)

  const tail = meta.total > 1 ? `${meta.index} / ${meta.total}` : ''
  if (tail) {
    ctx.textAlign = 'right'
    ctx.fillText(tail, right, mid)
    ctx.textAlign = 'left'
  }
  ctx.textBaseline = 'top'
  return ruleY
}

function drawHintFooter(
  ctx: CanvasRenderingContext2D,
  env: DrawEnv,
  meta: DeckMeta,
  opts: { x?: number; right?: number; bottom?: number; dark?: boolean } = {},
): number {
  const ruleY = drawFooter(ctx, env, { ...meta, total: 1 }, opts)
  if (meta.hint) {
    const right = opts.right ?? SLIDE_W - PAD_X
    const bottom = opts.bottom ?? SLIDE_H - PAD_BOTTOM
    ctx.font = font(env.sans, 22)
    ctx.fillStyle = opts.dark ? C.inkSoft : C.muted
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${meta.hint}  →`, right, bottom - 28 + 1)
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
  }
  return ruleY
}

// ----------------------------------------------------------- templates -----

type DrawFn = (
  ctx: CanvasRenderingContext2D,
  slide: Slide,
  meta: DeckMeta,
  env: DrawEnv,
) => void

const coverSerif: DrawFn = (ctx, slide, meta, env) => {
  ctx.fillStyle = C.paper
  ctx.fillRect(0, 0, SLIDE_W, SLIDE_H)
  paintGlow(ctx, SLIDE_W / 2, SLIDE_H * 0.3, SLIDE_W * 0.7, SLIDE_H * 0.46, C.card)

  const headTop = PAD_TOP + drawEyebrow(ctx, env, slide.eyebrow, PAD_TOP, C.ink)
  const footTop = drawHintFooter(ctx, env, meta)

  const headline = richBlock(ctx, slide.headline, {
    x: PAD_X,
    maxWidth: SLIDE_W - PAD_X * 2,
    size: 96,
    lineHeight: 101,
    font: (em) => font(env.serif, 96, 400, em),
    color: (em) => (em ? C.ink : C.fg),
  })
  const sub = plainBlock(ctx, slide.sub, {
    x: PAD_X,
    maxWidth: 840,
    size: 30,
    lineHeight: 45,
    font: font(env.sans, 30, 300),
    color: C.body,
  })
  centerStack([headline, { ...sub, gap: 40 }], headTop, footTop - 72)
}

const coverInk: DrawFn = (ctx, slide, meta, env) => {
  ctx.fillStyle = C.ink
  ctx.fillRect(0, 0, SLIDE_W, SLIDE_H)
  paintGlow(ctx, SLIDE_W / 2, SLIDE_H * 0.26, SLIDE_W * 0.66, SLIDE_H * 0.44, C.inkGlow)

  drawDuck(ctx, env, PAD_X, PAD_TOP, 150)
  const eyebrowY = PAD_TOP + 150 / env.duckAspect + 44
  const headTop = eyebrowY + drawEyebrow(ctx, env, slide.eyebrow, eyebrowY, C.inkSoft)
  const footTop = drawHintFooter(ctx, env, meta, { dark: true })

  const headline = richBlock(ctx, slide.headline, {
    x: PAD_X,
    maxWidth: SLIDE_W - PAD_X * 2,
    size: 100,
    lineHeight: 105,
    font: (em) => font(env.serif, 100, 400, em),
    color: (em) => (em ? C.inkSoft : C.card),
  })
  const sub = plainBlock(ctx, slide.sub, {
    x: PAD_X,
    maxWidth: 840,
    size: 30,
    lineHeight: 45,
    font: font(env.sans, 30, 300),
    color: C.inkSub,
  })
  centerStack([headline, { ...sub, gap: 40 }], headTop, footTop - 72)
}

const coverCard: DrawFn = (ctx, slide, meta, env) => {
  ctx.fillStyle = C.paper
  ctx.fillRect(0, 0, SLIDE_W, SLIDE_H)
  paintGlow(ctx, SLIDE_W / 2, SLIDE_H * 0.3, SLIDE_W * 0.7, SLIDE_H * 0.46, C.card)

  const inset = 60
  ctx.beginPath()
  ctx.roundRect(inset, inset, SLIDE_W - inset * 2, SLIDE_H - inset * 2, 34)
  ctx.fillStyle = C.card
  ctx.fill()
  ctx.strokeStyle = C.rule
  ctx.lineWidth = 1
  ctx.stroke()

  const x = inset + 64
  const right = SLIDE_W - inset - 64
  const top = inset + 72

  if (slide.eyebrow) {
    pill(ctx, slide.eyebrow, x, top, {
      font: font(env.sans, 21, 500),
      bg: C.ink,
      fg: C.card,
      padX: 24,
      height: 46,
      tracking: '2.1px',
    })
  }
  drawDuck(ctx, env, right - 132, top - 14, 132)

  const footTop = drawHintFooter(ctx, env, meta, {
    x,
    right,
    bottom: SLIDE_H - inset - 60,
  })

  const headline = richBlock(ctx, slide.headline, {
    x,
    maxWidth: right - x,
    size: 88,
    lineHeight: 93,
    font: (em) => font(env.serif, 88, 400, em),
    color: (em) => (em ? C.ink : C.fg),
  })
  const sub = plainBlock(ctx, slide.sub, {
    x,
    maxWidth: right - x,
    size: 30,
    lineHeight: 45,
    font: font(env.sans, 30, 300),
    color: C.body,
  })
  centerStack([headline, { ...sub, gap: 36 }], top + 132, footTop - 72)
}

const contentText: DrawFn = (ctx, slide, meta, env) => {
  ctx.fillStyle = C.paper
  ctx.fillRect(0, 0, SLIDE_W, SLIDE_H)
  paintGlow(ctx, SLIDE_W / 2, SLIDE_H * 0.3, SLIDE_W * 0.7, SLIDE_H * 0.46, C.card)

  let y = PAD_TOP + drawKicker(ctx, env, slide.eyebrow, PAD_TOP)
  const heading = richBlock(ctx, slide.headline, {
    x: PAD_X,
    maxWidth: SLIDE_W - PAD_X * 2,
    size: 66,
    lineHeight: 73,
    font: (em) => font(env.serif, 66, 400, em),
    color: (em) => (em ? C.ink : C.fg),
  })
  y += 22
  heading.draw(y)
  y += heading.h + 44
  ctx.fillStyle = C.rule
  ctx.fillRect(PAD_X, y, SLIDE_W - PAD_X * 2, 1)

  const footTop = drawFooter(ctx, env, meta)

  const blocks: { h: number; gap?: number; draw: (top: number) => void }[] = []
  const paragraphs = slide.body.split(/\n\s*\n/).filter((p) => p.trim())
  paragraphs.forEach((text, i) => {
    const block = plainBlock(ctx, text.replace(/\s*\n\s*/g, ' '), {
      x: PAD_X,
      maxWidth: SLIDE_W - PAD_X * 2,
      size: 32,
      lineHeight: 52,
      font: font(env.sans, 32),
      color: C.prose,
    })
    blocks.push({ ...block, gap: i === 0 ? 0 : 30 })
  })

  if (slide.sub.trim()) {
    const inner = plainBlock(ctx, slide.sub, {
      x: PAD_X + 35,
      maxWidth: SLIDE_W - PAD_X * 2 - 67,
      size: 30,
      lineHeight: 44,
      font: font(env.sans, 30, 400, true),
      color: C.body,
    })
    const h = inner.h + 52
    blocks.push({
      h,
      gap: blocks.length ? 46 : 0,
      draw: (top) => {
        ctx.fillStyle = C.card
        ctx.beginPath()
        ctx.roundRect(PAD_X, top, SLIDE_W - PAD_X * 2, h, [0, 14, 14, 0])
        ctx.fill()
        ctx.fillStyle = C.ink
        ctx.fillRect(PAD_X, top, 3, h)
        inner.draw(top + 26)
      },
    })
  }

  centerStack(blocks, y + 40, footTop - 72)
}

const contentList: DrawFn = (ctx, slide, meta, env) => {
  ctx.fillStyle = C.paper
  ctx.fillRect(0, 0, SLIDE_W, SLIDE_H)
  paintGlow(ctx, SLIDE_W / 2, SLIDE_H * 0.3, SLIDE_W * 0.7, SLIDE_H * 0.46, C.card)

  let y = PAD_TOP + drawKicker(ctx, env, slide.eyebrow, PAD_TOP)
  const heading = richBlock(ctx, slide.headline, {
    x: PAD_X,
    maxWidth: SLIDE_W - PAD_X * 2,
    size: 66,
    lineHeight: 73,
    font: (em) => font(env.serif, 66, 400, em),
    color: (em) => (em ? C.ink : C.fg),
  })
  y += 22
  heading.draw(y)
  y += heading.h

  const footTop = drawFooter(ctx, env, meta)

  const textX = PAD_X + 100
  const blocks = slide.items
    .filter((item) => item.title.trim() || item.description.trim())
    .map((item, i) => {
      const title = plainBlock(ctx, item.title, {
        x: textX,
        maxWidth: SLIDE_W - PAD_X - textX,
        size: 36,
        lineHeight: 44,
        font: font(env.sans, 36, 500),
        color: C.fg,
      })
      const desc = plainBlock(ctx, item.description, {
        x: textX,
        maxWidth: SLIDE_W - PAD_X - textX,
        size: 28,
        lineHeight: 42,
        font: font(env.sans, 28, 300),
        color: C.body,
      })
      const padTop = i === 0 ? 0 : 38
      const h = padTop + title.h + 12 + desc.h + 38
      return {
        h,
        draw: (top: number) => {
          if (i > 0) {
            ctx.fillStyle = C.rule
            ctx.fillRect(PAD_X, top, SLIDE_W - PAD_X * 2, 1)
          }
          ctx.font = font(env.serif, 56)
          ctx.fillStyle = C.ink
          ctx.textBaseline = 'top'
          ctx.fillText(String(i + 1).padStart(2, '0'), PAD_X, top + padTop - 2)
          title.draw(top + padTop)
          desc.draw(top + padTop + title.h + 12)
        },
      }
    })

  centerStack(blocks, y + 20, footTop - 72)
}

const contentQuote: DrawFn = (ctx, slide, meta, env) => {
  ctx.fillStyle = C.paper
  ctx.fillRect(0, 0, SLIDE_W, SLIDE_H)
  paintGlow(ctx, SLIDE_W / 2, SLIDE_H * 0.3, SLIDE_W * 0.7, SLIDE_H * 0.46, C.card)

  const headTop = PAD_TOP + drawKicker(ctx, env, slide.eyebrow, PAD_TOP)
  const footTop = drawFooter(ctx, env, meta)

  const blocks: { h: number; gap?: number; draw: (top: number) => void }[] = []

  if (slide.headline.trim()) {
    const quoteX = PAD_X + 42
    const inner = richBlock(ctx, slide.headline, {
      x: quoteX,
      maxWidth: SLIDE_W - PAD_X - quoteX,
      size: 74,
      lineHeight: 84,
      font: (em) => font(env.serif, 74, 400, em),
      color: (em) => (em ? C.ink : C.fg),
    })
    blocks.push({
      h: inner.h,
      draw: (top) => {
        ctx.fillStyle = C.ink
        ctx.fillRect(PAD_X, top, 4, inner.h)
        inner.draw(top)
      },
    })
  }

  const codeLines = slide.code.split('\n')
  if (slide.code.trim()) {
    const labelH = slide.codeLabel.trim() ? 21 + 20 + 22 : 0
    const h = 34 + labelH + codeLines.length * 46 + 38
    blocks.push({
      h,
      gap: blocks.length ? 56 : 0,
      draw: (top) => {
        ctx.fillStyle = C.dark
        ctx.beginPath()
        ctx.roundRect(PAD_X, top, SLIDE_W - PAD_X * 2, h, 18)
        ctx.fill()

        let y = top + 34
        ctx.textBaseline = 'top'
        if (labelH) {
          ctx.font = `21px ${MONO}`
          ctx.letterSpacing = '0.8px'
          ctx.fillStyle = C.codeMuted
          ctx.fillText(slide.codeLabel, PAD_X + 38, y)
          ctx.letterSpacing = '0px'
          y += 21 + 20
          ctx.fillStyle = 'rgba(237,232,216,0.14)'
          ctx.fillRect(PAD_X + 38, y, SLIDE_W - PAD_X * 2 - 76, 1)
          y += 22
        }
        ctx.font = `27px ${MONO}`
        for (const line of codeLines) {
          // Comments go quiet; bare integers pick up the accent, like the site's code blocks.
          if (line.trim().startsWith('#')) {
            ctx.fillStyle = C.codeMuted
            ctx.fillText(line, PAD_X + 38, y + 9)
          } else {
            let cursor = PAD_X + 38
            for (const token of line.split(/(\d+)/)) {
              if (!token) continue
              ctx.fillStyle = /^\d+$/.test(token) ? C.inkSoft : C.darkFg
              ctx.fillText(token, cursor, y + 9)
              cursor += ctx.measureText(token).width
            }
          }
          y += 46
        }
      },
    })
  }

  centerStack(blocks, headTop + 20, footTop - 72)
}

export interface FieldSpec {
  key: 'eyebrow' | 'headline' | 'sub' | 'body' | 'items' | 'codeLabel' | 'code'
  label: string
  hint?: string
  type: 'text' | 'area'
  rows?: number
}

export interface TemplateSpec {
  label: string
  group: 'Capa' | 'Conteúdo'
  description: string
  fields: FieldSpec[]
  draw: DrawFn
}

const RICH_HINT = 'Envolva uma palavra em <em>…</em> para o itálico serifado em azul.'

export const TEMPLATES: Record<TemplateId, TemplateSpec> = {
  'cover-serif': {
    label: 'Serif',
    group: 'Capa',
    description: 'Papel creme, manchete grande. A que mais parece a homepage.',
    fields: [
      { key: 'eyebrow', label: 'Chapéu', type: 'text' },
      { key: 'headline', label: 'Manchete', type: 'area', rows: 2, hint: RICH_HINT },
      { key: 'sub', label: 'Linha de apoio', type: 'area', rows: 2 },
    ],
    draw: coverSerif,
  },
  'cover-ink': {
    label: 'Ink',
    group: 'Capa',
    description: 'Fundo azul sólido. Alto contraste — é a que trava o scroll.',
    fields: [
      { key: 'eyebrow', label: 'Chapéu', type: 'text' },
      { key: 'headline', label: 'Manchete', type: 'area', rows: 2, hint: RICH_HINT },
      { key: 'sub', label: 'Linha de apoio', type: 'area', rows: 2 },
    ],
    draw: coverInk,
  },
  'cover-card': {
    label: 'Card',
    group: 'Capa',
    description: 'O cartão com borda, igual ao hover card do header.',
    fields: [
      { key: 'eyebrow', label: 'Tag', type: 'text' },
      { key: 'headline', label: 'Manchete', type: 'area', rows: 2, hint: RICH_HINT },
      { key: 'sub', label: 'Linha de apoio', type: 'area', rows: 2 },
    ],
    draw: coverCard,
  },
  text: {
    label: 'Texto',
    group: 'Conteúdo',
    description: 'Parágrafos e um destaque com barra lateral.',
    fields: [
      { key: 'eyebrow', label: 'Chapéu', type: 'text' },
      { key: 'headline', label: 'Título', type: 'area', rows: 2, hint: RICH_HINT },
      { key: 'body', label: 'Parágrafos', type: 'area', rows: 7, hint: 'Linha em branco separa parágrafos.' },
      { key: 'sub', label: 'Destaque', type: 'area', rows: 2, hint: 'Opcional — vira a caixa com barra azul.' },
    ],
    draw: contentText,
  },
  list: {
    label: 'Lista',
    group: 'Conteúdo',
    description: 'Itens numerados em serifada, separados por réguas.',
    fields: [
      { key: 'eyebrow', label: 'Chapéu', type: 'text' },
      { key: 'headline', label: 'Título', type: 'area', rows: 2, hint: RICH_HINT },
      { key: 'items', label: 'Itens', type: 'text' },
    ],
    draw: contentList,
  },
  quote: {
    label: 'Destaque',
    group: 'Conteúdo',
    description: 'Citação serifada e, opcionalmente, um bloco de código.',
    fields: [
      { key: 'eyebrow', label: 'Chapéu', type: 'text' },
      { key: 'headline', label: 'Citação', type: 'area', rows: 3 },
      { key: 'codeLabel', label: 'Nome do arquivo', type: 'text', hint: 'Opcional.' },
      { key: 'code', label: 'Código', type: 'area', rows: 5, hint: 'Opcional. Linhas com # ficam apagadas; números ganham o azul.' },
    ],
    draw: contentQuote,
  },
}

export const TEMPLATE_IDS = Object.keys(TEMPLATES) as TemplateId[]

export function isCover(template: TemplateId): boolean {
  return TEMPLATES[template].group === 'Capa'
}

export function drawSlide(
  ctx: CanvasRenderingContext2D,
  slide: Slide,
  meta: DeckMeta,
  env: DrawEnv,
) {
  ctx.save()
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.letterSpacing = '0px'
  TEMPLATES[slide.template].draw(ctx, slide, meta, env)
  ctx.restore()
}

// ------------------------------------------------------------- defaults ----

let counter = 0
export function newSlideId(): string {
  counter += 1
  return `s${Date.now().toString(36)}${counter}`
}

export function emptySlide(template: TemplateId): Slide {
  return {
    id: newSlideId(),
    template,
    eyebrow: '',
    headline: '',
    sub: '',
    body: '',
    items: [
      { title: '', description: '' },
      { title: '', description: '' },
      { title: '', description: '' },
    ],
    codeLabel: '',
    code: '',
  }
}

/** A short deck that shows each family of template doing its job. */
export function starterDeck(): Slide[] {
  return [
    {
      ...emptySlide('cover-serif'),
      eyebrow: 'ENGENHARIA DE IA',
      headline: 'RAG não é só <em>embedding</em> + busca',
      sub: 'Três coisas que quebram a recuperação quando o índice sai do notebook e vai pra produção.',
    },
    {
      ...emptySlide('text'),
      eyebrow: 'CONTEXTO',
      headline: 'Por que o retrieval falha',
      body:
        'O protótipo funciona porque a base tem 200 documentos e as perguntas são as que você mesmo escreveu. Nenhum dos dois sobrevive ao primeiro usuário real.\n\n' +
        'Em produção o problema quase nunca é o modelo — é o que chega até ele. Chunk errado, ranking ingênuo e zero avaliação.',
      sub: 'Recuperar o trecho certo é 80% do trabalho.',
    },
    {
      ...emptySlide('list'),
      eyebrow: 'NA PRÁTICA',
      headline: 'Três ajustes que resolvem',
      items: [
        { title: 'Chunking semântico', description: 'Corte por estrutura do documento, não por contagem fixa de tokens.' },
        { title: 'Reranking', description: 'Recupere largo com o vetor, depois reordene com um cross-encoder.' },
        { title: 'Avaliação contínua', description: 'Um golden set pequeno detecta regressão antes do usuário.' },
      ],
    },
    {
      ...emptySlide('quote'),
      eyebrow: 'O PONTO',
      headline: 'Um bom retrieval deixa qualquer modelo parecer inteligente.',
      codeLabel: 'retrieve.py',
      code: '# recupera largo, entrega estreito\nhits = index.search(q, k=50)\ntop  = reranker.rank(q, hits)[:5]',
    },
  ]
}
