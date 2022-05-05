<template>
  <q-page class="bg-grey-2">
    <div class="q-pa-md">
      <div class="q-gutter-y-md">
        <q-tabs
        v-model="tab"
        dense
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
        mobile-arrows>
          <q-tab name="current" icon="" label="Actuales"></q-tab>
          <q-tab name="old" icon="" label="Anteriores"></q-tab>
        </q-tabs>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="current" style="margin: 0; padding: 0;">
            <q-card bordered flat v-for="(item ,index) in computedPayedOrders" :key="index">
                <q-slide-item left-color="red" right-color="green" >
                  <q-item clickable @click="seeDetails(item)" style="display: flex; justify-content: space-around;">
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
                </q-slide-item>
            </q-card>
          </q-tab-panel>
        </q-tab-panels>
      </div>
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
  mounted () {
    console.log(this.orders)
  },
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
