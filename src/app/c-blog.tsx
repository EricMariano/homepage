import Link from "next/link";
import type { Post } from "@/lib/posts";
import { fill, type Dictionary } from "@/i18n";
import { htmlLang, type Locale } from "@/i18n/config";

interface BlogProps {
  locale: Locale;
  dict: Dictionary["blog"];
  posts: Post[];
}

export function Blog({ locale, dict, posts }: BlogProps) {
  const displayedPosts = posts.slice(0, 6);

  return (
    <>
      <h2 id="blog-heading" className="section-title">{dict.heading}</h2>
      {posts.length === 0 ? (
        <p className="empty-writing">{dict.emptyLead}</p>
      ) : (
        <ul className="writing-list" aria-label={dict.listLabel}>
          {displayedPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/${locale}/posts/${post.slug}`}
                className="writing-link"
                aria-label={fill(dict.itemLabel, { title: post.title, excerpt: post.excerpt })}
              >
                <span>{post.title}</span>
                {post.publishedAt && (
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString(htmlLang[locale], {
                      month: "short", year: "numeric", timeZone: "UTC",
                    })}
                  </time>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {posts.length > 6 && <Link href={`/${locale}/blog`} className="all-writing">{dict.seeMore}</Link>}
    </>
  );
}
