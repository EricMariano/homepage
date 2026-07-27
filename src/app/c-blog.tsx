import type { Post } from "@/lib/posts"
import { fill, type Dictionary } from "@/i18n"
import type { Locale } from "@/i18n/config"

interface BlogProps {
  locale: Locale
  dict: Dictionary["blog"]
  posts: Post[]
}

export function Blog({ locale, dict, posts }: BlogProps) {
  const displayedPosts = posts.slice(0, 6)
  const hasMorePosts = posts.length > 6

  return (
    <div className="flex flex-col items-start gap-2 pb-8" aria-labelledby="blog-heading">
      <div className="flex justify-between items-center w-full">
        <h1 className="text-sm text-[#A3A3A3] pb-2.5">{dict.heading}</h1>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-[#737377]">{dict.emptyLead} <code className="text-xs">{dict.emptyPath}</code>.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-40 gap-y-10 w-full" role="list" aria-label={dict.listLabel}>
            {displayedPosts.map((post) => (
              <article key={post.slug} className="flex flex-col gap-1" role="listitem">
                <a
                  href={`/${locale}/posts/${post.slug}`}
                  className="hover:text-[#737377] transition-all duration-300 ease-in-out group flex items-center gap-2"
                  aria-label={fill(dict.itemLabel, { title: post.title, excerpt: post.excerpt })}
                >
                  <span className="text-sm text-[#737377]">{post.title}</span>
                </a>
                <p className="text-xs text-[#A3A3A3]">{post.excerpt}</p>
              </article>
            ))}
          </div>

          {hasMorePosts && (
            <div className="pt-2">
              <a
                href={`/${locale}/blog`}
                className="text-xs text-[#737377] hover:text-gray-900 transition-colors underline underline-offset-2"
              >
                {dict.seeMore}
              </a>
            </div>
          )}
        </>
      )}
    </div>
  )
}
