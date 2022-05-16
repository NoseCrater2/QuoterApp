<template>
  <q-page class="bg-grey-3 q-pa-sm">
    <q-item-label class="text-center q-pa-sm" header>
      Selecciona un esquema de pago con tarjetas de débito y credito
    </q-item-label>
    <!-- <q-item dense class="flex justify-center">
       <q-item-section thumbnail>
          <img src="https://rollux.com.mx/img/payments/VISA.svg">
        </q-item-section>
        <q-item-section thumbnail>
           <img src="https://rollux.com.mx/img/payments/mastercard.svg">
        </q-item-section>
        <q-item-section thumbnail>
           <img src="https://rollux.com.mx/img/payments/american-express.svg">
        </q-item-section>
    </q-item> -->
    <q-list separator bordered class="q-mt-sm">
      <q-item
      v-for="(item, index) in items"
      :key="index"
      clickable
      v-ripple
      @click="selectSchema(item.schema)"
      :active="selectedSchema === item.schema"
      active-class="prominent">
        <q-item-section avatar>
          <q-icon v-if="selectedSchema === item.schema" name="check" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{item.title}}</q-item-label>
          <q-item-label caption>+{{mxCurrencyFormat.format(selectedOrder.total * item.plus)}}</q-item-label>
          <q-item-label
          v-if="total < 600 && item.schema == 'Crédito'"
          caption
          class="text-red"
          style="font-size: 0.7em">
          NetPay no permite pagar a crédito cantidades menores a $600 MXN
          </q-item-label>
        </q-item-section>
         <q-item-section top side>
            <q-item-label caption>{{item.schema}}</q-item-label>
            <q-badge color="teal" :label="`+${item.plus*100}%`" />
        </q-item-section>
      </q-item>
    </q-list>
    <div class="bg-white rounded-borders bordered q-mt-md" v-if="selectedSchema === 'Crédito' && total >= 600" style="height: 200px" >
      <div class="bg-primary text-h6 text-center text-white">Tus tarjetas de {{selectedSchema}}</div>
      <q-list separator>
        <q-slide-item clickable v-ripple v-for="card in creditCards" :key="card.card.lastFourDigits" left-color="red" @left="onLeft">
           <template v-slot:left>
            <div class="row items-center bg-red">
              <q-btn flat class="full-width" icon="delete" label="Eliminar" @click="openDeleteCardDialog(card.source)" />
            </div>
          </template>
          <q-item :active="selectedCard.source == card.source" clickable @click="selectedCard=card" active-class="prominent">
          <q-item-section avatar>
            <q-avatar rounded>
              <img :src="`https://rollux.com.mx/img/payments/${card.card.brand}.svg`">
            </q-avatar>
          </q-item-section>
          <q-item-section>
              <q-item-label>{{card.card.cardPrefix}}  ** **** {{card.card.lastFourDigits}}</q-item-label>
              <q-item-label caption>EXP: {{card.card.expMonth}}/{{card.card.expYear}}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="check_circle" color="primary" v-if="selectedCard.source == card.source" />
          </q-item-section>
          </q-item>
        </q-slide-item>
        <q-item clickable @click="showAddCardDialog = true" >
           <q-item-section avatar>
            <q-icon name="add" color="primary" />
          </q-item-section>
          <q-item-section>
              <q-item-label>AGREGAR NUEVA</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div  class="bg-white rounded-borders bordered q-mt-md"  v-if="selectedSchema === 'Débito'" style="min-height: 115px">
      <div class="bg-primary text-h6 text-center text-white">Tus tarjetas de {{selectedSchema}}</div>
      <q-list bordered separator>
       <q-list separator>
        <q-slide-item clickable v-ripple v-for="card in debitCards" :key="card.card.lastFourDigits" left-color="red" @left="onLeft">
           <template v-slot:left>
            <div class="row items-center bg-red">
              <q-btn flat class="full-width" icon="delete" label="Eliminar" @click="openDeleteCardDialog(card.source)" />
            </div>
          </template>
          <q-item :active="selectedCard.source == card.source" clickable @click="selectedCard=card" active-class="prominent">
          <q-item-section avatar>
            <q-avatar rounded>
              <img :src="`https://rollux.com.mx/img/payments/${card.card.brand}.svg`">
            </q-avatar>
          </q-item-section>
          <q-item-section>
              <q-item-label>{{card.card.cardPrefix}}  ** **** {{card.card.lastFourDigits}}</q-item-label>
              <q-item-label caption>EXP: {{card.card.expMonth}}/{{card.card.expYear}}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="check_circle" color="primary" v-if="selectedCard.source == card.source" />
          </q-item-section>
          </q-item>
        </q-slide-item>
        <q-item clickable @click="showAddCardDialog = true" >
           <q-item-section avatar>
            <q-icon name="add" color="primary" />
          </q-item-section>
          <q-item-section>
              <q-item-label>AGREGAR NUEVA</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      </q-list>
    </div>
    <q-btn
    icon="credit_score"
    color="orange-9"
    class="montserrat-bold full-width q-mt-md"
    @click="showCVVDialog = true"
    :label="`PAGAR: ${mxCurrencyFormat.format(total)} MXN`"
    :disable="selectedCard.source == null"
    />
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
            {{ mxCurrencyFormat.format(total) }}
            </div>
          <div class="montserrat-bold" v-else>$0.00 MXN</div>
          <div v-if="selectedOrder" class="text-teal-4 montserrat-bold">
            ÓRDEN #{{selectedOrder.order}}
          </div>
        </div>
      </div>
    </q-footer>
    <q-dialog persistent full-width transition-show="slide-up" transition-hide="slide-down" v-model="showAddCardDialog">
      <q-card class="bg-grey-3">
        <q-card style="height: 200px; border-radius: 10px" class="bg-blue-9 q-ma-md">
          <q-card-section class="q-px-none" >
             <div class="q-px-lg bg-blue-grey-10 text-h6 text-white">Nueva tarjeta</div>
          </q-card-section>
          <div class="row">
            <div class="col-6 q-pl-lg">
              <q-input
              dense
              no-error-icon
              error-message="Número inválido"
              dark
              borderless
              v-model="cardInformation.cardNumber"
              :error="!validateCard"
              placeholder="Número de tarjeta"
              style="width: 210px;font-size: 1.4em"/>
            </div>
          </div>
          <div class="row justify-around">
            <div class="col-4 flex">
              <q-input
              dense
              dark
              borderless
              placeholder="Mes"
              v-model="cardInformation.expMonth"
              style="width: 40px; font-size: 1.2em;"
              mask="##"/>
              <q-input
              dense
              no-error-icon
              error-message="Fecha inválida"
              :error="!validateDate"
              prefix="/"
              dark
              borderless
              placeholder="Año"
              v-model="cardInformation.expYear"
              style="width: 50px; font-size: 1.2em;"
              mask="####"/>
            </div>
            <div class="col-4">
              <q-input
              no-error-icon
              error-message="Inválido"
              :error="!validateCVV"
              dense
              dark
              borderless
              placeholder="CVV"
              v-model="cardInformation.cvv2"
              style="width: 70px; font-size: 1.2em"
              mask="####"/>
            </div>
          </div>
        </q-card>
        <q-card-actions align="around">
          <q-btn color="negative" round icon="close" @click="showAddCardDialog = false"></q-btn>
          <q-btn color="primary" round icon="check" :loading="isSavingCard" @click="generalValidate"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showDeleteCardDialog" full-width>
      <q-card>
        <q-card-section class="flex justify-between">
          ¿Quitar esta tarjeta?
          <q-icon size="30px" color="red" name="delete"></q-icon>
        </q-card-section>
        <q-card-actions align="between">
          <q-btn flat label="cancelar" @click="showDeleteCardDialog = false" />
           <q-btn flat label="aceptar" color="red" :loading="isDeletingCard" @click="deleteCard()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showCVVDialog" full-width>
      <q-card>
        <q-card-section class="flex justify-between">
          Ingrese CVV de tarjeta
          <q-icon size="30px" color="primary" name="pin"></q-icon>
        </q-card-section>
        <q-card-section>
          <q-input label="cvv" outlined hide-bottom-space type="password" mask="####"/>
        </q-card-section>
        <q-card-actions align="between">
          <q-btn flat label="cancelar" @click="showCVVDialog = false" />
           <q-btn flat label="aceptar" color="primary" :loading="intentPayLoading" @click="intentPay()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import NetPay from '../utils/netpay.min.js'
import { mapState } from 'vuex'
import { api } from 'boot/axios'
export default {
  data () {
    return {
      showCVVDialog: false,
      selectedCard: {
        source: null
      },
      intentPayLoading: false,
      isDeletingCard: false,
      selectedToken: null,
      showDeleteCardDialog: false,
      imageBank: null,
      showAddCardDialog: false,
      selectedSchema: null,
      items: [
        {
          title: 'Pago en una sola exhibición',
          schema: 'Débito',
          plus: 0.05
        },
        {
          title: 'Pago a 6 meses',
          schema: 'Crédito',
          plus: 0.15
        }
      ],
      debitCards: [],
      creditCards: [],
      mxCurrencyFormat: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
      isSavingCard: false,
      cardInformation: {
        cardNumber: null,
        expMonth: null,
        expYear: null,
        cvv2: null
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.selectedType == null) {
        vm.$router.replace({ name: 'Cart' })
      }
    })
  },
  created () {
    // NetPay.setApiKey('pk_netpay_ohojJOrTFRIteqjzFOoGXncEx') // PRODUCCION
    NetPay.setApiKey('pk_netpay_RjQdVseiQQZsCtAXVmoMoXnVq') // SANDBOX
    NetPay.setSandboxMode(true) // SANDBOX

    if (this.user.netpayClientId != null) {
      this.chargeCards()
    }
  },
  computed: {
    ...mapState({
      selectedOrder: (state) => state.cart.order,
      selectedType: (state) => state.cart.selectedType,
      user: (state) => state.user.user
    }),
    total () {
      if (this.selectedSchema === 'Crédito') {
        return this.selectedOrder.total + (this.selectedOrder.total * 0.15)
      } else if (this.selectedSchema === 'Débito') {
        return this.selectedOrder.total + (this.selectedOrder.total * 0.05)
      }
      return this.selectedOrder.total
    },
    validateCard () {
      if (this.cardInformation.cardNumber) {
        return NetPay.card.validateNumber(this.cardInformation.cardNumber) && NetPay.card.validateNumberLength(this.cardInformation.cardNumber)
      }
      return true
    },

    validateDate () {
      if (this.cardInformation.expMonth && this.cardInformation.expYear) {
        return NetPay.card.validateExpiry(this.cardInformation.expMonth, this.cardInformation.expYear)
      }
      return true
    },

    validateCVV () {
      if (this.cardInformation.cardNumber && this.cardInformation.cvv2) {
        return NetPay.card.validateCVV(this.cardInformation.cvv2, this.cardInformation.cardNumber)
      }
      return true
    }
  },
  methods: {
    deleteCard () {
      this.isDeletingCard = true
      api.post('/api/netpay-delete-card/' + this.user.id, { token: this.selectedToken }).then((response) => {
        if (response.status === 200) {
          this.chargeCards()
        } else {
          this.$q.notify({ type: 'negative', message: 'Ocurrió un error, inténtelo después' })
        }
        this.isDeletingCard = false
        this.showDeleteCardDialog = false
      })
    },
    intentPay () {
      this.intentPayLoading = true
      api.post('/api/netpay-intent-pay/' + this.user.id,
        {
          cvv: this.modelCVVOnPay,
          token: this.selectedCard.source,
          amount: '' + this.total,
          order: this.selectedOrder.order,
          idOrder: this.selectedOrder.id,
          cardType: this.selectedCard.card.type,
          selectedPaymentSchema: this.selectedCard.card.type
        }
      ).then(async (response) => {
        if (response.status === 200) {
          const details = {
            total: this.total,
            order: this.selectedOrder.order,
            card: this.selectedCard.card.lastFourDigits,
            brand: this.selectedCard.card.brand,
            email: this.user.email
          }
          this.$router.replace({ name: 'SuccessNetpayPayment', params: { details } })
          this.$store.dispatch('removePaymentOrder')
          this.$store.dispatch('removeSelectedType')
          this.$store.dispatch('getQuotedOrders')
        } else {
          this.$q.notify({ type: 'negative', message: 'Ocurrió un error, inténtelo después' })
        }
        this.intentPayLoading = false
        this.showCVVDialog = false
      })
    },
    openDeleteCardDialog (token) {
      this.selectedToken = token
      this.showDeleteCardDialog = true
    },
    selectSchema (schema) {
      this.selectedSchema = schema
    },
    onLeft ({ reset }) {
      this.finalize(reset)
    },
    finalize (reset) {
      this.timer = setTimeout(() => {
        reset()
      }, 2000)
    },
    chargeCards () {
      api.get('/api/netpay-get-client/' + this.user.id).then(response => {
        this.loadingCards = false
        this.debitCards = response.data.paymentSources.filter(sc => sc.card.type === 'debit')
        this.creditCards = response.data.paymentSources.filter(sc => sc.card.type === 'credit')
      })
    },
    generalValidate () {
      this.isSavingCard = true
      NetPay.token.create(this.cardInformation, this.success, this.error)
    },
    error (e) {
      console.log(e)
      this.isSavingCard = false
      this.$q.notify({
        type: 'negative',
        message: e.message
      })
    },
    success (e) {
      const cardObject = JSON.parse(e.message.data)
      // DEBIT CARD
      // let cardInformation = {
      //     cardNumber: "5499490519982367",
      //     expMonth: "04",
      //     expYear: "25",
      //     cvv2: "999",
      // };
      // CREDIT CARD
      // let cardInformation = {
      //     cardNumber: "4918717162313532",
      //     expMonth: "04",
      //     expYear: "25",
      //     cvv2: "999",
      // };
      // let cardObject = JSON.parse(e.message.data)
      if (this.user.netpayClientId != null) {
        api.post('/api/netpay-add-card/' + this.user.id,
          { token: cardObject.token, cvv2: this.cardInformation.cvv2 }
        ).then((response) => {
          if (response.status === 200) {
            this.showAddCardDialog = false
            this.chargeCards()
          } else {
            this.$q.notify({ type: 'negative', message: 'Ocurrió un error, inténtelo después' })
          }
          this.isSavingCard = false
        })
      } else {
        // console.log('GUARDAR NUEVO CLIENTE')
        api.post('/api/netpay-save/' + this.user.id, { token: cardObject.token }).then((response) => {
          if (response.status === 200) {
            console.log(response)
            this.isSavingCard = false
            this.showAddCardDialog = false
            this.chargeCards()
          } else {
            this.isSavingCard = false
            this.$q.notify({ type: 'negative', message: 'Ocurrió un error, inténtelo después' })
          }
        })
      }
    }
  }
}
</script>

<style>
.prominent{
  background: #b2dfdb !important;
}
.bordered{
  border: 1px solid rgba(0, 0, 0, 0.12);
}
.block{
  font-family: 'Montserrat-Bold' !important;
}
</style>
