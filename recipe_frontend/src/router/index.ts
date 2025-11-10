import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/recipes/:id', name: 'recipe-detail', component: () => import('../views/RecipeDetailView.vue'), props: true },
  { path: '/create', name: 'recipe-create', component: () => import('../views/RecipeCreateEditView.vue'), props: { mode: 'create' } },
  { path: '/edit/:id', name: 'recipe-edit', component: () => import('../views/RecipeCreateEditView.vue'), props: route => ({ mode: 'edit', id: route.params.id }) },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
