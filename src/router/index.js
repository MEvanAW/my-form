import { createRouter, createWebHistory } from 'vue-router'
import MyForm from '@/views/MyForm.vue'

const publicRoutes = [
  {
    path: '/',
    name: 'home',
    component: MyForm,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...publicRoutes],
})

export default router
