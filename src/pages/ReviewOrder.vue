<template>
  <div class="q-pa-sm">
    <q-list  class="rounded-borders" :style="`height: ${ maxHeight }px`" separator v-if="details">
      <q-item class="q-ma-sm bg-white" v-for="blind in details.blinds" :key="blind.id">
        <q-item-section  thumbnail top>
            <img
            class="q-ml-md"
            style="width: 60px;height: 90px;"
            :src="`https://rollux.com.mx/img/modelos/medium/${blind.type}/${$store.getters.getVariant(blind.variant, blind.type).line.slug}/${blind.color.code}.jpg`"
            >
        </q-item-section>
        <q-item-section top
         class="q-ml-sm" style="font-size: 0.8em">
          <q-item-label lines="1">
            <span class="montserrat-light">{{blind.type+' / '+blind.line+' / '+blind.manufacturer+' / '+blind.variant}}</span>
          </q-item-label>
          <q-item-label lines="1">
            <span class="montserrat-light">
               {{blind.color.color+' / '+blind.color.code}}
            </span>
            <span class="montserrat-bold text-teal">
               {{mxCurrencyFormat.format(blind.price)}}
            </span>
          </q-item-label>
          <q-item-label lines="1">
            <span class="montserrat-light" v-for="(c, index) in blind.canvas" :key="index">
              {{'Alto: '+c.height + 'm | '+'Ancho: '+c.width+'m / '}}
            </span>
          </q-item-label>
          <q-item-label v-if="blind.motor.motor != 0" lines="1">
            <span class="montserrat-light" >
              {{}}
            </span>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      localOrder: null,
      mxCurrencyFormat: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
    }
  },
  created () {
    if (this.order) {
      this.$store.dispatch('getOrderDetails', this.order.id).then(() => {

      })
    }
  },
  computed: {
    ...mapState({
      details: (state) => state.cart.details
    }),
    maxHeight () {
      return (this.$q.screen.height - 335)
    }
  },

  props: {
    order: {
      type: Object,
      required: false
    }
  }
}
</script>
