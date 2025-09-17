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
        title: "Central Personal",
        description: "Management system for personal trainers",
        status: "(borning)",
        link: "https://github.com/ericmariano/erp-personal-trainer"
    },
    {
        title: "Residência II",
        description: "AI agent for sentiment analysis made during the software residency",
        link: "https://github.com/EricMariano/residencia-II"
    }
];
