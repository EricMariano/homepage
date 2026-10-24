import type { StaticImageData } from "next/image";
import type { Locale } from "@/i18n/config";
import rockyMountains from "../../public/artwork/rocky-mountains-bierstadt-1863.jpg";
import thunderStorm from "../../public/artwork/approaching-thunder-storm-heade-1859.jpg";
import parthenon from "../../public/artwork/parthenon-church-1871.jpg";
import schlossMilkel from "../../public/artwork/schloss-milkel-carus-1833-1835.jpg";
import mountainMorning from "../../public/artwork/morning-on-the-mountain-hubbard-1856.jpg";

interface GalleryArtwork {
  id: string;
  image: StaticImageData;
  title: string;
  year: string;
  artist: string;
  source: string;
  alt: Record<Locale, string>;
}

export const artworks: readonly GalleryArtwork[] = [
  {
    id: "rocky-mountains-bierstadt-1863",
    image: rockyMountains,
    title: "The Rocky Mountains, Lander's Peak",
    year: "1863",
    artist: "Albert Bierstadt",
    source: "https://www.metmuseum.org/art/collection/search/10154",
    alt: {
      en: "The Rocky Mountains, Lander's Peak by Albert Bierstadt: a mountain valley with a lake, waterfall, and a camp in the foreground.",
      pt: "The Rocky Mountains, Lander’s Peak, de Albert Bierstadt: um vale entre montanhas, com lago, cachoeira e um acampamento em primeiro plano.",
    },
  },
  {
    id: "approaching-thunder-storm-heade-1859",
    image: thunderStorm,
    title: "Approaching Thunder Storm",
    year: "1859",
    artist: "Martin Johnson Heade",
    source: "https://www.metmuseum.org/art/collection/search/11050",
    alt: {
      en: "Approaching Thunder Storm by Martin Johnson Heade: a white sailboat and a fisherman beneath dark storm clouds along the shore.",
      pt: "Approaching Thunder Storm, de Martin Johnson Heade: um veleiro branco e um pescador à beira da água sob nuvens escuras de tempestade.",
    },
  },
  {
    id: "parthenon-church-1871",
    image: parthenon,
    title: "The Parthenon",
    year: "1871",
    artist: "Frederic Edwin Church",
    source: "https://www.metmuseum.org/art/collection/search/10482",
    alt: {
      en: "The Parthenon by Frederic Edwin Church: the ancient temple and scattered stone columns illuminated by warm afternoon light.",
      pt: "The Parthenon, de Frederic Edwin Church: o templo antigo e fragmentos de colunas iluminados pela luz quente da tarde.",
    },
  },
  {
    id: "schloss-milkel-carus-1833-1835",
    image: schlossMilkel,
    title: "Schloss Milkel in Moonlight",
    year: "ca. 1833–35",
    artist: "Carl Gustav Carus",
    source: "https://www.metmuseum.org/art/collection/search/788905",
    alt: {
      en: "Schloss Milkel in Moonlight by Carl Gustav Carus: a castle with a glowing window behind trees under a moonlit sky.",
      pt: "Schloss Milkel in Moonlight, de Carl Gustav Carus: um castelo com uma janela iluminada entre árvores sob o luar.",
    },
  },
  {
    id: "morning-on-the-mountain-hubbard-1856",
    image: mountainMorning,
    title: "Morning on the Mountain",
    year: "1856",
    artist: "Richard William Hubbard",
    source: "https://www.metmuseum.org/art/collection/search/11170",
    alt: {
      en: "Morning on the Mountain by Richard William Hubbard: trees and rocks above a misty valley in soft golden morning light.",
      pt: "Morning on the Mountain, de Richard William Hubbard: árvores e rochas acima de um vale com névoa sob a luz dourada da manhã.",
    },
  },
];
