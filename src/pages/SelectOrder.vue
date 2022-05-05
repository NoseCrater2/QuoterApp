<template>
  <div>
    <q-list v-if="orders.length != 0" class="bg-grey-3" :style="`height: ${ maxHeight }px`" >
      <q-item
      active-class="highlighted"
      class="bg-white q-ma-sm bordered rounded-borders"
      :id="item.id"
      v-touch-hold.touch="showOptions"
      :active="$store.getters.getSelectedOrderId == item.id"
      tag="label"
      @click="selectOrder(item.id)"
      v-for="item in orders"
      :key="item.id">
        <q-item-section avatar>
          <q-avatar  rounded size="48px">
            <img src="statics/img/blinds.png" />
            <div style="margin-top: -65px; color: white; font-size: 0.7em;">
              {{item.blinds}}
            </div>
            <!-- <q-badge  color="teal"></q-badge> -->
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label  >{{item.order}}</q-item-label>
          <q-item-label class="font-black montserrat-bold" >{{mxCurrencyFormat.format(item.total)}} MXN</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon :name="$store.getters.getSelectedOrderId == item.id ? 'check_circle' : ''" color="white"></q-icon>
        </q-item-section>
      </q-item>
    </q-list>
    <div v-else :style="`height: ${ maxHeight }px`" class="flex justify-center text-caption"  style="align-content: center;">
      <q-item-label header> No hay órdenes pendientes de pago</q-item-label>
    </div>
    <q-dialog v-model="optionsDialog" persistent transition-show="scale" full-width transition-hide="scale">
      <q-card>
        <q-card-section>
          <div class="text-teal text-h6 text-center">ÓRDEN {{ selectedId }}</div>
        </q-card-section>
        <q-list separator class="q-px-md" bordered>
          <q-item clickable >
            <q-item-section avatar>
              <q-icon name="info" color="warning"></q-icon>
            </q-item-section>
            <q-item-section>Ver detalles</q-item-section>
          </q-item>
          <q-item clickable >
            <q-item-section avatar>
              <q-icon name="remove_circle" color="negative"></q-icon>
            </q-item-section>
            <q-item-section>Cancelar órden</q-item-section>
          </q-item>
          <q-item clickable >
            <q-item-section avatar>
              <q-icon name="shopping_cart" color="positive"></q-icon>
            </q-item-section>
            <q-item-section>Revisar y pagar</q-item-section>
          </q-item>
        </q-list>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="cancelar" v-close-popup />
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
      objectOrderSelected: null,
      selectedId: 0,
      optionsDialog: false,
      selected: 0,
      mxCurrencyFormat: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
    }
  },
  computed: {
    ...mapState({
      orders: (state) => state.orders.savedOrders.filter(order => order.state === 'No Pagada')
    }),

    maxHeight () {
      return (this.$q.screen.height - 330)
    }
  },
  methods: {
    showOptions ({ evt, ...info }) {
      // console.log(evt)
      this.selectedId = evt.path[2].id
      this.optionsDialog = true
    },

    selectOrder (id) {
      if (this.selectedId === id) {
        this.selectedId = 0
        this.$store.dispatch('removePaymentOrder')
      } else {
        this.selectedId = id
        this.$store.dispatch('setPaymentOrder', this.orders.find(o => o.id === id))
      }
    }
  }
}
</script>

<style scoped>
.bordered{
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.highlighted{
  background: rgba(2, 167, 167, 0.856) !important;
  color: white;
}

</style>
