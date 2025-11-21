export interface Project {
    title: string;
    description: string;
    status?: string; 
    link: string;
}

export const projects: Project[] = [
    {
        title: "Cakefy",
        description: "Application for managing a confectionery business",
        status: "(in progress)",
        link: "https://github.com/EricMariano/gestao-de-confeitaria-v2"
    },
    {
        title: "Brasileirão",
        description: "Brazilian football championship simulator",
        status: "(my first project)",
        link: "https://github.com/EricMariano/SimuladorBrasileirao"
    },
    {
        title: "MeuBolso",
        description: "Personal finance management system",
        status: "(coming soon)",
        link: "https://github.com/EricMariano/trackmymoney-front.git"
    },
    {
        title: "Residência II",
        description: "AI agent for sentiment analysis made during the software residency",
        link: "https://github.com/EricMariano/residencia-II"
    }
];
