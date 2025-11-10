import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { api } from '@/services/api'

export type Recipe = {
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

export type Filters = {
  query: string
  cuisine: string | null
  difficulty: string | null
  maxTime: number | null
  tags: string[]
}

const sampleData: Recipe[] = [
  {
    id: '1',
    title: 'Lemon Herb Grilled Salmon',
    description: 'Juicy salmon with zesty lemon and fresh herbs.',
    cuisine: 'Mediterranean',
    difficulty: 'Medium',
    timeMinutes: 30,
    tags: ['seafood', 'grill', 'healthy'],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
    ingredients: ['Salmon fillets', 'Lemon', 'Olive oil', 'Parsley', 'Garlic', 'Salt', 'Pepper'],
    steps: ['Preheat grill', 'Mix marinade', 'Coat salmon', 'Grill 4-5 mins each side', 'Serve']
  },
  {
    id: '2',
    title: 'Classic Margherita Pizza',
    description: 'Crispy crust with tomato, mozzarella, and basil.',
    cuisine: 'Italian',
    difficulty: 'Hard',
    timeMinutes: 90,
    tags: ['baked', 'vegetarian'],
    image: 'https://images.unsplash.com/photo-1548365328-9f547fb61558?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Quick Veggie Stir-Fry',
    description: 'Colorful vegetables tossed in a savory sauce.',
    cuisine: 'Asian',
    difficulty: 'Easy',
    timeMinutes: 20,
    tags: ['quick', 'vegan', 'healthy'],
    image: 'https://images.unsplash.com/photo-1505577058444-a3dab90d4253?q=80&w=1200&auto=format&fit=crop',
  }
]

// PUBLIC_INTERFACE
export const useRecipesStore = defineStore('recipes', () => {
  /** This store manages recipes data, filters and pagination; falls back to mock mode if backend is unavailable. */
  const items = ref<Recipe[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const mockMode = ref(api.mockMode)

  const filters = ref<Filters>({
    query: '',
    cuisine: null,
    difficulty: null,
    maxTime: null,
    tags: []
  })

  const page = ref(1)
  const pageSize = ref(12)

  const filtered = computed(() => {
    let list = items.value.slice()
    const f = filters.value
    if (f.query) {
      const q = f.query.toLowerCase()
      list = list.filter(r => r.title.toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q) || r.tags?.some(t => t.toLowerCase().includes(q)))
    }
    if (f.cuisine) list = list.filter(r => r.cuisine === f.cuisine)
    if (f.difficulty) list = list.filter(r => r.difficulty === f.difficulty)
    if (typeof f.maxTime === 'number') list = list.filter(r => r.timeMinutes <= (f.maxTime as number))
    if (f.tags.length) list = list.filter(r => f.tags.every(t => r.tags?.includes(t)))
    return list
  })

  const total = computed(() => filtered.value.length)
  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
  const paged = computed(() => {
    const start = (page.value - 1) * pageSize.value
    return filtered.value.slice(start, start + pageSize.value)
  })

  watch([filters, pageSize], () => {
    page.value = 1
  }, { deep: true })

  // PUBLIC_INTERFACE
  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const data = await api.getRecipes()
      items.value = data
      mockMode.value = api.mockMode
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load recipes'
      error.value = msg
      if (api.mockMode) {
        // ensure mock data at least
        if (!items.value.length) items.value = sampleData
      }
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  async function fetchOne(id: string) {
    loading.value = true
    error.value = null
    try {
      const data = await api.getRecipe(id)
      const idx = items.value.findIndex(r => r.id === data.id)
      if (idx >= 0) items.value[idx] = data
      else items.value.push(data)
      return data
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load recipe'
      error.value = msg
      if (api.mockMode) {
        const local = items.value.find(r => r.id === id) || sampleData.find(r => r.id === id)
        if (local) return local
      }
      throw new Error(msg)
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  async function createRecipe(payload: Omit<Recipe, 'id'>) {
    try {
      const created = await api.createRecipe(payload)
      items.value.push(created)
      return created
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to create recipe'
      error.value = msg
      throw new Error(msg)
    }
  }

  // PUBLIC_INTERFACE
  async function updateRecipe(id: string, payload: Partial<Omit<Recipe, 'id'>>) {
    try {
      const updated = await api.updateRecipe(id, payload)
      const idx = items.value.findIndex(r => r.id === id)
      if (idx >= 0) items.value[idx] = { ...items.value[idx], ...updated }
      return items.value[idx]
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to update recipe'
      error.value = msg
      throw new Error(msg)
    }
  }

  // PUBLIC_INTERFACE
  async function deleteRecipe(id: string) {
    try {
      await api.deleteRecipe(id)
      items.value = items.value.filter(r => r.id !== id)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to delete recipe'
      error.value = msg
      throw new Error(msg)
    }
  }

  // initialize with mock data if needed
  if (mockMode.value) {
    items.value = sampleData
  }

  return {
    items, filtered, paged, total, totalPages, page, pageSize,
    loading, error, filters, mockMode,
    fetchAll, fetchOne, createRecipe, updateRecipe, deleteRecipe
  }
})
