<script setup lang="ts">
const props = defineProps<{
  page: number
  totalPages: number
}>()
const emit = defineEmits<{
  (e: 'update:page', v: number): void
}>()
function go(n: number) {
  if (n < 1 || n > props.totalPages) return
  emit('update:page', n)
}
</script>

<template>
  <nav class="pager" role="navigation" aria-label="Pagination" v-if="totalPages > 1">
    <button class="btn" :disabled="page<=1" @click="go(page-1)">Prev</button>
    <span class="info">Page {{ page }} of {{ totalPages }}</span>
    <button class="btn" :disabled="page>=totalPages" @click="go(page+1)">Next</button>
  </nav>
</template>

<style scoped>
.pager {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
  margin-top: 1rem;
}
.btn {
  background: #ffffff;
  border: 1px solid rgba(17,24,39,0.12);
  border-radius: 10px;
  padding: 0.4rem 0.7rem;
  cursor: pointer;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.info {
  color: #4b5563;
}
</style>
