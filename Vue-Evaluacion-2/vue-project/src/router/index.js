import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    /* {
      path: '/',
      name: 'home',
      component: HomeView,
    }, */
    {
      path: '/counter',
      name: 'Counter',
      component: () => import('../modules/counter/components/Counter.vue'),
    },
    {
      path: '/to-do-list',
      name: 'ToDoList',
      component: () => import('../modules/toDoList/components/ToDoList.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../modules/logIn/views/LogInView.vue'),
    },
  ],
})

export default router
