<template>
  <q-layout v-if="loading">
    <q-page-container>
      <q-page class="bg-primary">
          <q-card flat class="absolute-center bg-primary text-white">
            <img src="/img/white-r.svg" class="inout">
          </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
  <q-layout v-else view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          v-if="$route.name === 'Home'"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        >
          <!-- <q-avatar size="42px">
            <img >$router.back()
          </q-avatar> -->
        </q-btn>
       <q-btn
          v-else
          flat
          dense
          round
          icon="arrow_back"
          aria-label="Atrás"
          @click="$route.name === 'Motorization'?$router.replace({name: 'Quoter'}):$router.replace({name: 'Home'})"
        />

        <q-toolbar-title  v-if="$route.name !== 'Motorization'" class="absolute-center">
          {{$route.meta.title}}
        </q-toolbar-title>
        <q-toolbar-title v-else-if="order.motor_type === 'Motorizado'">
          <div v-if="order.type == 'PANEL JAPONES'">Panel Japones Motorizado</div>
          <div >Persiana Motorizada</div>
        </q-toolbar-title>
        <q-toolbar-title v-else-if="order.motor_type === 'Manual'">
          <div
          v-if="order.type === 'PANEL JAPONES'">Panel Japones Manual</div>
          <div >Persiana Manual</div>
        </q-toolbar-title>
          <!-- <q-img class="absolute-right" src="img/white-r.svg"  style="width: 49px; height: 49px;"></q-img> -->
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          {{ user.name + ' ' + user.last_name  }} -
          {{ user.role}}

        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

const linksData = [
  {
    title: 'Cotizar',
    caption: 'Cotiza persianas',
    icon: 'calculate',
    link: 'quoter'
  },
  {
    title: 'Persianas Cotizadas',
    caption: 'Ve tus persianas cotizadas',
    icon: 'ballot',
    link: 'quoted-blinds'
  },
  {
    title: 'Persianas Guardadas',
    caption: 'Ve tus persianas que dejaste para despúes',
    icon: 'playlist_add_check',
    link: 'saved-blinds'
  },
  {
    title: 'Órdenes',
    caption: 'Persianas que enviaste a fabricar',
    icon: 'local_shipping',
    link: 'orders'
  },
  {
    title: 'Carrito',
    caption: 'Persianas listas para comprar',
    icon: 'shopping_cart',
    link: 'cart'
  },
  {
    title: 'Perfil',
    caption: 'Tus datos personales y de envío',
    icon: 'person',
    link: 'profile'
  }
  // {
  //   title: 'Facebook',
  //   caption: '@QuasarFramework',
  //   icon: 'public',
  //   link: 'https://facebook.quasar.dev'
  // },
  // {
  //   title: 'Quasar Awesome',
  //   caption: 'Community Quasar projects',
  //   icon: 'favorite',
  //   link: 'https://awesome.quasar.dev'
  // }
]
import { mapState } from 'vuex'
export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      loading: true,
      tab: null,
      leftDrawerOpen: false,
      essentialLinks: linksData
    }
  },
  computed: {
    ...mapState({
      order: (state) => state.orders.order,
      user: (state) => state.user.user
    })
  },

  beforeCreate () {
    this.$store.dispatch('getUser')
    this.$store.dispatch('getControls')
    this.$store.dispatch('getGalleries')
    this.$store.dispatch('getMotorizations')
    this.$store.dispatch('getProducts')
    this.$store.dispatch('getLines')
    this.$store.dispatch('getQuotedOrders')
    this.$store.dispatch('getQuotingOrders')
    this.$store.dispatch('getAllVariants').then(() => {
      this.loading = false
    })
  }
}
</script>
<style>
* {
font-family: 'Montserrat';
}
.inout{
  animation: float_pngRolluxInOut .5s infinite , scale 2s infinite;
}
@keyframes float_pngRolluxInOut{
    0%{
      transform: translatey(-85px) translatex(-20px);
    }
    50%{
      transform: translatey(-80px) translatex(-20px);
    }
    100%{
      transform: translatey(-85px) translatex(-20px);
    }
}
@keyframes scale{
    0%{
      transform: scale(.93);
    }
    50%{
      transform: scale(1);
    }
    100%{
      transform: scale(.93);
    }
}
</style>
