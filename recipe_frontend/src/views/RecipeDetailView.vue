<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecipesStore } from '@/stores/recipes'

const route = useRoute()
const router = useRouter()
const store = useRecipesStore()
const loadingLocal = ref(false)

onMounted(async () => {
  const id = String(route.params.id)
  try {
    loadingLocal.value = true
    await store.fetchOne(id)
  } finally {
    loadingLocal.value = false
  }
})

async function onDelete() {
  const id = String(route.params.id)
  const ok = confirm('Delete this recipe?')
  if (!ok) return
  try {
    await store.deleteRecipe(id)
    alert('Deleted successfully')
    router.push('/')
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    alert('Failed to delete: ' + msg)
  }
}
</script>

<template>
  <section v-if="store.items.find(r => r.id === String($route.params.id))" class="detail">
    <header class="head">
      <div>
        <h1 class="title">{{ store.items.find(r => r.id === String($route.params.id))!.title }}</h1>
        <p class="muted">{{ store.items.find(r => r.id === String($route.params.id))!.description }}</p>
      </div>
      <div class="actions">
        <RouterLink :to="`/edit/${$route.params.id}`" class="btn-secondary">Edit</RouterLink>
        <button class="btn-danger" @click="onDelete">Delete</button>
      </div>
    </header>

    <div class="meta">
      <span class="pill">{{ store.items.find(r => r.id === String($route.params.id))!.cuisine }}</span>
      <span class="pill">{{ store.items.find(r => r.id === String($route.params.id))!.difficulty }}</span>
      <span class="pill">{{ store.items.find(r => r.id === String($route.params.id))!.timeMinutes }} min</span>
    </div>

    <img
      v-if="store.items.find(r => r.id === String($route.params.id))!.image"
      class="hero"
      :src="store.items.find(r => r.id === String($route.params.id))!.image"
      :alt="store.items.find(r => r.id === String($route.params.id))!.title"
    />

    <div class="body">
      <div class="section" v-if="store.items.find(r => r.id === String($route.params.id))!.ingredients?.length">
        <h2>Ingredients</h2>
        <ul>
          <li v-for="(i, idx) in store.items.find(r => r.id === String($route.params.id))!.ingredients" :key="idx">{{ i }}</li>
        </ul>
      </div>

      <div class="section" v-if="store.items.find(r => r.id === String($route.params.id))!.steps?.length">
        <h2>Steps</h2>
        <ol>
          <li v-for="(s, idx) in store.items.find(r => r.id === String($route.params.id))!.steps" :key="idx">{{ s }}</li>
        </ol>
      </div>
    </div>
  </section>

  <section v-else class="loading">
    <p v-if="loadingLocal">Loading…</p>
    <p v-else>Recipe not found.</p>
  </section>
</template>

<style scoped>
.detail {
  background: #ffffff;
  border: 1px solid rgba(17,24,39,0.08);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 10px 24px rgba(0,0,0,0.05);
}
.head {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: start;
}
.title {
  margin: 0;
}
.muted {
  color: #4b5563;
}
.actions {
  display: flex;
  gap: 0.5rem;
}
.btn-secondary {
  background: #F59E0B;
  color: #111827;
  border: none;
  border-radius: 10px;
  padding: 0.45rem 0.8rem;
  cursor: pointer;
  text-decoration: none;
}
.btn-danger {
  background: #EF4444;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 0.45rem 0.8rem;
  cursor: pointer;
}
.meta {
  display: flex;
  gap: 0.4rem;
  margin-top: 0.6rem;
  flex-wrap: wrap;
}
.pill {
  font-size: 0.8rem;
  color: #111827;
  background: #F3F4F6;
  border-radius: 999px;
  padding: 0.2rem 0.55rem;
}
.hero {
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: 12px;
  margin-top: 0.8rem;
}
.section {
  margin-top: 1rem;
}
.section h2 {
  margin-bottom: 0.4rem;
}
.loading {
  padding: 2rem 0;
  text-align: center;
}
</style>
