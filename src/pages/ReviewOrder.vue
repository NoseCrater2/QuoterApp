<template>
  <div class="q-pa-sm">
    <q-list class="rounded-borders" :style="`height: ${ maxHeight }px`" separator v-if="details">
      <q-slide-item clickable= v-ripple v-for="blind in details.blinds" :key="blind.id" left-color="red" @left="onLeft">
      <template v-slot:left v-if="details.blinds.length > 1">
        <div class="row items-center bg-red">
          <q-btn flat class="full-width" icon="delete" label="Eliminar" @click="openDeleteCardDialog(blind.id)" />
        </div>
      </template>
      <q-item class="bg-white">
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
              {{$store.getters.getMotor(blind.motor.motor).system+' / '+$store.getters.getMotor(blind.motor.motor).motorizationType+' / '+$store.getters.getMotor(blind.motor.motor).manufacturer}}
            </span>
            <span class="montserrat-bold text-teal">
               {{mxCurrencyFormat.format(blind.motor.price)}}
            </span>
          </q-item-label>
        </q-item-section>
      </q-item>
      </q-slide-item>
    </q-list>
    <q-dialog v-model="showDeleteCardDialog" full-width>
      <q-card>
        <q-card-section class="flex justify-between">
          ¿Eliminar persiana?
          <q-icon size="30px" color="red" name="delete"></q-icon>
        </q-card-section>
        <q-card-actions align="between">
          <q-btn flat label="cancelar" @click="closeDeleteCardDialog()" />
           <q-btn flat label="aceptar" color="red" :loading="isDeletingBlind" @click="deleteBlind()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      localOrder: null,
      selectedId: -1,
      showDeleteCardDialog: false,
      isDeletingBlind: false,
      mxCurrencyFormat: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
    }
  },
  created () {
    if (this.order) {
      this.$store.dispatch('getOrderDetails', this.order.id).then(() => {

      })
    }
  },
  methods: {
    deleteBlind () {
      if (this.selectedId > -1) {
        this.isDeletingBlind = true
        this.$store.dispatch('deleteBlindFromOrder', this.selectedId).then(async () => {
          this.$store.dispatch('getOrderDetails', this.order.id).then(async () => {
            await this.$store.dispatch('getQuotedOrders')
            this.$store.dispatch('setPaymentOrder', this.stateOrders.find(o => o.id === this.order.id))
            this.isDeletingBlind = false
            this.closeDeleteCardDialog()
          }).catch(() => {
            this.$q.notify({ type: 'negative', message: 'Ocurrió un error, Inténtelo después' })
          })
        })
      }
    },
    openDeleteCardDialog (id) {
      this.selectedId = id
      this.showDeleteCardDialog = true
    },
    closeDeleteCardDialog () {
      this.selectedId = -1
      this.showDeleteCardDialog = false
    },
    onLeft ({ reset }) {
      this.finalize(reset)
    },
    finalize (reset) {
      // clearInterval(id)
      // reset()
      // const id = setInterval(frame, 2000, this.showDeleteCardDialog)
      // let fn = function frame (isActive) {
      //   return isActive;
      // }
      this.timer = setTimeout(() => {
        reset()
      }, 2000)
    },
    timerInterval () {
      console.log('shi')
      if (this.showDeleteCardDialog) {
        console.log('shi')
        // this.finalize(reset)
      }
    }
  },
  computed: {
    ...mapState({
      stateOrders: (state) => state.orders.savedOrders.filter(order => order.state === 'No Pagada'),
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
