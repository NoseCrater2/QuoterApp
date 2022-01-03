<template>
  <q-page class="flex align-center bg-grey-2" >
    <q-list  padding style="width: 100%">
      <q-item-label header>¿Qué deseas hacer?</q-item-label>
      <q-item
      :to="option.route"
      v-for="(option, index) in options"
      :key="index"
      >
        <q-item-section top avatar>
          <q-avatar color="primary" text-color="white" :icon="option.icon"></q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ option.title }}</q-item-label>
          <q-item-label caption lines="2">{{option.description}}</q-item-label>
        </q-item-section>

        <q-item-section v-if="option.count" side top>
           <q-badge rounded outline color="black" :label="option.count" />
        </q-item-section>
      </q-item>

    </q-list>
  </q-page>
</template>
<script>
export default {
  data () {
    return {
      options: [
        {
          title: 'Cotizar',
          description: 'Cotiza persianas',
          route: 'quoter',
          icon: 'calculate'
        },
        {
          title: 'Ver persianas cotizadas',
          description: 'Ve tus persianas cotizadas',
          route: 'quoted-blinds',
          icon: 'ballot',
          count: this.$store.getters.totalOrders
        },
        {
          title: 'Ver persianas guardadas',
          description: 'Ve tus persianas que dejaste para despúes',
          route: 'saved-blinds',
          icon: 'playlist_add_check',
          count: this.$store.getters.getterVigentQuotings.length
        },
        {
          title: 'Ver órdernes',
          description: 'Persianas compradas',
          route: 'orders',
          icon: 'local_shipping',
          count: this.$store.getters.totalSavedorders
        },
        {
          title: 'Ver carrito',
          description: 'Persianas listas para comprar',
          route: 'marketcar',
          icon: 'local_shipping',
          count: this.$store.getters.totalMarketcarOrders
        },
        {
          title: 'Ver perfil',
          description: 'Tus datos personales y de envío',
          route: 'profile',
          icon: 'person'
        }
      ]
    }
  }
}
</script>
<style>
  .custom-card{
    width: 90%; height: 100px;
  }
</style>
