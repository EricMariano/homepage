import { Inter, Instrument_Serif } from 'next/font/google'

/**
 * Shared so the layout can register the faces and the post builder can hand the
 * generated family names to canvas — `ctx.font` needs a real family string, not
 * the CSS variable.
 */
export const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  // The slide templates set headline accents in italic.
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
})
