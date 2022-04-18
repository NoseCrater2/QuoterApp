<template>
  <q-page class="flex align-center bg-grey-2" >
    <q-card flat  style="width: 100%; background-color: #404042; border-radius: 0 0 15px 15px; max-height: 380px" >
      <q-item  style="height: 100%">
        <q-item-section >
          <q-item-label class="text-white text-h5 montserrat-bold">¡Hola!</q-item-label>
          <q-item-label class="text-primary" style="font-size: 1.8em">{{ user.name + ' ' + user.last_name }}</q-item-label>
          <q-item-label class="text-white montserrat-light">{{ user.email }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-avatar size="100px" color="primary" text-color="white">
           <div class="montserrat-bold" style="margin-top: 30px; font-size:0.7em">{{user.discount_percent}}%</div>
           <div style="font-size: 10px; margin-top: -10px">Descuento</div>
          </q-avatar>
        </q-item-section>
      </q-item>
    </q-card>
    <q-list class="q-px-sm" padding style="width: 100%">
      <q-item-label class="text-center montserrat-bold text-h6 text-dark" header >¿Qué deseas hacer?</q-item-label>
      <q-card bordered  style="background-color: #339999; height: 110px">
        <q-item to="quoter" style="height: 100%; padding: 0 16px 0 0">
          <q-item-section>
            <img src="img/calculadora.png" style="height: 110px;width: 120px;" >
        </q-item-section>
        <q-item-section side>
          <q-item-label class="montserrat-bold text-white" style="font-size: 25px">COTIZAR</q-item-label>
          <q-item-label class="montserrat-light text-white" >Cotizador de persianas</q-item-label>
        </q-item-section>
        </q-item>
      </q-card>
      <div class="row q-py-md justify-between">
        <div class="col-6 q-pr-sm">
           <q-card bordered  style="background-color: #339999; height: 60px">
            <q-item to="quoted-blinds" style="height: 100%; padding: 0 16px 0 0">
              <q-item-section>
                <img src="img/cotizaciones.png" style="height: 60px;width: 60px;" >
              </q-item-section>
              <q-item-section side>
                <q-item-label class="montserrat-bold text-white" style="font-size: 15px">{{$store.getters.totalOrders}} COTIZACIONES</q-item-label>
                <q-item-label class="montserrat-light text-white" style="font-size: 11px; text-align: end" >Ver tus persianas cotizadas</q-item-label>
              </q-item-section>
            </q-item>
          </q-card>
           <q-card bordered  style="background-color: #339999; height: 60px; margin-top: 10px">
            <q-item to="orders" style="height: 100%; padding: 0 16px 0 0">
              <q-item-section>
                <img src="img/ordenes.png" style="height: 60px;width: 60px;" >
              </q-item-section>
              <q-item-section side>
                <q-item-label class="montserrat-bold text-white" style="font-size: 15px">{{$store.getters.totalSavedorders}} ÓRDENES</q-item-label>
                <q-item-label class="montserrat-light text-white" style="font-size: 12px; text-align: end" >Ver tus persianas pagadas</q-item-label>
              </q-item-section>
            </q-item>
          </q-card>
        </div>
        <div class="col-6 q-pl-sm">
          <q-card bordered  style="background-color:  #2f7f86; height: 130px">
            <q-item to="cart-home" style="height: 100%; padding: 0 16px 0 0">
              <q-item-section>
                <img src="img/carrito.png" style="height: 130px;width: 130px;" >
              </q-item-section>
              <q-item-section side>
                <q-item-label class="montserrat-bold text-white" style="font-size: 20px">0 CARRITO</q-item-label>
                <q-item-label class="montserrat-light text-white" style="font-size: 12px;  text-align: end">Ver persianas por pagar</q-item-label>
              </q-item-section>
            </q-item>
          </q-card>
        </div>
      </div>
      <q-card bordered>
        <q-list separator padding >
          <q-item
          :to="option.route"
          v-for="(option, index) in options"
          :key="index"
         >
          <q-item-section top avatar>
             <img width="32px" :src="option.icon">
            <!-- <q-avatar text-color="primary" :icon="option.icon"></q-avatar> -->
          </q-item-section>
          <q-item-section >
            <q-item-label class="montserrat-light" >{{ option.title }}</q-item-label>
            <q-item-label class="montserrat-light" caption lines="2">{{option.description}}</q-item-label>
          </q-item-section>
          <q-item-section v-if="option.count" side top>
             <q-badge rounded outline color="black" :label="option.count" />
          </q-item-section>
           <q-item-section avatar>
             <q-icon size="25px" color="primary" name="play_arrow" />
           </q-item-section>
        </q-item>
        </q-list>
      </q-card>
    </q-list>
  </q-page>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      options: [
        // {
        //   title: 'Cotizar',
        //   description: 'Cotiza persianas',
        //   route: 'quoter',
        //   icon: 'calculate'
        // },
        // {
        //   title: 'Ver persianas cotizadas',
        //   description: 'Ve tus persianas cotizadas',
        //   route: 'quoted-blinds',
        //   icon: 'ballot',
        //   count: this.$store.getters.totalOrders
        // },
        {
          title: 'Ver persianas guardadas',
          description: 'Ve tus persianas que dejaste para despúes',
          route: 'saved-blinds',
          icon: 'img/guardar.png',
          count: this.$store.getters.getterVigentQuotings.length
        },
        // {
        //   title: 'Ver órdernes',
        //   description: 'Persianas compradas',
        //   route: 'orders',
        //   icon: 'local_shipping',
        //   count: this.$store.getters.totalSavedorders
        // },
        // {
        //   title: 'Ver carrito',
        //   description: 'Persianas listas para comprar',
        //   route: 'marketcar',
        //   icon: 'local_shipping',
        //   count: this.$store.getters.totalMarketcarOrders
        // },
        {
          title: 'Lista de precios',
          description: 'Persianas compradas',
          route: 'price-list',
          icon: 'img/pdf.png'
        },
        {
          title: 'Catálogos digitales',
          description: 'Persianas listas para comprar',
          route: 'catalogs',
          icon: 'img/catalogo.png'
        },
        {
          title: 'Perfil de Usuario',
          description: 'Tus datos personales y de envío',
          route: 'profile',
          icon: 'img/perfil.png'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.user.user
    })
  }
}
</script>
<style>
  .custom-card{
    width: 90%; height: 100px;
  }
</style>
