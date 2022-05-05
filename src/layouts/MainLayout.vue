<template>
  <q-layout v-if="loading">
    <q-page-container>
      <q-page class="bg-primary">
          <q-card flat class="absolute-center bg-primary text-white">
            <img src="statics/img/white-r.png" class="inout">
          </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
  <q-layout v-else view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <div style="margin: auto" class="q-py-sm" v-if="$route.name === 'Home'">
          <img
          height="50px"
          src="https://rollux.com.mx/img/white-logo.png">
        </div>
       <q-btn
          v-else
          size="20px"
          style="transform: rotate(180deg);"
          flat
          dense
          round
          icon="play_arrow"
          aria-label="Atrás"
          @click="$route.name === 'Motorization'?$router.replace({name: 'Quoter'}):$router.replace({name: 'Home'})"
        />

        <q-toolbar-title class="montserrat-light" v-if="$route.name !== 'Motorization' && $route.meta.title != ''" style="text-align: center">
          {{$route.meta.title}}
        </q-toolbar-title>
        <q-toolbar-title style="text-align: center" v-else-if="order.motor_type === 'Motorizado'">
          <div v-if="order.type == 'PANEL JAPONES'">Panel Japones Motorizado</div>
          <div >Persiana Motorizada</div>
        </q-toolbar-title>
        <q-toolbar-title style="text-align: center" v-else-if="order.motor_type === 'Manual'">
          <div
          v-if="order.type === 'PANEL JAPONES'">Panel Japones Manual</div>
          <div >Persiana Manual</div>
        </q-toolbar-title>
         <q-btn v-if="$route.name != 'Home'" flat round dense :icon="$route.meta.icon" />
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
          <!-- {{ user.name + ' ' + user.last_name  }} -
          {{ user.role}} -->

        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <transition name="fade" >
        <router-view />
      </transition>
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
      order: (state) => state.orders.order
      // user: (state) => state.user.user
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

.slide-enter-active,
.slide-leave-active{
  transition: opacity 1s, transform 1s;
}

.slide-enter,
.slide-leave-to{
  opacity: 0;
  transform: translateX(-30%);
}

.moveUp-enter-active{
  animation: fadeIn 1s ease-in;
}

@keyframes fadeIn {
  0%{
    opacity: 0;
  }
  50%{
    opacity: 0.5;
  }
  100%{
    opacity: 1;
  }
}

.moveUp-leave-active{
  animation: moveUp 0.3s ease-in;
}

@keyframes fadeIn {
  0%{
    transform: translateY(0);
  }
  100%{
    ransform: translateY(-100px);
  }
}

.fade-enter-active,
.fade-leave-active{
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to{
  opacity: 0;
}
</style>
