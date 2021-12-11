
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // { path: '', name: 'Loading', component: () => import('pages/Loading.vue'), props: true },
      { path: '', name: 'Home', component: () => import('pages/Index.vue'), meta: { title: 'Rollux Cotizador' } },
      { path: 'quoter', name: 'Quoter', component: () => import('pages/Quoter.vue'), props: true, meta: { title: 'Cotizador' } },
      { path: 'quoted-blinds', name: 'Quoted', component: () => import('pages/QuotedBlinds.vue'), meta: { title: 'Persianas cotizadas' } },
      { path: 'saved-blinds', name: 'Saved', component: () => import('pages/SavedBlinds.vue'), meta: { title: 'Persianas guardadas' } },
      { path: 'orders', name: 'Orders', component: () => import('pages/Orders.vue'), meta: { title: 'Ordenes' } },
      { path: 'motorization', name: 'Motorization', component: () => import('pages/Motorization.vue'), props: true },
      { path: 'profile', name: 'Profile', component: () => import('pages/Profile.vue'), props: true, meta: { title: 'Perfil' } }
    ]
  },
  { path: '/login', name: 'Login', component: () => import('pages/Login.vue') },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
