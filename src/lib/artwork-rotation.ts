export const ARTWORK_ROTATION_MS = 30 * 1000;

/** The same 30-second slot is used across reloads, languages and browser tabs. */
export function getArtworkIndex(timestamp: number, count: number): number {
  if (!Number.isInteger(count) || count < 1) throw new RangeError("An artwork is required");
  const slot = Math.floor(timestamp / ARTWORK_ROTATION_MS);
  return ((slot % count) + count) % count;
}

export function getArtworkRotationDelay(timestamp: number): number {
  const elapsed = ((timestamp % ARTWORK_ROTATION_MS) + ARTWORK_ROTATION_MS) % ARTWORK_ROTATION_MS;
  return ARTWORK_ROTATION_MS - elapsed;
}

/** Recheck wall-clock time after sleep rather than letting the interval drift. */
export function subscribeArtworkRotation(notify: () => void): () => void {
  let active = true;
  let timer: ReturnType<typeof setTimeout>;

  function update() {
    if (!active) return;
    clearTimeout(timer);
    notify();
    if (active) timer = setTimeout(update, getArtworkRotationDelay(Date.now()));
  }

  function onVisibilityChange() {
    if (document.visibilityState === "visible") update();
  }

  timer = setTimeout(update, getArtworkRotationDelay(Date.now()));
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("focus", update);
  window.addEventListener("pageshow", update);

  return () => {
    active = false;
    clearTimeout(timer);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("focus", update);
    window.removeEventListener("pageshow", update);
  };
}
