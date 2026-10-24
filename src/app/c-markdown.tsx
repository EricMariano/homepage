import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/**
 * Renders post bodies. Element styles keep post content consistent with the editorial site theme.
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="post-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className="mt-4 font-medium text-2xl md:text-3xl">{children}</h2>
          ),
          h2: ({ children }) => (
            <h2 className="mt-4 font-medium text-xl md:text-2xl">{children}</h2>
          ),
          h3: ({ children }) => <h3 className="mt-3 text-base font-medium">{children}</h3>,
          p: ({ children }) => <p>{children}</p>,
          a: ({ href, children }) => (
            <a
              href={href}
              className="underline underline-offset-2 transition-colors hover:text-[var(--site-ink)]"
              {...(href?.startsWith('http')
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="flex list-disc flex-col gap-1 pl-5 marker:text-[var(--site-muted)]">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="flex list-decimal flex-col gap-1 pl-5 marker:text-[var(--site-muted)]">
              {children}
            </ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[var(--site-rule)] pl-4 text-[var(--site-muted)] italic">
              {children}
            </blockquote>
          ),
          code: ({ className, children }) => {
            // react-markdown only sets a language class on fenced blocks, so an
            // absent className means this is inline code.
            const isBlock = Boolean(className)
            if (isBlock) {
              return (
                <code className="font-mono text-[13px] leading-[1.6]">{children}</code>
              )
            }
            return (
              <code className="rounded bg-white/8 px-1 py-0.5 font-mono text-[13px]">
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-lg bg-black/20 p-4 text-[var(--site-text)]">
              {children}
            </pre>
          ),
          hr: () => <hr className="my-2 border-[var(--site-rule)]" />,
          table: ({ children }) => (
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-[var(--site-rule)] px-2 py-1 text-left font-medium">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-[var(--site-rule)] px-2 py-1 align-top">{children}</td>
          ),
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element -- post images are arbitrary paths, not known at build time
            <img src={typeof src === 'string' ? src : ''} alt={alt ?? ''} className="rounded-lg" />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
