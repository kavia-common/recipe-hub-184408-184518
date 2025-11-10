<script setup lang="ts">
import RecipeCard from './RecipeCard.vue'
import type { Recipe } from '@/stores/recipes'

defineProps<{
  recipes: Recipe[]
}>()
</script>

<template>
  <section class="grid" aria-label="Recipes">
    <RecipeCard
      v-for="r in recipes"
      :key="r.id"
      :id="r.id"
      :title="r.title"
      :description="r.description"
      :cuisine="r.cuisine"
      :difficulty="r.difficulty"
      :time-minutes="r.timeMinutes"
      :image="r.image"
      :tags="r.tags"
    />
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}
.grid > * {
  grid-column: span 12;
}
@media (min-width: 520px) {
  .grid > * { grid-column: span 6; }
}
@media (min-width: 900px) {
  .grid > * { grid-column: span 4; }
}
</style>
