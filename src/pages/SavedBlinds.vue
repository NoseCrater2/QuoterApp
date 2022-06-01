<template>
  <q-page class="bg-grey-2">
        <q-tabs
        class="bg-grey-9 q-pb-md"
        style="border-radius: 0px 0px 15px 15px;"
        v-model="tab"
        active-color="white"
        align="justify"
        narrow-indicator
        mobile-arrows>
          <q-tab name="current" :label="`Actuales`">
             <q-badge color="red" floating>{{getterVigentQuotings.length}}</q-badge>
          </q-tab>
          <q-separator vertical dark class="q-mt-md"></q-separator>
          <q-tab name="old"  :label="`Anteriores`">
             <q-badge color="red" floating>{{getterNoVigentQuotings.length}}</q-badge>
          </q-tab>
        </q-tabs>
        <q-tab-panels v-model="tab" animated class="bg-grey-2">
          <q-tab-panel name="current" class="q-pa-sm" >
            <q-item-label v-if="getterVigentQuotings.length > 0" header class="text-center bg-grey-2 q-px-none">Selecciona una cotización para ver sus detalles</q-item-label>
            <div v-if="getterVigentQuotings.length > 0" :style="`max-height:${maxHeight}px; overflow: scroll`">
              <q-list flat v-for="(item ,index) in getterVigentQuotings" :key="index">
                <itemQuotation :item="item"></itemQuotation>
              </q-list>
            </div>
            <div v-else class="justify-center text-grey-7" style="text-align: center; height: 80vh !important" >
              <div>
                <p class="text-center bg-grey-2 q-px-none">No hay persianas cotizadas</p>
                <p class="text-center bg-grey-2 q-px-none">Vaya a la sección del cotizador o haga clic en el botón flotante</p>
              </div>
              <q-btn
              :to="{name: 'Quoter'}"
              fab
              color="primary"
              icon="add"
              style="position: fixed; bottom: 0; right: 0; margin-bottom: 8px; margin-right: 8px;"
              ></q-btn>
            </div>
          </q-tab-panel>
          <q-tab-panel name="old" style="margin: 0; padding: 0;">
            <q-item-label v-if="getterNoVigentQuotings.length > 0" header class="text-center bg-grey-2 q-px-none">Selecciona una cotización para ver sus detalles</q-item-label>
            <div v-if="getterNoVigentQuotings.length > 0">
              <q-card bordered flat v-for="(item ,index) in getterNoVigentQuotings" :key="index">
                <itemQuotation :item="item"></itemQuotation>
              </q-card>
            </div>
            <div v-else class="justify-center text-grey-7" style="text-align: center; height: 80vh !important" >
              <div>
                <p class="text-center bg-grey-2 q-px-none">No hay persianas cotizadas</p>
                <p class="text-center bg-grey-2 q-px-none">Vaya a la sección del cotizador o haga clic en el botón flotante</p>
              </div>
              <q-btn
              :to="{name: 'Quoter'}"
              fab
              color="primary"
              icon="add"
              style="position: fixed; bottom: 0; right: 0; margin-bottom: 8px; margin-right: 8px;"
              ></q-btn>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      <q-inner-loading
        :showing="loadingQuotations"
        color="teal"
      />
  </q-page>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import itemQuotation from '../components/ItemQuotation.vue'
export default {
  created () {
    this.loadingQuotations = true
    this.$store.dispatch('getQuotingOrders').then(
      this.loadingQuotations = false
    )
  },
  data () {
    return {
      loadingQuotations: true,
      tab: 'current'
    }
  },

  computed: {
    ...mapState({
      blinds: (state) => state.orders.blinds
    }),
    ...mapGetters(['getterVigentQuotings', 'getterNoVigentQuotings']),
    maxHeight () {
      return (this.$q.screen.height - 198)
    }
  },

  components: {
    itemQuotation
  }
}
</script>
