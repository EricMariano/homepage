export const en = {
  metadata: {
    title: "Eric Mariano - Software Engineer & Developer",
    titleTemplate: "%s | Eric Mariano",
    description:
      "Software Engineer and Computer Science student at Universidade Tiradentes. Specialized in JavaScript, Python, AI, and full-stack development. Explore my projects and connect with me.",
    shortDescription:
      "Software Engineer and Computer Science student at Universidade Tiradentes. Specialized in JavaScript, Python, AI, and full-stack development.",
    keywords: [
      "Eric Mariano",
      "Software Engineer",
      "Developer",
      "JavaScript",
      "Python",
      "AI",
      "Machine Learning",
      "Full Stack",
      "React",
      "Next.js",
      "Computer Science",
      "Universidade Tiradentes",
      "Portfolio",
      "Projects",
      "Web Development",
    ],
    ogImageAlt: "Eric Mariano - Software Engineer & Developer",
  },
  a11y: {
    mainContent: "Main content",
  },
  header: {
    photoAlt: "Portrait of Eric Mariano",
    name: "Eric Mariano",
    connectLabel: "Find me elsewhere",
    bio: {
      heading: "Bio",
      shortLabel: "Short",
      longLabel: "Long",
      lengthLabel: "Biography length",
      short: [
        "I’m an AI and software engineer specialized in LLMs, RAG, and AI agents, with a solid full-stack foundation in TypeScript, Python, React, and Node.js.",
        "I’ve led a team of 6 building an AI-first SaaS at Novasce, designed a multimodal GraphRAG architecture at the Virtual Humans Lab (PUCRS), and I study Computer Science at Universidade Tiradentes (UNIT). I’ve published 2 papers on RAG and virtual agents, presented at SIBGRAPI 2026.",
      ],
      long: {
        intro: [
          "AI and software engineer with 2+ years in technology, specialized in LLMs, RAG, and AI agents, with a solid foundation in full-stack development (TypeScript, Python, React, Node.js). Since starting my journey at Universidade Tiradentes (UNIT) in 2024, I’ve worked across startups, scientific research, and enterprise products, moving from building interfaces to architecting systems and leading teams.",
        ],
        highlights: [
          "Improved accuracy by 10%+ over conventional RAG at the Virtual Humans Lab (PUCRS), by designing a multimodal GraphRAG architecture in Python running on locally served open-weight models.",
          "Shipped a production RAG system for querying internal policies in natural language, by building the full pipeline: upload, chunking, async embeddings (BullMQ + Redis), and versioned indexing in Pinecone.",
          "Reached 92% accuracy in real-time sentiment analysis for customer service, by fine-tuning BERT models and serving inferences through a FastAPI backend.",
          "Made enterprise AI safe to adopt, by implementing per-department permissions, per-profile data isolation, token tracking, and connecting the system to agents and Microsoft Teams through an MCP server and a Bot Framework bot.",
          "Led a team of 6 building an AI-first SaaS at Novasce, with AI agents integrated into WhatsApp, mobile, and web, increasing delivery productivity by 60%+ through standardized processes and technical onboarding.",
          "Architected a multi-tenant ERP for condominium back-office and finance, with banking API integrations (Itaú, DelBank), and built a customer service across VoIP, email, and WhatsApp in a single module.",
        ],
        outro: [
          "Published 2 papers on RAG and virtual agents, presented at SIBGRAPI 2026.",
          "Currently pursuing a Bachelor’s in Computer Science at UNIT. Native Portuguese; intermediate English.",
          "I want to build AI products that solve real problems, and I care just as much about how they’re built: clear architecture, secure and measurable systems, and teams that share knowledge openly. My next step is growing as an AI Engineer, taking LLM systems from research to production at scale.",
        ],
        stackHeading: "Tech stack",
        stack: [
          { label: "AI", items: "LangChain, LangGraph, LightRAG, OpenAI, Claude, Ollama, Pinecone, MCP, HuggingFace" },
          { label: "Backend", items: "Python, TypeScript, FastAPI, NestJS, Prisma, BullMQ, Socket.IO" },
          { label: "Data & Infra", items: "PostgreSQL, Redis, MinIO, Docker, AWS Lambda, CI/CD" },
          { label: "Frontend & Mobile", items: "Next.js, React, React Native, Swift" },
        ],
      },
    },
    github: { tooltip: "Star me on GitHub", label: "Eric Mariano's GitHub" },
    linkedin: { tooltip: "Follow me on LinkedIn", label: "Eric Mariano's LinkedIn" },
    x: { tooltip: "Follow me on X", label: "Eric Mariano's X (Twitter)" },
    email: { tooltip: "Send me an email", label: "Send an email to Eric Mariano" },
    language: { tooltip: "Ler em português", label: "Ler este site em português" },
  },
  projects: {
    heading: "Projects",
    listLabel: "Project list",
    itemLabel: "Visit project {title}: {description}",
  },
  blog: {
    heading: "Writing",
    listLabel: "Post list",
    emptyLead: "A few thoughts will find their way here soon.",
    seeMore: "See more...",
    itemLabel: "Read post {title}: {excerpt}",
  },
  post: {
    back: "Back",
    backLabel: "Back to the home page",
    notFound: "Post not found",
  },
  footer: {
    text: "developed by eric mariano",
  },
  artwork: {
    heading: "Selected artwork",
    publicDomain: "Public domain",
  },
};

export type Dictionary = typeof en;
