import { createRouter, createWebHistory } from 'vue-router'
import TaskList from '../views/TaskList.vue'
import CreateTask from '../views/CreateTask.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TaskList,
    },
    {
      path: '/create',
      name: 'create',
      component: CreateTask,
    }
  ],
})

export default router
