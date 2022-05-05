<template>
  <div class="q-pa-sm">
    <q-list v-if="types.length > 0" style="height: 200px" separator>
      <q-item tag="label"  v-ripple v-for="type in types" :key="type.id">
        <q-item-section avatar>
          <q-radio v-model="selectedType" :val="type.id" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{type.name}}</q-item-label>
          <q-item-label caption>{{type.description}}</q-item-label>
          <q-item-label
          v-if="selectedType == type.id && $store.state.cart.selectedType.name == 'NetPay'"
          style="font-size: 0.7em; color: red">
            *Se harán cargos extras al seleccionar este método de pago
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-card v-else style="height: 200px" class="bg-grey-3" flat>
      <q-card-section >
        <div class="text-center full-width text-grey-7">
           Actualmente, no tienes tipos de pago configurados
        </div>
      </q-card-section>
      <q-card-section class="flex justify-center q-mt-lg" >
        <div class="row">
          <div class="col-12 text-center">
            <q-btn icon="add" round color="primary" @click="openPaymentsDialog()" />
          </div>
          <div class="col-12 text-center">
            <div class="text-grey-7">
              Agregar tipo de pago
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-dialog v-model="showPaymentTypesDialog">
      <q-card class="full-width">
        <q-item-label class="bg-primary text-white text-center" header>Selecciona uno o más tipos de pago</q-item-label>
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
        <q-card-actions align="between">
          <q-btn flat label="cancelar" color="negative" @click="showPaymentTypesDialog = false"/>
          <q-btn flat label="aceptar" color="primary" :loading="savingPaymentsToUser" @click="saveTypes()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { api } from 'boot/axios'
export default {
  data () {
    return {
      savingPaymentsToUser: false,
      loadingPaymentTypes: false,
      toSavedTypes: [],
      showPaymentTypesDialog: false,
      toSelectTypes: []
    }
  },
  computed: {
    ...mapState({
      types: (state) => state.cart.paymentTypes,
      user: (state) => state.user.user
    }),
    selectedType: {
      get: function () {
        if (this.$store.state.cart.selectedType) {
          return this.$store.state.cart.selectedType.id
        }
        return null
      },
      set: function (newValue) {
        this.$store.dispatch('setPaymentType', newValue)
      }
    }
  },
  created () {
    this.$store.dispatch('getPaymentTypes', this.user.id)
  },

  methods: {
    saveTypes () {
      if (this.toSavedTypes.length > 0) {
        this.savingPaymentsToUser = true
        api.post('api/payment-type-to-user/' + this.user.id, { paymentTypes: this.toSavedTypes.map(t => t.id) }).then(response => {
          this.savingPaymentsToUser = false
          this.showPaymentTypesDialog = false
          if (response.status === 200) {
            this.$store.dispatch('getPaymentTypes', this.user.id)
          }
        })
      }
    },

    openPaymentsDialog () {
      this.showPaymentTypesDialog = true
      if (this.toSelectTypes.length === 0) {
        this.loadingPaymentTypes = true
        api.get('api/payment-types').then(response => {
          this.toSelectTypes = response.data
          this.loadingPaymentTypes = false
        })
      }
    }
  }

}
</script>
