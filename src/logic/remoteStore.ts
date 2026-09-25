// Mirrors settings and progress to the Node server, which keeps them in a
// file. The browser's localStorage is still used, so the app opens instantly
// and works when served from static hosting where there is no server: there
// the fetch fails and everything just stays local.

const URL = 'api/store'; // relative, so it works under any base path

export interface RemoteStore {
  settings?: unknown;
  progress?: unknown;
}

export async function loadRemote(): Promise<RemoteStore | null> {
  try {
    const res = await fetch(URL, { cache: 'no-store' });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    return data && typeof data === 'object' ? (data as RemoteStore) : null;
  } catch {
    return null;
  }
}

let pending: RemoteStore = {};
let timer: ReturnType<typeof setTimeout> | undefined;
let available = true;

/** Coalesces rapid changes (each bead tap) into one write. */
export function saveRemote(patch: RemoteStore) {
  if (!available) return;
  pending = { ...pending, ...patch };
  clearTimeout(timer);
  timer = setTimeout(flush, 400);
}

async function flush() {
  const body = JSON.stringify(pending);
  pending = {};
  try {
    const res = await fetch(URL, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body, keepalive: true });
    if (res.status === 404) available = false; // static hosting: stop trying
  } catch {
    // offline for a moment; the next change will try again
  }
}

/** Send anything still waiting before the page goes away. */
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && timer) {
      clearTimeout(timer);
      void flush();
    }
  });
}
