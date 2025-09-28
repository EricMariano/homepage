import { posts } from "./v-posts-list";

export function Blog() {
    return (
        <div className="flex flex-col items-start gap-2 pb-4" aria-labelledby="blog-heading">
            <div className="flex justify-between items-center w-full">
            <h1 className="text-sm text-[#A3A3A3] pb-2.5">Blog</h1>
            </div>
            <div className="grid md:grid-cols-3 grid-rows-1 items-start w-full gap-x-24 gap-y-10" role="list" aria-label="Lista de posts">
                {posts.map((post, index) => (
                    <article key={index} className="flex flex-col gap-1" role="listitem">
                        <a href={post.link} target="_blank" rel="noopener noreferrer" className="hover:text-[#737377] transition-all duration-300 ease-in-out group flex items-center gap-2" aria-label={`Visitar post ${post.title}: ${post.description}`}>
                            <span className="text-sm text-[#737377]">{post.title}</span>
                        </a>
                    </article>
                ))}
            </div>
        </div>
    )
}