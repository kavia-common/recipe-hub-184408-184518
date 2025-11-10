<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RecipeForm from '@/components/RecipeForm.vue'
import { useRecipesStore } from '@/stores/recipes'
import type { Recipe } from '@/stores/recipes'

const props = defineProps<{
  mode: 'create' | 'edit'
  id?: string
}>()

const route = useRoute()
const router = useRouter()
const store = useRecipesStore()
const current = ref<Recipe | null>(null)

onMounted(async () => {
  if (props.mode === 'edit') {
    const id = String(props.id || route.params.id)
    const rec = await store.fetchOne(id)
    current.value = rec as Recipe
  }
})

const title = computed(() => props.mode === 'create' ? 'Create Recipe' : 'Edit Recipe')

async function handleSubmit(payload: Partial<Recipe>) {
  try {
    if (props.mode === 'create') {
      const created = await store.createRecipe(payload as Recipe)
      alert('Recipe created successfully')
      router.push(`/recipes/${created.id}`)
    } else {
      const id = String(props.id || route.params.id)
      await store.updateRecipe(id, payload)
      alert('Recipe updated successfully')
      router.push(`/recipes/${id}`)
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    alert('Operation failed: ' + msg)
  }
}
</script>

<template>
  <section class="wrap">
    <header class="head">
      <h1>{{ title }}</h1>
    </header>
    <RecipeForm :mode="mode" :model-value="current || undefined" @submit="handleSubmit" />
  </section>
</template>

<style scoped>
.wrap {
  background: #ffffff;
  border: 1px solid rgba(17,24,39,0.08);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 10px 24px rgba(0,0,0,0.05);
}
.head {
  margin-bottom: 0.5rem;
}
</style>
