<template>
  <q-page class="bg-grey-2">
      <div class="q-gutter-y-md">
        <q-tabs
        class="bg-grey-9 q-pb-md"
        style="border-radius: 0px 0px 15px 15px"
        v-model="tab"
        dense
        active-color="white"
        narrow-indicator>
          <q-tab name="current" icon="" label="Actuales"></q-tab>
          <q-separator vertical dark class="q-mt-md"></q-separator>
          <q-tab name="old" icon="" label="Anteriores"></q-tab>
        </q-tabs>
        <q-tab-panels class="bg-grey-3" v-model="tab" animated>
          <q-tab-panel name="current" style="margin: 0; padding: 0;">
            <q-item-label header class="text-center">Selecciona una órden para ver sus detalles</q-item-label>
            <q-list class="bg-grey-3">
              <q-item clickable @click="seeDetails(item)"  v-for="(item ,index) in computedPayedOrders" :key="index" class="q-ma-sm bordered rounded-borders bg-white">
                <q-item-section >
                  <q-avatar  rounded >
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
                    <q-badge v-if="item.state == 'En Verificacion'" style="color: black" color="yellow" :label="item.state" />
                    <q-badge v-if="item.state == 'Recibida'" color="gray" :label="item.state" />
                    <q-badge v-if="item.state == 'En produccion'" color="orange" :label="item.state" />
                    <q-badge v-if="item.state == 'Paqueteria'" color="blue" :label="item.state" />
                    <q-badge v-if="item.state == 'Entregada'" color="green" :label="item.state" />
                    <q-badge v-if="item.state == 'Cancelada'" color="red" :label="item.state" />
                  <q-item-label style="font-size: 10px">{{item.created_at}}</q-item-label>
                  <q-item-label style="font-size: 10px">{{item.updated_at}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-tab-panel>
        </q-tab-panels>
      </div>
  </q-page>
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
  // mounted () {
  //   console.log(this.orders)
  // },
  computed: {
    ...mapState({
      orders: (state) => state.orders.savedOrders
    }),
    computedPayedOrders () {
      return this.orders.filter(order => order.state !== 'No Pagada')
    }
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
    },

    seeDetails (item) {
      this.$router.push({ name: 'DetailsOrders', params: { item: item } })
    }
  }
}
</script>

<style scoped>
.bordered{
  border: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
