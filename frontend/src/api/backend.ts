/**
 * Which Remiqora backend this UI talks to.
 *
 * By default the UI calls "/api/..." on the server that served it, which is the backend itself
 * (prod_run) or the Vite dev proxy. To run the UI on one machine and the backend on another, point
 * it at the backend's base URL ("http://studio.local:9000"): with ?backend=<url> in the address bar,
 * from the header's backend button, or at build time with VITE_BACKEND_URL. The choice is kept in
 * localStorage; an empty value goes back to same-origin. The backend must allow this UI's origin
 * (REMIQORA_CORS_ORIGINS) when the two are served from different origins.
 */
const STORAGE_KEY = 'remiqora.backendUrl'

function normalise(url: string | null | undefined): string {
  return (url ?? '').trim().replace(/\/+$/, '')
}

function store(url: string): void {
  try {
    if (url) localStorage.setItem(STORAGE_KEY, url)
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Private mode or blocked storage: the choice lasts for this page load only.
  }
}

function initialBackendUrl(): string {
  const fromQuery = new URLSearchParams(window.location.search).get('backend')
  if (fromQuery !== null) {
    const url = normalise(fromQuery)
    store(url)
    return url
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved !== null) return normalise(saved)
  } catch {
    // Fall through to the build-time default.
  }
  return normalise(import.meta.env.VITE_BACKEND_URL)
}

let base = initialBackendUrl()

/** The backend base URL, or '' when the UI uses the server that served it. */
export function backendUrl(): string {
  return base
}

/** Switches backend. Callers reload the page afterwards so every store refetches from the new one. */
export function setBackendUrl(url: string): void {
  base = normalise(url)
  store(base)
}

/** Resolves an "/api/..." path (as built here or returned by the backend) against the chosen backend. */
export function apiUrl<T extends string | null | undefined>(path: T): T {
  if (!base || typeof path !== 'string' || !path.startsWith('/api')) return path
  return `${base}${path}` as T
}
