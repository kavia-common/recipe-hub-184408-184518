<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  cuisine: string | null
  difficulty: string | null
  maxTime: number | null
  tags: string[]
  cuisines?: string[]
  availableTags?: string[]
}>()

const emit = defineEmits<{
  (e: 'update:cuisine', v: string | null): void
  (e: 'update:difficulty', v: string | null): void
  (e: 'update:maxTime', v: number | null): void
  (e: 'update:tags', v: string[]): void
  (e: 'clear'): void
}>()

const cuisineOptions = computed(() => props.cuisines || ['Mediterranean', 'Italian', 'Asian', 'American', 'Mexican', 'Indian'])
const difficultyOptions = ['Easy', 'Medium', 'Hard']
const tagOptions = computed(() => props.availableTags || ['healthy', 'quick', 'vegan', 'vegetarian', 'baked', 'grill', 'seafood'])
</script>

<template>
  <aside class="panel" aria-label="Filters">
    <div class="row">
      <div class="group">
        <label for="cuisine" class="label">Cuisine</label>
        <select id="cuisine" class="control"
          :value="cuisine || ''"
          @change="emit('update:cuisine', ($event.target as HTMLSelectElement).value || null)">
          <option value="">Any</option>
          <option v-for="c in cuisineOptions" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <div class="group">
        <label for="difficulty" class="label">Difficulty</label>
        <select id="difficulty" class="control"
          :value="difficulty || ''"
          @change="emit('update:difficulty', ($event.target as HTMLSelectElement).value || null)">
          <option value="">Any</option>
          <option v-for="d in difficultyOptions" :key="d" :value="d">{{ d }}</option>
        </select>
      </div>
    </div>

    <div class="row">
      <div class="group full">
        <label for="maxTime" class="label">Max Time (min)</label>
        <input id="maxTime" type="number" min="0" step="5" class="control"
          :value="maxTime ?? ''"
          @input="emit('update:maxTime', (($event.target as HTMLInputElement).value || '') === '' ? null : Number(($event.target as HTMLInputElement).value))" />
      </div>
    </div>

    <div class="row">
      <div class="group full">
        <span class="label">Tags</span>
        <div class="chips" role="listbox" aria-label="Select tags">
          <button
            v-for="t in tagOptions"
            :key="t"
            type="button"
            class="chip"
            :aria-pressed="props.tags.includes(t)"
            :class="{ active: props.tags.includes(t) }"
            @click="emit('update:tags', props.tags.includes(t) ? props.tags.filter(x => x !== t) : [...props.tags, t])"
          >{{ t }}</button>
        </div>
      </div>
    </div>

    <div class="actions">
      <button type="button" class="btn-secondary" @click="emit('clear')">Clear</button>
    </div>
  </aside>
</template>

<style scoped>
.panel {
  background: #ffffff;
  border: 1px solid rgba(17,24,39,0.08);
  border-radius: 14px;
  padding: 0.9rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
}
.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}
.group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.group.full {
  grid-column: 1 / -1;
}
.label {
  font-size: 0.85rem;
  color: #374151;
}
.control {
  background: #ffffff;
  border: 1px solid rgba(17,24,39,0.12);
  border-radius: 10px;
  padding: 0.5rem 0.6rem;
  color: #111827;
}
.control:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
  border-color: rgba(37,99,235,0.35);
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.chip {
  border: 1px solid rgba(17,24,39,0.12);
  padding: 0.35rem 0.55rem;
  border-radius: 999px;
  background: #fff;
  color: #111827;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease, color 150ms ease, box-shadow 150ms ease;
}
.chip:hover, .chip:focus-visible {
  outline: none;
  border-color: rgba(37,99,235,0.35);
  box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
}
.chip.active {
  background: #2563EB;
  color: #ffffff;
  border-color: #2563EB;
}
.actions {
  display: flex;
  justify-content: flex-end;
}
.btn-secondary {
  background: #F59E0B;
  color: #111827;
  border: none;
  border-radius: 10px;
  padding: 0.45rem 0.8rem;
  cursor: pointer;
  transition: filter 150ms ease, transform 120ms ease, box-shadow 180ms ease;
  box-shadow: 0 4px 10px rgba(245,158,11,0.25);
}
.btn-secondary:hover, .btn-secondary:focus-visible {
  outline: none;
  filter: saturate(1.05);
  transform: translateY(-1px);
}
@media (max-width: 900px) {
  .row {
    grid-template-columns: 1fr;
  }
}
</style>
