export interface Project {
    title: string;
    description: string;
    status?: string; 
    link: string;
}

export const projects: Project[] = [
    {
        title: "Chat Policy",
        description: "Rag based chatbot for policy management",
        status: "(done)",
        link: "https://github.com/EricMariano/chat-policy-backend"
    },
    {
        title: "Hackathon API",
        description: "API for hackathon management",
        status: "(done)",
        link: "https://github.com/EricMariano/hackathon-api.git"
    },
    {
        title: "MeuBolso",
        description: "Personal finance management system",
        status: "(refactoring)",
        link: "https://github.com/EricMariano/trackmymoney-front.git"
    },
    {
        title: "Cakefy",
        description: "Application for managing a confectionery business",
        status: "(paused)",
        link: "https://github.com/EricMariano/gestao-de-confeitaria-v2"
    },
    {
        title: "Brasileirão",
        description: "Brazilian football championship simulator",
        status: "(my first project)",
        link: "https://github.com/EricMariano/SimuladorBrasileirao"
    },
];
