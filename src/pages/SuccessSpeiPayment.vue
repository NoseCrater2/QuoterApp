<template>
  <q-page class="bg-grey-3 q-pa-sm">
    <q-card flat bordered class="bg-grey-3">
      <q-card-section>
        <div >Datos para la transferencia bancaria</div>
        <q-list dense v-if="order != null">
          <q-item>
            <q-item-section>
              <img width="100%" src="http://www.visaalmundo.com/blog/wp-content/uploads/2016/10/Banorte-Logo-EPS-vector-image.png">
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>Total a pagar</q-item-label>
              <q-item-label  class="text-teal">{{mxCurrencyFormat.format(order.total)}} MXN</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>NO. DE ORDEN POR PAGAR:</q-item-label>
              <q-item-label  class="text-teal">{{order.order}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label caption>NO. DE CUENTA DE BANCO:</q-item-label>
              <q-item-label  class="text-teal">0892 6082 67</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>NOMBRE DE LA CUENTA:</q-item-label>
              <q-item-label  class="text-teal">Materiales Decorativos S. de R.L. MI.</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-separator></q-separator>
      <q-card-actions>
        <div>Como hacer una transferencia bancaria desde tu banca móvil</div>
        <q-space />
        <q-btn
          color="grey"
          round
          flat
          dense
          :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="expanded = !expanded"
        />
      </q-card-actions>

      <q-slide-transition>
        <div v-show="expanded">
          <q-separator />
            <q-list dense bordered padding  class="rounded-borders bg-white">
              <q-item v-for="(step, index) in steps_payment" :key="index">
                <q-item-section class="montserrat-light" style="font-size: 0.9em">
                  {{ (index + 1) +'. '+step}}
                </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-slide-transition>
      <q-separator></q-separator>
      <q-card-actions>
        <q-btn rounded color="primary" label="imprimir" />
        <q-space />
        <q-btn rounded color="primary" label="seguir comprando" to="cart-home" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { api } from 'boot/axios'
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

  created () {
    api.get(`api/orders/${this.id}`).then(async (response) => {
      this.order = response.data.data
    })
  },

  props: ['id']
}
</script>
