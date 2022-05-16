<template>
  <q-page class="bg-grey-2">
    <q-card class="bg-grey-2" flat >
      <!-- <q-card-section>
        <q-img></q-img>
      </q-card-section> -->

      <q-tabs dense v-model="tab" class="text-primary bg-grey-9" active-color="white"   style="border-radius: 0px 0px 15px 15px;">
        <q-tab label="Cuenta"  name="one" icon="person"></q-tab>
        <q-tab label="General" name="two" icon="class"></q-tab>
        <q-tab label="Pago" name="three" icon="credit_card"></q-tab>
      </q-tabs>

      <q-separator></q-separator>

      <q-tab-panels v-model="tab" animated style="margin: 0; padding: 0;">
        <q-tab-panel name="one" >
          <div>
            <!-- <q-avatar size="110px" class="text-white" color="orange">
              <div style="font-size: 35px">SJ</div>
              <div style="font-size: 15px">Descuento 14%</div>
            </q-avatar> -->
              <q-chip size="30">
                <q-avatar size="30" class="text-white" color="primary">
                  {{user.discount_percent}}%
                </q-avatar>
                Descuento asignado
              </q-chip>
            <q-input class="q-my-sm" label="Nombre(s)" v-model="user.name" rounded outlined color="primary" dense>
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>
            <q-input class="q-my-sm" rounded label="Apellido(s)" v-model="user.last_name" outlined color="primary" dense>
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>
            <q-input class="q-my-sm" rounded outlined label="Email" v-model="user.email" color="primary" dense>
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>
          </div>
        </q-tab-panel>

        <q-tab-panel name="two">
          <q-img height="100px" :src="`https://rollux.com.mx/img/${user.logo}`"></q-img>
          <!-- <q-file
          v-model="filesImages"
          outlined
          dense
          rounded
          label="Tap aquí para agrenar nuevo logo"
          accept=".jpg, image/*"
          @rejected="onRejected">
          </q-file> -->
          <q-input class="q-my-sm" rounded outlined label="Compañía" v-model="user.company" color="primary" dense>
            <template v-slot:prepend>
              <q-icon name="business" />
            </template>
          </q-input>
          <q-input class="q-my-sm" rounded outlined label="Dirección Fisca" v-model="user.address" color="primary" dense>
            <template v-slot:prepend>
              <q-icon name="place" />
            </template>
          </q-input>
          <q-input class="q-my-sm" rounded outlined label="Ciudad" v-model="user.city" color="primary" dense>
            <template v-slot:prepend>
              <q-icon name="corporate_fare" />
            </template>
          </q-input>
          <q-input class="q-my-sm" rounded outlined label="C.P" v-model="user.zip_code" color="primary" dense>
            <template v-slot:prepend>
              <q-icon name="markunread_mailbox" />
            </template>
          </q-input>
          <q-input class="q-my-sm" rounded outlined label="Estado" v-model="user.state" color="primary" dense>
            <template v-slot:prepend>
              <q-icon name="map" />
            </template>
          </q-input>
          <q-input class="q-my-sm" rounded outlined label="Dirección de envío" v-model="user.ship_address" color="primary" dense>
            <template v-slot:prepend>
              <q-icon name="local_shipping" />
            </template>
          </q-input>
          <q-input class="q-my-sm" rounded outlined label="Dirección de envío alterna" v-model="user.second_ship_address" color="primary" dense>
            <template v-slot:prepend>
              <q-icon name="local_shipping" />
            </template>
          </q-input>
          <q-input class="q-my-sm" rounded outlined label="Whatsapp" v-model="user.phone" color="primary" dense>
            <template v-slot:prepend>
              <q-icon name="phone_android" />
            </template>
          </q-input>
        </q-tab-panel>
        <q-tab-panel name="three" class="bg-grey-2">
          <q-item-label header class="text-center bg-grey-2 q-px-none">Tipos de pago</q-item-label>
          <q-card-section>
            <q-list bordered separator>
              <q-item v-for="type in types" :key="type.id" clickable v-ripple @click="verify(type.name)">
              <q-item-section>
                <q-item-label>{{type.name}}</q-item-label>
                <q-item-label caption>{{type.description}}</q-item-label>
                <q-item-label caption class="text-red" v-if="type.name == 'NetPay'">Tap para configurar</q-item-label>
              </q-item-section>
            </q-item>
            </q-list>
          </q-card-section>
          <q-card-section>
          <q-select
          :loading="loadingPaymentTypes"
          option-label="name"
          option-value="id"
          behavior="menu"
          dense
          rounded
          outlined
          label="Tipos de pago"
          v-model="toSavedTypes"
          use-input
          use-chips
          multiple
          input-debounce="0"
          :options="toSelectTypes"
          >
          <template v-slot:option="scope">
          <q-item
            v-bind="scope.itemProps"
            v-on="scope.itemEvents"
          >
            <q-item-section>
              <q-item-label v-html="scope.opt.name" />
              <q-item-label caption>{{ scope.opt.description }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
          </q-select>
        </q-card-section>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <q-footer class="bg-white">
      <q-separator></q-separator>
      <q-card-actions>
        <q-space></q-space>
          <q-btn color="primary" rounded class="text-white">
             actualizar información
          </q-btn>
      <q-space></q-space>
      </q-card-actions>
    </q-footer>
    <q-dialog v-model="showConfigureNetPayDialog" full-width>
      <q-card>
        <q-card-section horizontal>
            <q-space />
          <q-btn icon="close" flat round @click="showConfigureNetPayDialog = false" />
        </q-card-section>
        <q-card-section class="q-pt-none">
         <q-item-label header class="text-center q-px-none q-pt-none">Agregar o quitar tarjetas</q-item-label>
          <q-list separator>
            <q-slide-item clickable v-ripple v-for="card in creditCards" :key="card.card.lastFourDigits" left-color="red" @left="onLeft">
               <template v-slot:left>
                <div class="row items-center bg-red">
                  <q-btn flat class="full-width" icon="delete" label="Eliminar" @click="openDeleteCardDialog(card.source)" />
                </div>
              </template>
              <q-item >
              <q-item-section avatar>
                <q-avatar rounded>
                  <img :src="`https://rollux.com.mx/img/payments/${card.card.brand}.svg`">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                  <q-item-label>{{card.card.cardPrefix}}  ** **** {{card.card.lastFourDigits}}</q-item-label>
                  <q-item-label caption>EXP: {{card.card.expMonth}}/{{card.card.expYear}}</q-item-label>
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
        </q-card-section>
      </q-card>
    </q-dialog>
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
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      showConfigureNetPayDialog: false,
      selectType: null,
      toSelectTypes: [],
      loadingPaymentTypes: false,
      toSavedTypes: null,
      tab: 'one',
      filesImages: null,
      imageurl: 'https://rollux.com.mx/img/logos/rollux.png',
      debitCards: [],
      creditCards: [],
      cardInformation: {
        cardNumber: null,
        expMonth: null,
        expYear: null,
        cvv2: null
      }
    }
  },

  computed: {
    ...mapState({
      user: (state) => state.user.user,
      types: (state) => state.cart.paymentTypes
    }),
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
  created () {
    this.$store.dispatch('getPaymentTypes', this.user.id)
    if (this.toSelectTypes.length === 0) {
      this.loadingPaymentTypes = true
      this.$api.get('api/payment-types').then(response => {
        this.toSelectTypes = response.data
        this.toSavedTypes = this.types
        this.loadingPaymentTypes = false
      })
    }
    this.chargeCards()
  },
  methods: {
    onRejected (rejectedEntries) {
      this.$q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} file(s) did not pass validation constraints`
      })
    },
    chargeCards () {
      this.$api.get('/api/netpay-get-client/' + this.user.id).then(response => {
        this.loadingCards = false
        this.debitCards = response.data.paymentSources.filter(sc => sc.card.type === 'debit')
        this.creditCards = response.data.paymentSources.filter(sc => sc.card.type === 'credit')
      })
    },
    print () {
      const reader = new FileReader()
      reader.readAsDataURL(this.filesImages)
      reader.onload = (e) => {
        this.imageurl = e.target.result
      }
    },

    verify (name) {
      this.selectType = name
      if (this.selectType === 'NetPay') {
        this.showConfigureNetPayDialog = true
      }
    },

    onLeft ({ reset }) {
      this.finalize(reset)
    },
    finalize (reset) {
      this.timer = setTimeout(() => {
        reset()
      }, 2000)
    }
  }
}
</script>
