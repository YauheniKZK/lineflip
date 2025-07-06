export default () => {
  return [
    {
      path: '/',
      name: 'main',
      redirect: { path: '/index' },
      component: () => import('../layout/Main.vue'),
      children: [
        {
          path: '/auth',
          name: 'auth',
          meta: {
            requiresAuth: false
          },
          component: () => import('../screens/login/Index.vue'),
          redirect: { path: '/auth/start' },
          children: [
            {
              path: '/start',
              name: 'start',
              meta: {
                requiresAuth: false
              },
              component: () => import('../screens/login/Start.vue'),
            },
            {
              path: '/login',
              name: 'login',
              meta: {
                requiresAuth: false
              },
              component: () => import('../screens/login/Login.vue'),
            }
          ]
        },
        {
          path: '/index',
          name: 'index',
          meta: {
            requiresAuth: true
          },
          redirect: { path: '/home' },
          component: () => import('../screens/Index.vue'),
          children: [
            {
              path: '/home',
              name: 'home',
              meta: {
                requiresAuth: true,
                transition: ''
              },
              component: () => import('../screens/home/Home.vue')
            },
          ]
        }
      ]
    }
  ]
}