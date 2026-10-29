import type { Locale } from "@/i18n/config";

type Localized = Record<Locale, string>;

export interface Project {
    title: string;
    description: Localized;
    status?: Localized;
    link: string;
}

export const projects: Project[] = [
    {
        title: "Conversa Lens",
        description: {
            pt: "Análise de conversas de atendimento em português com Jev, LLMs e sinais de voz",
            en: "Portuguese customer service conversation analysis with Jev, LLMs, and voice signals",
        },
        link: "https://github.com/EricMariano/conversa-lens"
    },
    {
        title: "jev-lanes",
        description: {
            pt: "Controle de chamadas de ferramentas em agentes LangGraph por intenção e confiança com Jev",
            en: "Intent and confidence gating for LangGraph agent tool calls with Jev",
        },
        link: "https://github.com/EricMariano/jev-lanes"
    },
    {
        title: "Chat Policy",
        description: {
            pt: "API RAG em NestJS para consultar documentos de políticas com OpenAI e Pinecone",
            en: "NestJS RAG API for querying policy documents with OpenAI and Pinecone",
        },
        status: { pt: "concluído", en: "done" },
        link: "https://github.com/EricMariano/chat-policy-backend"
    },
];
