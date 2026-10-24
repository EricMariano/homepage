import test from "node:test";
import assert from "node:assert/strict";
import {
  ARTWORK_ROTATION_MS as interval,
  getArtworkIndex,
  getArtworkRotationDelay,
  subscribeArtworkRotation,
} from "../src/lib/artwork-rotation.ts";

test("keeps a painting for 30 seconds and changes exactly at the boundary", () => {
  assert.equal(interval, 30_000);
  assert.equal(getArtworkIndex(0, 3), 0);
  assert.equal(getArtworkIndex(interval - 1, 3), 0);
  assert.equal(getArtworkIndex(interval, 3), 1);
  assert.equal(getArtworkIndex(2 * interval, 3), 2);
  assert.equal(getArtworkIndex(3 * interval, 3), 0);
});

test("uses the same painting across reloads and days without restarting the cycle", () => {
  const time = Date.UTC(2026, 9, 24, 23, 59, 59, 999);
  const index = getArtworkIndex(time, 3);
  assert.equal(getArtworkIndex(time + 3 * interval, 3), index);
  assert.equal(getArtworkIndex(time + 1, 3), (index + 1) % 3);
  assert.equal(getArtworkIndex(time + 1, 1), 0);
  assert.throws(() => getArtworkIndex(time, 0), RangeError);
});

test("cycles through all five selected works before repeating", () => {
  const indexes = [0, 1, 2, 3, 4, 5, 6].map((slot) => getArtworkIndex(slot * interval, 5));
  assert.deepEqual(indexes, [0, 1, 2, 3, 4, 0, 1]);
});

test("schedules the next boundary, including when already on a boundary", () => {
  assert.equal(getArtworkRotationDelay(0), interval);
  assert.equal(getArtworkRotationDelay(interval - 1), 1);
  assert.equal(getArtworkRotationDelay(interval), interval);
  assert.equal(getArtworkRotationDelay(interval + 10_000), interval - 10_000);
});

test("catches up after a sleeping tab and removes timers and event listeners", () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  const originalNow = Date.now;
  const originalSetTimeout = globalThis.setTimeout;
  const originalClearTimeout = globalThis.clearTimeout;
  const windowEvents = new EventTarget();
  const documentEvents = Object.assign(new EventTarget(), { visibilityState: "visible" });
  const timers = new Map();
  let now = interval - 500;
  let nextId = 0;
  let changes = 0;
  let unsubscribe;

  try {
    globalThis.window = windowEvents;
    globalThis.document = documentEvents;
    Date.now = () => now;
    globalThis.setTimeout = (callback, delay) => {
      const id = ++nextId;
      timers.set(id, { callback, delay });
      return id;
    };
    globalThis.clearTimeout = (id) => timers.delete(id);

    unsubscribe = subscribeArtworkRotation(() => changes++);
    assert.equal(timers.size, 1);
    assert.equal([...timers.values()][0].delay, 500);

    now = interval;
    [...timers.values()][0].callback();
    assert.equal(changes, 1);
    assert.equal(timers.size, 1);
    assert.equal([...timers.values()][0].delay, interval);

    documentEvents.visibilityState = "hidden";
    documentEvents.dispatchEvent(new Event("visibilitychange"));
    assert.equal(changes, 1);

    now = 4 * interval + 1_234;
    documentEvents.visibilityState = "visible";
    documentEvents.dispatchEvent(new Event("visibilitychange"));
    assert.equal(changes, 2);
    assert.equal(getArtworkIndex(now, 3), 1);
    assert.equal([...timers.values()][0].delay, interval - 1_234);

    windowEvents.dispatchEvent(new Event("focus"));
    windowEvents.dispatchEvent(new Event("pageshow"));
    assert.equal(changes, 4);
    assert.equal(timers.size, 1);

    unsubscribe();
    assert.equal(timers.size, 0);
    windowEvents.dispatchEvent(new Event("focus"));
    documentEvents.dispatchEvent(new Event("visibilitychange"));
    assert.equal(changes, 4);
  } finally {
    unsubscribe?.();
    Date.now = originalNow;
    globalThis.setTimeout = originalSetTimeout;
    globalThis.clearTimeout = originalClearTimeout;
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else delete globalThis.window;
    if (originalDocument) Object.defineProperty(globalThis, "document", originalDocument);
    else delete globalThis.document;
  }
});
