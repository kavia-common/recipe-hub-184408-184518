<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-layout">
    <header class="app-header" role="banner">
      <div class="brand">
        <span class="logo" aria-hidden="true">🍳</span>
        <RouterLink to="/" class="title" aria-label="Recipe Hub Home">
          Recipe Hub
        </RouterLink>
      </div>
      <nav class="main-nav" role="navigation" aria-label="Main Navigation">
        <RouterLink to="/" class="nav-link">Browse</RouterLink>
        <RouterLink to="/create" class="nav-cta">New Recipe</RouterLink>
      </nav>
    </header>

    <main class="app-main" role="main">
      <RouterView />
    </main>

    <footer class="app-footer" role="contentinfo">
      <p>© {{ new Date().getFullYear() }} Recipe Hub • Crafted with Vue</p>
    </footer>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  background: #f9fafb;
  color: #111827;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  background: linear-gradient(90deg, rgba(59,130,246,0.12), rgba(249,250,251,1) 45%, rgba(249,250,251,1));
  backdrop-filter: blur(6px);
  border-bottom: 1px solid rgba(0,0,0,0.06);
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.logo {
  font-size: 1.35rem;
}

.title {
  color: #111827;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 0.2px;
}

.main-nav {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.nav-link {
  color: #111827;
  text-decoration: none;
  padding: 0.45rem 0.75rem;
  border-radius: 8px;
  transition: background-color 180ms ease, box-shadow 180ms ease;
}

.nav-link:hover,
.nav-link:focus-visible {
  outline: none;
  background: #ffffff;
  box-shadow: 0 1px 0 rgba(0,0,0,0.05), 0 0 0 3px rgba(37,99,235,0.15);
}

.nav-cta {
  text-decoration: none;
  padding: 0.5rem 0.9rem;
  border-radius: 10px;
  color: #ffffff;
  background: #2563EB;
  box-shadow: 0 4px 14px rgba(37,99,235,0.35);
  transition: transform 120ms ease, box-shadow 180ms ease, filter 180ms ease;
}
.nav-cta:hover,
.nav-cta:focus-visible {
  outline: none;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(37,99,235,0.45);
  filter: saturate(1.05);
}

.app-main {
  width: min(1280px, 100%);
  margin: 0 auto;
  padding: 1rem;
}

.app-footer {
  background: #ffffff;
  border-top: 1px solid rgba(0,0,0,0.06);
  padding: 1rem;
  text-align: center;
  color: #4b5563;
}
</style>
