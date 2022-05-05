<template>
  <q-page class="bg-grey-3 q-pa-sm">
    <q-stepper
    flat
    class="bg-grey-3"
    v-model="step"
    ref="stepper"
    alternative-labels
    color="primary"
    animated
    >
      <q-step
      class="no-border"
        :name="1"
        title=""
        :caption="step == 1 ? 'Seleccionar órden' : ''"
        prefix="1"
        :done="step > 1"
      >
      <SelectOrder/>
      </q-step>

      <q-step
      class="no-border"
       prefix="2"
        :name="2"
        title=""
        :caption="step == 2 ? 'Revisar órden' : ''"
        icon="create_new_folder"
        :done="step > 2"
      >
      <ReviewOrder :order="selectedOrder"/>
      </q-step>
      <q-step
      class="no-border"
       prefix="3"
      :caption="step == 3 ? 'Confirmar pago' : ''"
      :name="3"
      title=""
      icon="add_comment"
      >
      <ConfirmPayment/>
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation class="flex justify-between q-mt-md">

          <q-btn :disable="step == 1" round icon="west" color="orange-9" @click="$refs.stepper.previous()"  />
          <q-btn v-if="step != 3" @click="$refs.stepper.next()" :disable="selectedOrder == null" round icon="east" color="orange-9" />
          <q-btn
          v-if="step != null && step == 3"
          :disable="selectedType == null"
          label="pagar"
          color="orange-9"
          @click="evaluateSelectedPayment()"
          :loading="loadingIntentPay" />
        </q-stepper-navigation>
      </template>
    </q-stepper>
    <q-footer class="bg-grey-9">
      <div class="row" style="height: 70px">
        <div class="col-6 text-center q-pt-sm" >
          <div class="montserrat-light">SUBTOTAL</div>
          <div class="montserrat-bold" v-if="selectedOrder">
            {{ mxCurrencyFormat.format(selectedOrder.total) }}
            </div>
          <div class="montserrat-bold" v-else>$0.00 MXN</div>
          <div class="montserrat-light" style="font-size:0.9em">IVA INCLUIDO</div>
        </div>
        <div class="col-6 text-center q-pt-sm">
          <div class="montserrat-light">TOTAL</div>
          <div class="montserrat-bold" v-if="selectedOrder">
            {{ mxCurrencyFormat.format(selectedOrder.total) }}
            </div>
          <div class="montserrat-bold" v-else>$0.00 MXN</div>
          <div v-if="selectedOrder" class="text-teal-4 montserrat-bold">
            ÓRDEN #{{selectedOrder.order}}
          </div>
        </div>
      </div>
    </q-footer>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { api } from 'boot/axios'
export default {
  data () {
    return {
      loadingIntentPay: false,
      step: null,
      mxCurrencyFormat: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
    }
  },
  mounted () {
    if (this.selectedType != null) {
      this.step = 3
    } else if (this.selectedOrder != null) {
      this.step = 2
    } else {
      this.step = 1
    }
  },
  computed: {
    ...mapState({
      selectedOrder: (state) => state.cart.order,
      selectedType: (state) => state.cart.selectedType
    })
  },
  methods: {
    evaluateSelectedPayment () {
      if (this.selectedType.name === 'SPEI') {
        this.loadingIntentPay = true
        api.get(`api/spei-payment/${this.selectedOrder.id}`).then(async (response) => {
          if (response.status === 200) {
            this.loadingIntentPay = false
            this.$router.replace({ name: 'SuccessSpeiPayment', params: { id: this.selectedOrder.id } })
            this.$store.dispatch('removePaymentOrder')
            this.$store.dispatch('removeSelectedType')
            this.$store.dispatch('getQuotedOrders')
          }
        }).catch(error => {
          this.loadingIntentPay = false
          console.log(error)
        })
      } else if (this.selectedType.name === 'NetPay') {
        this.$router.push({ name: 'NetPay' })
      }
    }
  },

  components: {
    SelectOrder: () => import('./SelectOrder.vue'),
    ReviewOrder: () => import('./ReviewOrder.vue'),
    ConfirmPayment: () => import('./ConfirmPayment.vue')
  }
}
</script>

<style>
.no-border  div  div{
  padding: 0px !important;
}
</style>
