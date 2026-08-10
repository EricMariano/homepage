import {
  DM_Sans,
  EB_Garamond,
  Fraunces,
  Instrument_Serif,
  Inter,
  Playfair_Display,
  Work_Sans,
} from 'next/font/google'

/**
 * Shared so the layout can register the faces and the post builder can hand the
 * generated family names to canvas — `ctx.font` needs a real family string, not
 * the CSS variable.
 *
 * The alternates exist only for the slide templates to pick from, so they skip
 * preloading; `document.fonts.load()` pulls one in when it is actually chosen.
 * Every serif here carries a true italic, which the headline accent uses.
 */
export const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  preload: false,
})

const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  preload: false,
})

const garamond = EB_Garamond({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  preload: false,
})

const dmSans = DM_Sans({ subsets: ['latin'], style: ['normal', 'italic'], preload: false })

const workSans = Work_Sans({ subsets: ['latin'], style: ['normal', 'italic'], preload: false })

export interface FontChoice {
  id: string
  label: string
  family: string
}

/** Headlines, numerals and pull quotes. */
export const SERIF_CHOICES: FontChoice[] = [
  { id: 'instrument', label: 'Instrument', family: instrumentSerif.style.fontFamily },
  { id: 'playfair', label: 'Playfair', family: playfair.style.fontFamily },
  { id: 'fraunces', label: 'Fraunces', family: fraunces.style.fontFamily },
  { id: 'garamond', label: 'Garamond', family: garamond.style.fontFamily },
]

/** Body copy, eyebrows and the footer. */
export const SANS_CHOICES: FontChoice[] = [
  { id: 'inter', label: 'Inter', family: inter.style.fontFamily },
  { id: 'dm', label: 'DM Sans', family: dmSans.style.fontFamily },
  { id: 'work', label: 'Work Sans', family: workSans.style.fontFamily },
]
