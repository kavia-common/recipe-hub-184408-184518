<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'submit'): void
}>()

const value = ref(props.modelValue || '')
watch(() => props.modelValue, v => { value.value = v || '' })

function onInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  emit('update:modelValue', v)
}
function onEnter() {
  emit('submit')
}

onMounted(() => {
  // no-op, placeholder for future focus management
})
</script>

<template>
  <label class="searchbar" aria-label="Search recipes">
    <span class="icon" aria-hidden="true">🔎</span>
    <input
      class="input"
      type="search"
      :placeholder="placeholder || 'Search recipes, tags, ingredients...'"
      :value="value"
      @input="onInput"
      @keyup.enter="onEnter"
    />
  </label>
</template>

<style scoped>
.searchbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #ffffff;
  border: 1px solid rgba(17,24,39,0.08);
  border-radius: 12px;
  padding: 0.4rem 0.6rem;
  box-shadow: 0 1px 0 rgba(0,0,0,0.04);
}
.icon {
  font-size: 0.95rem;
}
.input {
  appearance: none;
  border: none;
  outline: none;
  width: 100%;
  font-size: 0.95rem;
  color: #111827;
}
.input::placeholder {
  color: #6b7280;
}
.searchbar:focus-within {
  box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
  border-color: rgba(37,99,235,0.35);
}
</style>
