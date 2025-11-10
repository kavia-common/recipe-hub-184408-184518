<script setup lang="ts">
import { reactive, computed } from 'vue'
import type { Recipe } from '@/stores/recipes'

type Difficulty = 'Easy' | 'Medium' | 'Hard'

const props = defineProps<{
  modelValue?: Partial<Recipe>
  mode: 'create' | 'edit'
}>()

const emit = defineEmits<{
  (e: 'submit', payload: Partial<Recipe>): void
}>()

const form = reactive<Partial<Recipe>>({
  title: props.modelValue?.title || '',
  description: props.modelValue?.description || '',
  cuisine: props.modelValue?.cuisine || '',
  difficulty: (props.modelValue?.difficulty as Difficulty) || 'Easy',
  timeMinutes: props.modelValue?.timeMinutes ?? 15,
  tags: props.modelValue?.tags || [],
  image: props.modelValue?.image || ''
})

const errors = computed(() => {
  const e: Record<string, string> = {}
  if (!form.title || !form.title.trim()) e.title = 'Title is required'
  if (!form.cuisine) e.cuisine = 'Cuisine is required'
  if (!form.difficulty) e.difficulty = 'Difficulty is required'
  if (typeof form.timeMinutes !== 'number' || form.timeMinutes <= 0) e.timeMinutes = 'Time must be a positive number'
  return e
})

function onSubmit(ev: Event) {
  ev.preventDefault()
  if (Object.keys(errors.value).length) return
  emit('submit', { ...form })
}
</script>

<template>
  <form class="form" @submit="onSubmit" novalidate>
    <div class="row">
      <div class="group">
        <label class="label" for="title">Title</label>
        <input id="title" v-model="form.title" class="control" placeholder="e.g., Creamy Tomato Pasta" />
        <p class="err" v-if="errors.title">{{ errors.title }}</p>
      </div>
      <div class="group">
        <label class="label" for="cuisine">Cuisine</label>
        <input id="cuisine" v-model="form.cuisine" class="control" placeholder="e.g., Italian" />
        <p class="err" v-if="errors.cuisine">{{ errors.cuisine }}</p>
      </div>
    </div>

    <div class="row">
      <div class="group">
        <label class="label" for="difficulty">Difficulty</label>
        <select id="difficulty" v-model="(form.difficulty as Difficulty)" class="control">
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <p class="err" v-if="errors.difficulty">{{ errors.difficulty }}</p>
      </div>
      <div class="group">
        <label class="label" for="time">Time (min)</label>
        <input id="time" type="number" v-model.number="(form.timeMinutes as number)" class="control" min="1" step="1" />
        <p class="err" v-if="errors.timeMinutes">{{ errors.timeMinutes }}</p>
      </div>
    </div>

    <div class="group">
      <label class="label" for="image">Image URL</label>
      <input id="image" v-model="form.image" class="control" placeholder="https://..." />
    </div>

    <div class="group">
      <label class="label" for="desc">Description</label>
      <textarea id="desc" v-model="form.description" class="control" rows="4" placeholder="Short description"></textarea>
    </div>

    <div class="group">
      <label class="label" for="tags">Tags (comma separated)</label>
      <input id="tags" class="control" :value="(form.tags || []).join(', ')" @input="form.tags = (($event.target as HTMLInputElement).value || '').split(',').map(s => s.trim()).filter(Boolean)" />
    </div>

    <div class="actions">
      <button class="btn-primary" type="submit">{{ mode === 'create' ? 'Create' : 'Save changes' }}</button>
    </div>
  </form>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  background: #ffffff;
  border: 1px solid rgba(17,24,39,0.08);
  border-radius: 14px;
  padding: 1rem;
  box-shadow: 0 6px 18px rgba(0,0,0,0.04);
}
.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
}
.group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.label {
  font-size: 0.85rem;
  color: #374151;
}
.control {
  background: #ffffff;
  border: 1px solid rgba(17,24,39,0.12);
  border-radius: 10px;
  padding: 0.55rem 0.65rem;
  color: #111827;
}
.control:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
  border-color: rgba(37,99,235,0.35);
}
.err {
  color: #EF4444;
  font-size: 0.8rem;
}
.actions {
  display: flex;
  justify-content: flex-end;
}
.btn-primary {
  background: #2563EB;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0.55rem 0.9rem;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(37,99,235,0.35);
  transition: transform 120ms ease, box-shadow 180ms ease;
}
.btn-primary:hover, .btn-primary:focus-visible {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(37,99,235,0.45);
}
@media (max-width: 900px) {
  .row { grid-template-columns: 1fr; }
}
</style>
