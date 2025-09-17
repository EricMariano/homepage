export interface Project {
    title: string;
    description: string;
    link: string;
}

export const projects: Project[] = [
    {
        title: "Cakefy",
        description: "Aplicação para gerenciamento de pedidos de bolos",
        link: "https://github.com/EricMariano/gestao-de-confeitaria-v2"
    },
    {
        title: "Simulador Brasileirão",
        description: "Simulador de campeonato brasileiro de futebol",
        link: "https://github.com/EricMariano/SimuladorBrasileirao"
    },
    {
        title: "ERP-Personal Trainer",
        description: "Sistema de gestão para personal trainers",
        link: "https://github.com/ericmariano/erp-personal-trainer"
    },
    {
        title: "Residência II",
        description: "Projeto desenvolvido durante residência em software",
        link: "https://github.com/EricMariano/residencia-II"
    }
];
