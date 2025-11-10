type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

const FEATURE_FLAGS = (import.meta.env.VITE_FEATURE_FLAGS as string) || ''
const FORCE_MOCK = FEATURE_FLAGS.split(',').map(s => s.trim().toLowerCase()).includes('mock')

const base =
  (import.meta.env.VITE_API_BASE as string) ||
  (import.meta.env.VITE_BACKEND_URL as string) ||
  ''

function makeUrl(path: string) {
  if (!base) return path
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}

async function request<T>(path: string, method: Method = 'GET', body?: unknown): Promise<T> {
  const res = await fetch(makeUrl(path), {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    throw new Error(`API ${method} ${path} failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

let mockIdCounter = 1000
function uid() {
  mockIdCounter += 1
  return String(mockIdCounter)
}

type Recipe = {
  id: string
  title: string
  description: string
  cuisine: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  timeMinutes: number
  tags: string[]
  image?: string
  ingredients?: string[]
  steps?: string[]
}

const mockDb: Recipe[] = []

// PUBLIC_INTERFACE
export const api = {
  /** API client with graceful mock fallback. Set mockMode=true when backend missing or via VITE_FEATURE_FLAGS=mock. */
  mockMode: FORCE_MOCK || !base,

  async getRecipes(): Promise<Recipe[]> {
    if (this.mockMode) return mockDb.slice()
    try {
      return await request<Recipe[]>('/recipes', 'GET')
    } catch {
      // fallback to mock if backend unreachable
      this.mockMode = true
      return mockDb.slice()
    }
  },

  async getRecipe(id: string): Promise<Recipe> {
    if (this.mockMode) {
      const found = mockDb.find(r => r.id === id)
      if (!found) throw new Error('Not found')
      return found
    }
    try {
      return await request<Recipe>(`/recipes/${id}`, 'GET')
    } catch (_e: unknown) {
      this.mockMode = true
      const found = mockDb.find(r => r.id === id)
      if (!found) throw new Error('Not found')
      return found
    }
  },

  async createRecipe(payload: Omit<Recipe, 'id'>): Promise<Recipe> {
    if (this.mockMode) {
      const rec: Recipe = { id: uid(), ...payload }
      mockDb.unshift(rec)
      return rec
    }
    try {
      return await request<Recipe>('/recipes', 'POST', payload)
    } catch (_e: unknown) {
      this.mockMode = true
      const rec: Recipe = { id: uid(), ...payload }
      mockDb.unshift(rec)
      return rec
    }
  },

  async updateRecipe(id: string, payload: Partial<Omit<Recipe, 'id'>>): Promise<Recipe> {
    if (this.mockMode) {
      const idx = mockDb.findIndex(r => r.id === id)
      if (idx < 0) throw new Error('Not found')
      mockDb[idx] = { ...mockDb[idx], ...payload }
      return mockDb[idx]
    }
    try {
      return await request<Recipe>(`/recipes/${id}`, 'PUT', payload)
    } catch (_e: unknown) {
      this.mockMode = true
      const idx = mockDb.findIndex(r => r.id === id)
      if (idx < 0) throw new Error('Not found')
      mockDb[idx] = { ...mockDb[idx], ...payload }
      return mockDb[idx]
    }
  },

  async deleteRecipe(id: string): Promise<void> {
    if (this.mockMode) {
      const idx = mockDb.findIndex(r => r.id === id)
      if (idx >= 0) mockDb.splice(idx, 1)
      return
    }
    try {
      await request<void>(`/recipes/${id}`, 'DELETE')
    } catch (_e: unknown) {
      this.mockMode = true
      const idx = mockDb.findIndex(r => r.id === id)
      if (idx >= 0) mockDb.splice(idx, 1)
    }
  },
}
