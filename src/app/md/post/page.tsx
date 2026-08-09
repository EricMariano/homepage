import { instrumentSerif, inter } from '../v-fonts'
import { PostBuilder } from './c-post-builder'

/**
 * Like the markdown editor next door, this never touches the filesystem at
 * runtime — it hands you PNGs — so the route stays static and safe to deploy.
 */
export default function PostBuilderPage() {
  return (
    <PostBuilder
      fonts={{
        serif: instrumentSerif.style.fontFamily,
        sans: inter.style.fontFamily,
      }}
    />
  )
}
