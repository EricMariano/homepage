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
        title: "HackHub",
        description: "Hackathon management app",
        status: "(done)",
        link: "https://hackhub-mocha.vercel.app/pt"
    },
    {
        title: "MeuBolso(mypocket)",
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
