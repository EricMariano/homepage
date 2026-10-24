import { Link } from "next-view-transitions"
import type { Post } from "@/lib/posts"
import { fill, type Dictionary } from "@/i18n"
import type { Locale } from "@/i18n/config"
import { ArrowUpRight } from "lucide-react"

interface BlogProps {
  locale: Locale
  dict: Dictionary["blog"]
  posts: Post[]
}

export function Blog({ locale, dict, posts }: BlogProps) {
  const displayedPosts = posts.slice(0, 6)
  const hasMorePosts = posts.length > 6

  return (
    <div className="section-content" aria-labelledby="blog-heading">
      <div className="section-heading">
        <h2 id="blog-heading">{dict.heading}</h2>
        <span className="section-line" aria-hidden="true" />
        <span className="section-count" aria-hidden="true">{String(posts.length).padStart(2, "0")}</span>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-[#66625A]">{dict.emptyLead} <code className="text-xs">{dict.emptyPath}</code>.</p>
      ) : (
        <>
          <div className="blog-list" role="list" aria-label={dict.listLabel}>
            {displayedPosts.map((post) => (
              <article key={post.slug} role="listitem">
                <Link
                  href={`/${locale}/posts/${post.slug}`}
                  className="blog-link"
                  aria-label={fill(dict.itemLabel, { title: post.title, excerpt: post.excerpt })}
                >
                  <div className="blog-copy">
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                  </div>
                  <span className="card-arrow"><ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" /></span>
                </Link>
              </article>
            ))}
          </div>

          {hasMorePosts && (
            <div className="pt-2">
              <Link
                href={`/${locale}/blog`}
                className="text-xs text-[#66625A] hover:text-[#1B475E] transition-colors underline underline-offset-2"
              >
                {dict.seeMore}
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}
