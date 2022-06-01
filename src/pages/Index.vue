<template>
  <q-page class="flex align-center bg-grey-2" >
    <q-card flat  style="width: 100%; background-color: #404042; border-radius: 0 0 15px 15px; max-height: 380px" >
      <q-item  style="height: 100%">
        <q-item-section >
          <q-item-label class="text-white text-h5 montserrat-bold">{{$t('i18n_index_greeting')}}</q-item-label>
          <q-item-label class="text-primary" style="font-size: 1.8em">{{ user.name + ' ' + user.last_name }}</q-item-label>
          <q-item-label class="text-white montserrat-light">{{ user.email }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-avatar size="100px" color="primary" text-color="white">
             <img style="height: 110px; width: 145px; margin-right: -10px;" src="statics/img/white-r.png">
           <!-- <div class="montserrat-bold" style="margin-top: 30px; font-size:0.7em">{{user.discount_percent}}%</div>
           <div style="font-size: 10px; margin-top: -10px">{{$t('i18n_index_discount')}}</div> -->
          </q-avatar>
        </q-item-section>
      </q-item>
    </q-card>
    <q-list class="q-px-sm" padding style="width: 100%">
      <q-item-label class="text-center montserrat-bold text-h6 text-dark" header >{{$t('i18n_index_presentation')}}</q-item-label>
      <q-card bordered  style="background-color: #339999; height: 110px">
        <q-item to="quoter" style="height: 100%; padding: 0 16px 0 0">
          <q-item-section>
            <img src="img/calculadora.png" style="height: 110px;width: 120px;" >
        </q-item-section>
        <q-item-section side>
          <q-item-label class="montserrat-bold text-white" style="font-size: 25px">{{$t('i18n_index_quot')}}</q-item-label>
          <q-item-label class="montserrat-light text-white" >{{$t('i18n_index_quot_description')}}</q-item-label>
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
                <q-item-label class="montserrat-bold text-white" style="font-size: 15px">{{$store.getters.totalOrders +' '+ $t('i18n_index_count_quotations')}}</q-item-label>
                <q-item-label class="montserrat-light text-white" style="font-size: 11px; text-align: end" >{{$t('i18n_index_count_quotations_description')}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-card>
           <q-card bordered  style="background-color: #339999; height: 60px; margin-top: 10px">
            <q-item to="orders" style="height: 100%; padding: 0 16px 0 0">
              <q-item-section>
                <img src="img/ordenes.png" style="height: 60px;width: 60px;" >
              </q-item-section>
              <q-item-section side>
                <q-item-label class="montserrat-bold text-white" style="font-size: 15px">{{$store.getters.totalSavedorders + ' ' + $t('i18n_index_count_orders')}}</q-item-label>
                <q-item-label class="montserrat-light text-white" style="font-size: 12px; text-align: end" >{{$t('i18n_index_count_orders_description')}}</q-item-label>
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
                <q-item-label class="montserrat-bold text-white" style="font-size: 20px">{{$store.getters.totalMarketcarOrders+' '+$t('i18n_index_count_cart')}}</q-item-label>
                <q-item-label class="montserrat-light text-white" style="font-size: 12px;  text-align: end">{{$t('i18n_index_count_cart_description')}}</q-item-label>
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
        <q-item clickable @click="logoutDialog = true">
          <q-item-section avatar>
             <q-icon size="25px" color="primary" name="logout" />
           </q-item-section>
          <q-item-section >
            <q-item-label class="montserrat-light" >{{$t('i18n_index_close_session')}}</q-item-label>
          </q-item-section>
           <q-item-section avatar>
             <q-icon size="25px" color="primary" name="play_arrow" />
           </q-item-section>
        </q-item>
        </q-list>
      </q-card>
    </q-list>
    <q-dialog full-width persistent v-model="logoutDialog">
      <q-card>
        <q-card-section class="bg-primary text-center text-h5 text-white">
          ¿Cerrar sesión?
        </q-card-section>
        <q-card-section class="text-center text-grey-7">
          Esta acción cerrará tu sesión en todos los dispositivos móviles donde hayas iniciado sesión.
        </q-card-section>
        <q-separator inset></q-separator>
        <q-card-actions align="between">
          <q-btn label="cancelar" flat color="red" @click="logoutDialog = false"></q-btn>
          <q-btn label="aceptar" :loading="logoutLoading" flat color="primary" @click="logout()"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      logoutDialog: false,
      logoutLoading: false,
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
          title: this.$t('i18n_index_list_title_saved_blinds'),
          description: this.$t('i18n_index_list_subtitle_saved_blinds'),
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
          title: this.$t('i18n_index_list_title_prices'),
          description: this.$t('i18n_index_list_subtitle_prices'),
          route: 'price-list',
          icon: 'img/pdf.png'
        },
        {
          title: this.$t('i18n_index_list_title_catalogs'),
          description: this.$t('i18n_index_list_subtitle_catalogs'),
          route: 'catalogs',
          icon: 'img/catalogo.png'
        },
        {
          title: this.$t('i18n_index_list_title_profile'),
          description: this.$t('i18n_index_list_subtitle_profile'),
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
  },

  methods: {
    logout () {
      this.logoutLoading = true
      this.$store.dispatch('logout').then(() => {
        this.logoutLoading = false
        this.$router.replace({ name: 'Login' })
      })
    }
  }
}
</script>
<style>
  .custom-card{
    width: 90%; height: 100px;
  }
</style>
