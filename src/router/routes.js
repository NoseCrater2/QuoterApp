
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // { path: '', name: 'Loading', component: () => import('pages/Loading.vue'), props: true },
      { path: '', name: 'Home', component: () => import('pages/Index.vue'), meta: { title: '' } },
      { path: 'quoter', name: 'Quoter', component: () => import('pages/Quoter.vue'), props: true, meta: { title: 'Cotizador de persianas', icon: 'calculte' } },
      { path: 'quoted-blinds', name: 'Quoted', component: () => import('pages/QuotedBlinds.vue'), meta: { title: 'Persianas cotizadas', icon: 'calculte' } },
      { path: 'saved-blinds', name: 'Saved', component: () => import('pages/SavedBlinds.vue'), meta: { title: 'Persianas guardadas' } },
      { path: 'details-saved-blinds', name: 'DetailsSavedBlinds', component: () => import('src/pages/DetailsSavedBlinds.vue'), props: true, meta: { title: 'Detalles Persianas', icon: 'calculte' } },
      { path: 'orders', name: 'Orders', component: () => import('pages/Orders.vue'), meta: { title: 'Órdenes', icon: 'calculte' } },
      { path: 'details-orders', name: 'DetailsOrders', component: () => import('src/pages/DetailsOrders.vue'), props: true, meta: { title: 'Detalles Persianas', icon: 'calculte' } },
      { path: 'marketcar', name: 'Marketcar', component: () => import('pages/Marketcar.vue'), meta: { title: 'Carrito' } },
      { path: 'details-marketcar', name: 'DetailsMarketcar', component: () => import('src/pages/DetailsMarketcar.vue'), props: true, meta: { title: 'Detalles Persianas', icon: 'calculte' } },
      { path: 'motorization', name: 'Motorization', component: () => import('pages/Motorization.vue'), props: true },
      { path: 'profile', name: 'Profile', component: () => import('pages/Profile.vue'), props: true, meta: { title: 'Perfil', icon: 'calculte' } },
      { path: 'price-list', name: 'PircesList', component: () => import('pages/PricesList.vue'), props: true, meta: { title: 'Lista de precios', icon: 'calculte' } },
      { path: 'catalogs', name: 'Catalogs', component: () => import('pages/Catalogs.vue'), props: true, meta: { title: 'Catálogos', icon: 'calculte' } },
      { path: 'cart-home', name: 'Cart', component: () => import('pages/CartHome.vue'), props: true, meta: { title: 'Carrito de compra', icon: 'shopping_cart' } },
      { path: 'success-spei-payment', name: 'SuccessSpeiPayment', component: () => import('pages/SuccessSpeiPayment.vue'), props: true, meta: { title: 'Pago éxitoso por SPEI', icon: 'shopping_cart' } },
      { path: 'success-netpay-payment', name: 'SuccessNetpayPayment', component: () => import('pages/SuccessNetPayPayment.vue'), props: true, meta: { title: 'Pago éxitoso por NetPay', icon: 'shopping_cart' } },
      { path: 'netpay-home', name: 'NetPay', component: () => import('pages/NetPayHome.vue'), props: true, meta: { title: 'Pago con NetPay', icon: 'shopping_cart' } }
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
