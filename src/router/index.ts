import { createRouter, createWebHistory } from 'vue-router';
import getRoutes from '@/router/routes';

const router = createRouter({
  history: createWebHistory(),
  routes: getRoutes(),
});

// router.beforeEach(async () => {
//   return '/';
// });

export default router;
