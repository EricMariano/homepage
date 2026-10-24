"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import { artworks } from "@/lib/artworks";
import { getArtworkIndex, subscribeArtworkRotation } from "@/lib/artwork-rotation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";

function getSnapshot() {
  return getArtworkIndex(Date.now(), artworks.length);
}

function getServerSnapshot() {
  return 0;
}

export function Artwork({ dict, locale }: { dict: Dictionary["artwork"]; locale: Locale }) {
  const index = useSyncExternalStore(subscribeArtworkRotation, getSnapshot, getServerSnapshot);
  const artwork = artworks[index];

  return (
    <aside className="artwork-panel" aria-label={dict.heading}>
      <figure className="artwork-figure">
        <Image
          key={artwork.id}
          src={artwork.image}
          alt={artwork.alt[locale]}
          priority
          placeholder="blur"
          sizes="(max-width: 900px) 90vw, (max-width: 1200px) 36vw, 420px"
          className="artwork-image"
        />
        <figcaption className="artwork-caption">
          <div>
            <a href={artwork.source} target="_blank" rel="noopener noreferrer">
              <cite>{artwork.title}</cite>, {artwork.year}
            </a>
            <span>{artwork.artist}</span>
          </div>
          <p>The Metropolitan Museum of Art · {dict.publicDomain}</p>
        </figcaption>
      </figure>
    </aside>
  );
}
