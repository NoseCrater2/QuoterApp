<template>
    <q-slide-item  @left="onLeft" @right="onRight" left-color="red" right-color="green" >
      <div style="display: flex; justify-content: space-around;">
        <q-item-section >
          <q-avatar  rounded size="48px">
            <img src="statics/img/blinds.png" />
            <q-badge style="margin-top: 13px;margin-right: 18px;" floating rounded color="teal">{{item.blinds}}</q-badge>
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label style="color: primary">{{item.order}}</q-item-label>
          <q-item-label caption>{{mxCurrencyFormat.format(item.total)}} MXN</q-item-label>
        </q-item-section>
        <q-item-section side>
            <q-badge v-if="item.state == 'No Pagada'" color="black" :label="item.state" />
            <q-badge v-if="item.state == 'En Verificación'" color="yellow" :label="item.state" />
            <q-badge v-if="item.state == 'Recibida'" color="gray" :label="item.state" />
            <q-badge v-if="item.state == 'En produccion'" color="orange" :label="item.state" />
            <q-badge v-if="item.state == 'Paqueteria'" color="blue" :label="item.state" />
            <q-badge v-if="item.state == 'Entregada'" color="green" :label="item.state" />
            <q-badge v-if="item.state == 'Cancelada'" color="red" :label="item.state" />
          <q-item-label style="font-size: 10px">{{item.created_at}}</q-item-label>
          <q-item-label style="font-size: 10px">{{item.updated_at}}</q-item-label>
        </q-item-section>
      </div>
      <template v-slot:left>
        <div class="row items-center"  @click="deleteOrder()">
          <q-icon left name="clear" />Eliminar
        </div>
      </template>
      <template v-slot:right>
        <div class="row items-center">
          Comprar<q-icon right name="credit_card" />
        </div>
      </template>
    </q-slide-item>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      tab: 'current',
      mxCurrencyFormat: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   next(vm => {
  //     vm.$store.dispatch('getQuotedOrders')
  //   })
  // },
  mounted () {
    console.log(this.orders)
  },
  computed: {
    ...mapState({
      orders: (state) => state.orders.savedOrders
    })
  },

  methods: {
    finalize (reset) {
      setTimeout(() => {
        reset()
      }, 1000)
    },
    onLeft ({ reset }) {
      this.finalize(reset)
    },

    onRight ({ reset }) {
      this.finalize(reset)
    },

    deleteOrder () {
      console.log('intento de eliminación')
    }
  }
}
</script>
