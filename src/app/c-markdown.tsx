import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

/**
 * Renders post bodies. The styling lives here rather than in globals.css so the
 * prose keeps matching the rest of the site (serif headings, warm greys) without
 * a plugin pulling in its own opinions.
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="flex w-full flex-col gap-4 font-sans text-[15px] leading-[1.7] text-[#33312A]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className="mt-4 font-instrument-serif text-2xl md:text-3xl">{children}</h2>
          ),
          h2: ({ children }) => (
            <h2 className="mt-4 font-instrument-serif text-xl md:text-2xl">{children}</h2>
          ),
          h3: ({ children }) => <h3 className="mt-3 text-base font-medium">{children}</h3>,
          p: ({ children }) => <p>{children}</p>,
          a: ({ href, children }) => (
            <a
              href={href}
              className="underline underline-offset-2 transition-colors hover:text-[#1B475E]"
              {...(href?.startsWith('http')
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="flex list-disc flex-col gap-1 pl-5 marker:text-[#8A8578]">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="flex list-decimal flex-col gap-1 pl-5 marker:text-[#8A8578]">
              {children}
            </ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[#C9C2AC] pl-4 text-[#66625A] italic">
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
              <code className="rounded bg-[#DCD6C2] px-1 py-0.5 font-mono text-[13px]">
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-lg bg-[#33312A] p-4 text-[#EDE8D8]">
              {children}
            </pre>
          ),
          hr: () => <hr className="my-2 border-[#C9C2AC]" />,
          table: ({ children }) => (
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-[#C9C2AC] px-2 py-1 text-left font-medium">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-[#DCD6C2] px-2 py-1 align-top">{children}</td>
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
