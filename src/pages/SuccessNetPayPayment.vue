<template>
  <q-page class="bg-grey-3 q-pa-sm">
    <q-card flat bordered class="bg-grey-3" v-if="details != undefined">
      <q-card-section>
        <q-list dense>
          <div class="flex justify-center">
          <img width="200px" src="https://suite.netpay.com.mx/portal/resources/images/logo.png">
          </div>
          <q-item class="flex justify-between">
            <q-item-label header class="montserrat-bold" style="font-size: 1.5em">¡PAGO EXITOSO!</q-item-label>
            <q-item-section avatar>
                <q-icon size="50px" color="primary" name="check_circle" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>Total pagado</q-item-label>
              <q-item-label  class="text-teal">{{mxCurrencyFormat.format(details.total)}} MXN</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>NO. DE ORDEN POR PAGAR:</q-item-label>
              <q-item-label  class="text-teal">{{details.order}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>PAGADO CON </q-item-label>
              <q-item-label  class="text-teal">**** {{details.card}}</q-item-label>
            </q-item-section>
             <q-avatar rounded>
              <img :src="`https://rollux.com.mx/img/payments/${details.brand}.svg`">
            </q-avatar>
          </q-item>
        </q-list>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section >
        <span class="montserrat-light">
          Se ha enviado un email a <b class="text-primary">{{details.email}}</b> como confirmación de su compra
        </span>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-actions align="center">
        <q-btn rounded color="primary" label="seguir comprando" to="cart-home" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
// import { api } from 'boot/axios'
export default {
  data () {
    return {
      steps_payment: [
        'Accede a la Banca Móvil desde la plataforma de tu cuenta de banco favorita.',
        'Encuentra y selecciona "Transferencias y Pagos".',
        'Si tu plataforma es Banorte selecciona "Terceros Banorte y otros bancos". Si tu plataforma es de otro banco, busca la opción que diga "Otros bancos".',
        'Escribe la cuenta destinatario.',
        'Ingresa el importe, el concepto, y el día en que quieres aplicar la transferencia.',
        'Revisa los datos y finaliza la operación.'
      ],
      order: null,
      expanded: false,
      mxCurrencyFormat: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
    }
  },

  // beforeRouteEnter (to, from, next) {
  //   next(vm => {
  //     if (vm.details === undefined) {
  //       console.log(vm.details)
  //       vm.$router.replace({ name: 'Cart' })
  //     }
  //   })
  // },

  props: {
    details: {
      type: Object,
      required: false
    }
  }
}
</script>
