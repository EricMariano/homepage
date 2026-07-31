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
        title: "Chat Policy",
        description: {
            pt: "Chatbot baseado em RAG para gestão de políticas",
            en: "Rag based chatbot for policy management",
        },
        status: { pt: "concluído", en: "done" },
        link: "https://github.com/EricMariano/chat-policy-backend"
    },
    {
        title: "HackHub",
        description: {
            pt: "Aplicação para gestão de hackathons",
            en: "Hackathon management app",
        },
        status: { pt: "concluído", en: "done" },
        link: "https://hackhub-mocha.vercel.app/"
    },
    {
        title: "MeuBolso (mypocket)",
        description: {
            pt: "Sistema de gestão de finanças pessoais",
            en: "Personal finance management system",
        },
        status: { pt: "refatorando", en: "refactoring" },
        link: "https://github.com/EricMariano/trackmymoney-front.git"
    },
    {
        title: "Cakefy",
        description: {
            pt: "Aplicação para gestão de uma confeitaria",
            en: "Application for managing a confectionery business",
        },
        status: { pt: "pausado", en: "paused" },
        link: "https://github.com/EricMariano/gestao-de-confeitaria-v2"
    },
    {
        title: "Brasileirão",
        description: {
            pt: "Simulador do campeonato brasileiro de futebol",
            en: "Brazilian football championship simulator",
        },
        status: { pt: "meu primeiro projeto", en: "my first project" },
        link: "https://github.com/EricMariano/SimuladorBrasileirao"
    },
];
