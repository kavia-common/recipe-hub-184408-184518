<script setup lang="ts">
import { onMounted } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import FiltersPanel from '@/components/FiltersPanel.vue'
import RecipeGrid from '@/components/RecipeGrid.vue'
import PaginatedList from '@/components/PaginatedList.vue'
import { useRecipesStore } from '@/stores/recipes'

const store = useRecipesStore()

onMounted(() => {
  store.fetchAll()
})

function clearFilters() {
  store.filters.query = ''
  store.filters.cuisine = null
  store.filters.difficulty = null
  store.filters.maxTime = null
  store.filters.tags = []
}
</script>

<template>
  <section class="home">
    <div class="hero">
      <div class="hero-content">
        <h1>Discover Delicious Recipes</h1>
        <p class="sub">Browse, search, and manage your favorite dishes.</p>
        <SearchBar v-model="store.filters.query" @submit="() => {}" />
      </div>
    </div>

    <div class="content">
      <aside class="sidebar">
        <FiltersPanel
          :cuisine="store.filters.cuisine"
          :difficulty="store.filters.difficulty"
          :maxTime="store.filters.maxTime"
          :tags="store.filters.tags"
          @update:cuisine="v => store.filters.cuisine = v"
          @update:difficulty="v => store.filters.difficulty = v"
          @update:maxTime="v => store.filters.maxTime = v"
          @update:tags="v => store.filters.tags = v"
          @clear="clearFilters"
        />
      </aside>

      <div class="main">
        <div class="toolbar">
          <div class="info">
            <strong>{{ store.total }}</strong> recipes
            <span v-if="store.mockMode" class="mock">• mock mode</span>
          </div>
          <label class="size">
            <span>Per page</span>
            <select :value="store.pageSize" @change="store.pageSize = Number(($event.target as HTMLSelectElement).value)">
              <option :value="6">6</option>
              <option :value="12">12</option>
              <option :value="24">24</option>
            </select>
          </label>
        </div>

        <RecipeGrid :recipes="store.paged" />
        <PaginatedList v-model:page="store.page" :total-pages="store.totalPages" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  background: linear-gradient(135deg, rgba(59,130,246,0.10), #f9fafb);
  border: 1px solid rgba(17,24,39,0.06);
  border-radius: 16px;
  padding: 1.1rem;
  margin-bottom: 1rem;
  box-shadow: 0 10px 24px rgba(0,0,0,0.04);
}
.hero-content {
  display: grid;
  gap: 0.5rem;
}
h1 {
  margin: 0;
  font-size: 1.6rem;
  color: #111827;
}
.sub {
  color: #4b5563;
}
.content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 1rem;
}
.sidebar {
  position: sticky;
  top: 72px;
  height: fit-content;
}
.main {
  min-height: 300px;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.25rem 0 0.75rem;
}
.info {
  color: #374151;
}
.mock {
  color: #F59E0B;
}
.size {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.size select {
  border: 1px solid rgba(17,24,39,0.12);
  border-radius: 8px;
  padding: 0.2rem 0.4rem;
  background: #fff;
}
@media (max-width: 900px) {
  .content { grid-template-columns: 1fr; }
  .sidebar { position: static; }
}
</style>
