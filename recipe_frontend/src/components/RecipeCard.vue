<script setup lang="ts">
import { RouterLink } from 'vue-router'
defineProps<{
  id: string
  title: string
  description?: string
  cuisine?: string
  difficulty?: string
  timeMinutes?: number
  image?: string
  tags?: string[]
}>()
</script>

<template>
  <article class="card">
    <RouterLink class="image-wrap" :to="`/recipes/${id}`" :aria-label="title">
      <img v-if="image" :src="image" :alt="title" />
      <div v-else class="placeholder" aria-hidden="true">🍲</div>
    </RouterLink>
    <div class="content">
      <h3 class="title">
        <RouterLink :to="`/recipes/${id}`">{{ title }}</RouterLink>
      </h3>
      <p class="desc">{{ description }}</p>
      <div class="meta">
        <span class="pill">{{ cuisine || '—' }}</span>
        <span class="pill">{{ difficulty || '—' }}</span>
        <span class="pill">{{ timeMinutes ? timeMinutes + ' min' : '—' }}</span>
      </div>
      <div class="tags" v-if="tags?.length">
        <span v-for="t in tags" :key="t" class="tag">#{{ t }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  display: grid;
  grid-template-rows: 170px 1fr;
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(17,24,39,0.08);
  box-shadow: 0 6px 20px rgba(0,0,0,0.05);
  transition: transform 120ms ease, box-shadow 180ms ease;
}
.card:hover, .card:focus-within {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(37,99,235,0.18);
}
.image-wrap {
  display: block;
  width: 100%;
  height: 170px;
  background: linear-gradient(135deg, rgba(59,130,246,0.10), rgba(249,250,251,1));
}
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-size: 2rem;
  color: #2563EB;
}
.content {
  padding: 0.8rem 0.9rem 1rem;
}
.title {
  margin: 0;
  font-size: 1.05rem;
}
.title a {
  text-decoration: none;
  color: #111827;
}
.desc {
  margin-top: 0.3rem;
  color: #4b5563;
  font-size: 0.9rem;
  min-height: 2.6em;
}
.meta {
  display: flex;
  gap: 0.4rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}
.pill {
  font-size: 0.75rem;
  color: #111827;
  background: #F3F4F6;
  border-radius: 999px;
  padding: 0.2rem 0.5rem;
}
.tags {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}
.tag {
  color: #2563EB;
  font-size: 0.78rem;
}
</style>
