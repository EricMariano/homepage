import { Header } from "./c-header";
import { Projects } from "./c-projects";
import { Footer } from "./c-footer";

export default function Home() {
  return (
    <div 
      className="flex h-full min-h-screen w-full md:flex-col md:items-center"
      suppressHydrationWarning
    >
      <div className="mx-6 flex h-full min-h-screen w-full flex-col sm:mx-0 sm:w-[30rem] md:w-[40rem]">
        <div className="flex items-center justify-between pt-16 sm:pb-4 sm:pt-20">
          <Header />
        </div>
        <main 
          id="main-content"
          className="flex flex-col gap-[32px] row-start-2 items-start"
          role="main"
          aria-label="Conteúdo principal"
        >
          <section id="projects" aria-labelledby="projects-heading">
            <Projects />
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
