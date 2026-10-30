import type { Dictionary } from "./en";

export const pt: Dictionary = {
  metadata: {
    title: "Eric Mariano - Engenheiro de Software & Desenvolvedor",
    titleTemplate: "%s | Eric Mariano",
    description:
      "Engenheiro de Software e estudante de Ciência da Computação na Universidade Tiradentes. Pesquisador pelo INCT-SiMAI (VHLab).Especializado em JavaScript, Python, IA e desenvolvimento full-stack.",
    shortDescription:
      "Engenheiro de Software e estudante de Ciência da Computação na Universidade Tiradentes. Especializado em JavaScript, Python, IA e desenvolvimento full-stack.",
    keywords: [
      "Eric Mariano",
      "Engenheiro de Software",
      "Desenvolvedor",
      "JavaScript",
      "Python",
      "IA",
      "Inteligência Artificial",
      "Machine Learning",
      "Full Stack",
      "React",
      "Next.js",
      "Ciência da Computação",
      "Universidade Tiradentes",
      "Portfólio",
      "Projetos",
      "Desenvolvimento Web",
    ],
    ogImageAlt: "Eric Mariano - Engenheiro de Software & Desenvolvedor",
  },
  a11y: {
    mainContent: "Conteúdo principal",
  },
  header: {
    photoAlt: "Foto de Eric Mariano",
    name: "Eric Mariano",
    connectLabel: "Encontre-me em outros lugares",
    bio: {
      heading: "Bio",
      shortLabel: "Resumida",
      longLabel: "Completa",
      lengthLabel: "Tamanho da biografia",
      short: [
        "Sou engenheiro de IA e de software, especializado em LLMs, RAG e agentes de IA, com uma base sólida em desenvolvimento full-stack (TypeScript, Python, React e Node.js).",
        "Liderei um time de 6 pessoas na construção de um SaaS AI-first na Novasce, projetei uma arquitetura GraphRAG multimodal no Virtual Humans Lab (PUCRS) e curso Ciência da Computação na Universidade Tiradentes (UNIT). Publiquei 2 artigos sobre RAG e agentes virtuais, apresentados no SIBGRAPI 2026.",
      ],
      long: {
        intro: [
          "Engenheiro de IA e de software com mais de 2 anos em tecnologia, especializado em LLMs, RAG e agentes de IA, com uma base sólida em desenvolvimento full-stack (TypeScript, Python, React, Node.js). Desde que comecei minha jornada na Universidade Tiradentes (UNIT), em 2024, atuei em startups, pesquisa científica e produtos corporativos, passando da construção de interfaces para a arquitetura de sistemas e a liderança de times.",
        ],
        highlights: [
          "Aumentei a acurácia em mais de 10% em relação ao RAG convencional no Virtual Humans Lab (PUCRS), projetando uma arquitetura GraphRAG multimodal em Python executada sobre modelos open-weight servidos localmente.",
          "Coloquei em produção um sistema RAG para consultar políticas internas em linguagem natural, construindo o pipeline completo: upload, chunking, embeddings assíncronos (BullMQ + Redis) e indexação versionada no Pinecone.",
          "Alcancei 92% de acurácia em análise de sentimento em tempo real para atendimento ao cliente, fazendo fine-tuning de modelos BERT e servindo as inferências por um backend em FastAPI.",
          "Tornei a adoção de IA corporativa segura, implementando permissões por departamento, isolamento de dados por perfil e rastreamento de tokens, e conectando o sistema a agentes e ao Microsoft Teams por meio de um servidor MCP e de um bot com Bot Framework.",
          "Liderei um time de 6 pessoas na construção de um SaaS AI-first na Novasce, com agentes de IA integrados ao WhatsApp, mobile e web, aumentando a produtividade das entregas em mais de 60% com processos padronizados e onboarding técnico.",
          "Arquitetei um ERP multi-tenant para backoffice e financeiro de condomínios, com integrações a APIs bancárias (Itaú, DelBank), e construí um atendimento ao cliente por VoIP, e-mail e WhatsApp em um único módulo.",
        ],
        outro: [
          "Publiquei 2 artigos sobre RAG e agentes virtuais, apresentados no SIBGRAPI 2026.",
          "Atualmente curso Bacharelado em Ciência da Computação na UNIT. Português nativo; inglês intermediário.",
          "Quero construir produtos de IA que resolvam problemas reais, e me importo na mesma medida com a forma como são construídos: arquitetura clara, sistemas seguros e mensuráveis, e times que compartilham conhecimento abertamente. Meu próximo passo é crescer como AI Engineer, levando sistemas de LLM da pesquisa à produção em escala.",
        ],
        stackHeading: "Stack técnica",
        stack: [
          { label: "IA", items: "LangChain, LangGraph, LightRAG, OpenAI, Claude, Ollama, Pinecone, MCP, HuggingFace" },
          { label: "Backend", items: "Python, TypeScript, FastAPI, NestJS, Prisma, BullMQ, Socket.IO" },
          { label: "Dados & Infra", items: "PostgreSQL, Redis, MinIO, Docker, AWS Lambda, CI/CD" },
          { label: "Frontend & Mobile", items: "Next.js, React, React Native, Swift" },
        ],
      },
    },
    github: { tooltip: "Me dê uma estrela no GitHub", label: "GitHub do Eric Mariano" },
    linkedin: { tooltip: "Me siga no LinkedIn", label: "LinkedIn do Eric Mariano" },
    x: { tooltip: "Me siga no X", label: "X (Twitter) do Eric Mariano" },
    email: { tooltip: "Me mande um email", label: "Enviar email para Eric Mariano" },
    language: { tooltip: "Read in English", label: "Ler este site em inglês" },
  },
  projects: {
    heading: "Projetos",
    listLabel: "Lista de projetos",
    itemLabel: "Visitar projeto {title}: {description}",
  },
  blog: {
    heading: "Escritos",
    listLabel: "Lista de posts",
    emptyLead: "Em breve, algumas ideias vão encontrar seu lugar por aqui.",
    seeMore: "Ver mais...",
    itemLabel: "Ler post {title}: {excerpt}",
  },
  post: {
    back: "Voltar",
    backLabel: "Voltar para a página inicial",
    notFound: "Post não encontrado",
  },
  footer: {
    text: "desenvolvido por eric mariano",
  },
  artwork: {
    heading: "Obra em destaque",
    publicDomain: "Domínio público",
  },
};
