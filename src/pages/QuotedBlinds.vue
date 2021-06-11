<template>
  <q-page class="flex">
    <div style="width: 100%;">
      <q-toolbar  class="bg-grey-9 text-white shadow-2">
        <!-- <q-btn flat to="/" icon="arrow_back"></q-btn>
        <q-space></q-space> -->
        <q-tabs mobile-arrows v-model="tab" shrink stretch >
          <q-tab  v-for="o in $store.state.orders.orders" :key="o.id" :name="`tab${o.id}`" :label="`Persiana ${o.id}`">
          </q-tab>
        </q-tabs>
      </q-toolbar>
      <q-tab-panels v-model="tab" animated >
        <q-tab-panel v-for="o in $store.state.orders.orders" :key="o.id" :name="`tab${o.id}`">
          <q-card class="my-card" flat bordered>
            <q-card-actions>
              {{mxCurrencyFormat.format(o.price)}} MXN
              <q-space></q-space>
              <q-btn flat color="blue">
                Editar
              </q-btn>
              <q-btn flat color="red">
                ELIMINAR
              </q-btn>
            </q-card-actions>
             <q-separator></q-separator>
            <q-card-section>
               <div class="text-overline">{{$store.getters.getVariant(o.variant).name}}</div>
            </q-card-section>
            <q-card-section horizontal>
              <q-card-section class="q-pt-xs">
                <div class="text-caption">
                  <div>TIPO: {{ o.type.toUpperCase() }}</div>
                  <div>FABRICANTE: {{ o.manufacturer }}</div>
                  <div>LINEA: {{ o.line.toUpperCase() }}</div>
                  <div>COLOR: {{ o.color.color }} </div>
                  <div>SKU: {{ o.color.code }} </div>
                  <div>PRECIO: {{$store.getters.getVariant(o.variant).price}} </div>
                </div>
              </q-card-section>

              <q-card-section class="col-4 flex flex-center">
                <q-img
                  class="rounded-borders"
                  width="80px"
                  :src="`https://rollux.com.mx/img/modelos/medium/${o.type}/${o.manufacturer}/${o.color.code}.jpg`"
                >
                  <template v-slot:error>
                    <q-img
                    src="https://rollux.com.mx/img/modelos/medium-unavailable.jpg"
                    class="rounded-borders"
                    width="80px"
                    ></q-img>
                  </template>
                </q-img>
              </q-card-section>
            </q-card-section>
            <q-item-label style="padding-left: 15px">MEDIDAS</q-item-label>
            <q-item>
              <q-item-section v-for="(c, index) in o.canvas" :key="index">
                <q-item-label caption>
                  <div class="text-bold">LIENZO {{ index + 1 }}</div>
                  <div>ALTO: {{ c.height }}m</div>
                  <div>ANCHO: {{ c.width }}m</div>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>
<script>
export default {
  data () {
    return {
      mxCurrencyFormat: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
      tab: 'tab1'
    }
  }
}
</script>
