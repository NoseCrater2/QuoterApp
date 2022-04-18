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
          <q-tab name="current" icon="" :label="`Actuales (${getterVigentQuotings.length})`"></q-tab>
          <q-tab name="old" icon="" :label="`Anteriores (${getterNoVigentQuotings.length})`"></q-tab>
        </q-tabs>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="current" style="margin: 0; padding: 0;">
            <div v-if="getterVigentQuotings.length > 0">
              <q-card bordered flat v-for="(item ,index) in getterVigentQuotings" :key="index">
                <itemQuotation :item="item"></itemQuotation>
              </q-card>
            </div>
            <div v-else class="absolute-center text-grey-7" style="text-align: center" >
              <p  >No hay persianas cotizadas</p>
              <span >Vaya a la sección del cotizador o haga clic en el botón flotante</span>
              <q-btn
              :to="{name: 'Quoter'}"
              fab
              color="primary"
              icon="add"
              class="absolute"
              style="top: 0; right: -50px; transform: translateY(450%);"
              ></q-btn>
            </div>
          </q-tab-panel>
          <q-tab-panel name="old" style="margin: 0; padding: 0;">
            <div v-if="getterNoVigentQuotings.length > 0">
              <q-card bordered flat v-for="(item ,index) in getterNoVigentQuotings" :key="index">
                <itemQuotation :item="item"></itemQuotation>
              </q-card>
            </div>
            <div v-else class="absolute-center text-grey-7" style="text-align: center" >
              <p  >No hay persianas cotizadas</p>
              <span >Vaya a la sección del cotizador o haga clic en el botón flotante</span>
              <q-btn
              :to="{name: 'Quoter'}"
              fab
              color="primary"
              icon="add"
              class="absolute"
              style="top: 0; right: -50px; transform: translateY(450%);"
              ></q-btn>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
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
    ...mapGetters(['getterVigentQuotings', 'getterNoVigentQuotings'])
  },

  components: {
    itemQuotation
  }
}
</script>
