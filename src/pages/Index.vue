<template>
  <q-page class="flex">
    <q-stepper
      v-model="step"
      vertical
      color="primary"
      animated
      style="width: 100%;"
    >
      <q-step
      :name="1"
      :title="order.type != null && order.manufacturer != null ?`TIPO: ${order.type.toUpperCase()} y FABRICANTE: ${order.manufacturer}`:'Selecciona tipo y fabricante'"
      icon="storefront"
      :done="step > 1"
      >
        <q-select
        behavior="menu"
        :dense="true"
        :options-dense="true"
        rounded
        outlined
        option-value="slug"
        option-label="name"
        emit-value
        map-options
        input-debounce="0"
        v-model="order.type"
        color="primary"
        :options="getProduct ? getProduct.types : null"
        lazy-rules
        label="Tipo"
        style="padding: 10px 0px"
        ></q-select>
        <q-select
        behavior="menu"
        :dense="true"
        :options-dense="true"
        rounded
        outlined
        option-value="manufacturer_id"
        option-label="manufacturer"
        emit-value
        map-options
        input-debounce="0"
        v-model="order.manufacturer"
        color="primary"
        :options="manufacturers"
        lazy-rules
        label="Marca"
        @input="step = 2"
        ></q-select>
        <q-stepper-navigation class="flex">
          <q-space></q-space>
          <q-btn
          v-if="order.type != null && order.manufacturer != null"
          @click="step = 2"
          color="primary"
          icon="arrow_downward"
          flat rounded
          ></q-btn>
        </q-stepper-navigation>
      </q-step>
      <q-step
      :name="2"
      :title="order.variant != null ?`LINEA: ${order.line} MODELO: ${$store.getters.getVariant(order.variant).name}`:'Selecciona modelo'"
      icon="storefront"
      :done="step > 2"
      >
        <q-select
        behavior="menu"
        :dense="true"
        :options-dense="true"
        v-if="getType && getType.lines > 0"
        :options="lines"
        rounded
        outlined
        option-value="slug"
        option-label="name"
        v-model="order.line"
        emit-value
        map-options
        input-debounce="0"
        color="primary"
        style="padding: 10px 0px"
        label="Seleccione material"
        lazy-rules
        ></q-select>
        <q-select
        behavior="menu"
        :rules="[ val => val || 'Requerido']"
        :options="variants"
        :dense="true"
        :options-dense="true"
        rounded
        outlined
        @input="chargeColors"
        option-value="id"
        option-label="name"
        v-model="order.variant"
        emit-value
        map-options
        input-debounce="0"
        color="primary"
        label="Seleccione modelo"
        lazy-rules
        ></q-select>
        <q-stepper-navigation class="flex">
          <q-btn @click="step = 1" color="primary" icon="arrow_upward" flat rounded></q-btn>
          <q-space></q-space>
          <q-btn v-if="order.color != null" @click="step = 3" color="primary" icon="arrow_downward" flat rounded></q-btn>
        </q-stepper-navigation>
      </q-step>
      <q-step
      :name="3"
      :title="order.color != null ?`COLOR: ${order.color.color} `:'Selecciona color'"
      icon="storefront"
      :done="step > 3"
      >
        <q-select
        behavior="menu"
        :options="colors"
        :dense="true"
        :options-dense="true"
        :disable="disabledSelectColor"
        :loading="loadingColors"
        @input="selectColor(order.color)"
        rounded
        outlined
        option-label="color"
        v-model="order.color"
        emit-value
        map-options
        input-debounce="0"
        color="primary"
        label="Seleccione color"
        style="padding: 10px 0px"
        lazy-rules>
        </q-select>
        <q-img
        v-if="order.color != null"
        :src="`https://rollux.com.mx/img/modelos/medium/${order.type}/${order.manufacturer}/${order.color.code}.jpg`"
        style="height: 100px; max-width: 100%"
        >
          <template v-slot:error>
            <q-img
            :src="`https://rollux.com.mx/img/modelos/medium-unavailable.jpg`"
            style="height: 100px; max-width: 100px"
            ></q-img>
          </template>
        </q-img>
        <q-stepper-navigation class="flex">
          <q-btn @click="step = 2" color="primary" icon="arrow_upward" flat rounded></q-btn>
          <q-space></q-space>
          <q-btn @click="step = 4" color="primary" icon="arrow_downward" flat rounded></q-btn>
        </q-stepper-navigation>
      </q-step>
      <q-step
      :name="4"
      title="Selecciona Medidas"
      icon="storefront"
      :done="step > 4"
      >
        <q-form ref="sizeform">
          <q-input
          stack-label
          dense
          label-slot
          type="number"
          :disable="disabledSelectSize"
          v-model="order.canvas[0].width"
          :rules="[
            buttonCanvasRules(maxwidth, 0),
            ...widthCanvasRules(getType ? getType.min_width : 0, maxwidth,0)
          ]"
          rounded
          :reactive-rules="true"
          outlined>
            <template v-slot:label>
              <em class="q-px-sm bg-deep-orange-5 text-white rounded-borders">
                Ancho de {{ widthMargins }} metros
              </em>
            </template>
          </q-input>
          <q-input
          stack-label
          label-slot
          type="number"
          :dense="true"
          :disable="disabledSelectSize"
          v-model="order.canvas[0].height"
          :rules="[
            ...heightCanvasRules(getType ? getType.min_height : 0, maxheight,0)
          ]"
          rounded
          outlined>
          <template v-slot:label>
              <em class="q-px-sm bg-deep-orange-5 text-white rounded-borders">
                Alto de {{ heightMargins }} metros
              </em>
            </template>
          </q-input>
        </q-form>
        <q-stepper-navigation class="flex">
          <q-btn @click="step = 3" color="primary" icon="arrow_upward" flat rounded></q-btn>
          <q-space></q-space>
          <q-btn @click="checkSizes()" color="primary" icon="arrow_downward" flat rounded></q-btn>
        </q-stepper-navigation>
      </q-step>
      <q-step
      :name="5"
      :title="order.motor_type != null? `Accionamiento: ${order.motor_type}` : 'Selecciona Accionamiento'"
      icon="storefront"
      :done="step > 5"
      >
        <q-option-group
        v-model="order.motor_type"
        :options="motor_type_options"
        color="primary"
        inline
        ></q-option-group>
        <q-stepper-navigation class="flex">
          <q-btn @click="step = 4" color="primary" icon="arrow_upward" flat rounded></q-btn>
          <q-space></q-space>
          <q-btn @click="step = 6" color="primary" label="saltar" flat rounded></q-btn>
        </q-stepper-navigation>
      </q-step>
      <q-step
      :name="6"
      title="Últimas acciones"
      icon="storefront"
      :done="step > 6"
      >
        <q-stepper-navigation class="flex justify-center">
           <q-btn @click="step = 4" color="primary" label="atrás" flat rounded></q-btn>
          <q-btn label="TERMINAR PERSIANA" @click="addBlind()" color="orange"></q-btn>
          <!-- <q-btn color="green" label="REALIZAR PEDIDO"></q-btn>
          <q-btn color="green" outline label="GUARDAR COTIZACIÓN"></q-btn> -->
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
    <q-footer>
      <q-tabs v-model="tab" class="text-white">
        <q-tab>
           PERSIANA ACTUAL
          <div style="font-size: 1em !important;line-height: normal;" >
              {{ mxCurrencyFormat.format(unitaryPrice) }} MXN
          </div>
        </q-tab>
        <q-route-tab :to="{name:'Quoted'}">
          <q-badge color="red" floating>{{ $store.state.orders.orders.length }} </q-badge>
          TOTAL:
          <div style="font-size: 1em !important;line-height: normal;" >
              {{mxCurrencyFormat.format($store.getters.totalPrice) }} MXN
          </div>
        </q-route-tab>
      </q-tabs>
    </q-footer>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      motor_type_options: [
        {
          label: 'Manual',
          value: 'Manual'
        },
        {
          label: 'Motorizado',
          value: 'Motorizado'
        }
      ],
      step: 1,
      tab: null,
      editable: false,
      showButtonDialog: false,
      disabledSelectColor: true,
      disabledSelectSize: true,
      loadingColors: false,
      mxCurrencyFormat: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
      disabledFrameRadio: true,
      order: {
        manufacturer: null,
        type: null,
        line: null,
        variant: null,
        variant2: null,
        color: null,
        canvas: [
          { width: null, height: null }
        ],
        price: 0,
        motor_type: null,
        rotate: false
      },
      defaultOrder: {
        manufacturer: null,
        type: null,
        line: null,
        variant: null,
        variant2: null,
        color: null,
        canvas: [
          { width: null, height: null }
        ],
        price: 0,
        motor_type: null,
        rotate: false
      },
      widthMargins: null,
      heightMargins: null
    }
  },
  name: 'PageIndex',
  methods: {
    checkSizes () {
      this.$refs.sizeform.validate().then(success => {
        if (success) {
          this.step = 5
        }
      })
    },
    chargeColors () {
      this.step = 3
      this.loadingColors = true
      this.disabledSelectColor = true
      this.disabledSelectSize = true

      this.$store.dispatch('getRelatedColors', this.order.variant).then(() => {
        this.loadingColors = false
        this.disabledSelectColor = false
        this.disabledSelectSize = false
      })
    },

    selectColor (color) {
      this.disabledFrameRadio = false
      if (this.order.color.rotate) {
        this.rotate = true
      } else {
        this.rotate = false
      }
    },
    addBlind () {
      this.order.price = this.unitaryPrice
      this.$store.dispatch('addToOrder', this.order).then(() => {
        this.order = Object.assign({}, this.defaultOrder)
        this.order.canvas = [{ width: null, height: null }]
        this.step = 1
      })
    },

    calculateHeightMargins (w) {
      this.heightMargins = this.getType.min_height + ' a ' + w
    },

    calculateWidthMargins (w) {
      this.widthMargins = this.getType.min_width + ' a ' + w
    },

    widthCanvasRules (min, max, index) {
      // const n = parseFloat(this.order.canvas[index].width)
      return val => (val && !isNaN(val) && val >= min && val <= max) || 'Requerido'
    },

    heightCanvasRules (min, max, index) {
      return val => (val && !isNaN(val) && val >= min && val <= max) || 'Requerido'
    },

    buttonCanvasRules (max, index) {
      const n = parseFloat(this.order.canvas[index].width)
      if (this.getType) {
        if (n > max && (this.getType.name === 'ENROLLABLE' || this.getType.name === 'ROMANA')) {
          this.showButtonDialog = true
          return 'Si tu ventana revasa los limites permitidos puedes agregar más lienzos'
        } else {
          this.showButtonDialog = false
          return true
        }
      } else {
        return true
      }
    },

    chargeWoodPrices () {

    }
  },

  computed: {
    ...mapState({
      colors: (state) => state.products.relatedColors,
      orders: (state) => state.orders.orders
    }),

    manufacturers () {
      if (this.order.type) {
        const m = this.$store.state.products.variants.filter((v) => v.type === this.order.type)
        return [...new Set(m.map(item => item.manufacturer))]
      }
      return null
    },

    getProduct () {
      return this.$store.getters.getTypes('PERSIANAS')
    },

    getType () {
      if (this.getProduct && this.order.type) {
        return this.getProduct.types.find(
          (type) => type.slug === this.order.type
        )
      }
      return null
    },

    lines () {
      if (this.getType) return this.$store.getters.getLines(this.getType.slug)
      return null
    },

    maxheight () {
      if (this.getType && this.variant) {
        if (this.order.rotate) {
          this.calculateHeightMargins(this.variant.width - 2)
          return (this.variant.width - 0.2)
        }
        if (this.getType.max_height <= 0) {
          this.calculateHeightMargins(this.maxwidth)
          return this.maxwidth
        } else {
          this.calculateHeightMargins(this.getType.max_height)
          return this.getType.max_height
        }
      } else {
        return 0
      }
    },

    maxwidth () {
      if (this.getType && this.variant) {
        if (this.order.rotate) {
          this.calculateWidthMargins(this.getType.max_width_rot)
          return (this.getType.max_width_rot)
        }
        if (this.getType.max_width <= 0) {
          this.calculateWidthMargins(parseFloat(this.variant.width - this.getType.profit_margin).toFixed(2))
          return (parseFloat(this.variant.width - this.getType.profit_margin).toFixed(2))
        } else {
          this.calculateWidthMargins(this.getType.max_width)
          return parseFloat(this.getType.max_width).toFixed(2)
        }
      } else {
        return 0
      }
    },

    variants () {
      if (this.order.type && this.order.line && this.order.manufacturer) {
        return this.$store.state.products.variants.filter(
          (variant) =>
            variant.type === this.order.type && variant.line === this.order.line
        )
      } else if (this.order.type && this.order.manufacturer) {
        return this.$store.state.products.variants.filter(
          (variant) => variant.type === this.order.type
        )
      }
      return null
    },

    variant () {
      if (this.order.variant) {
        return this.$store.state.products.variants.find(
          (variant) => variant.id === this.order.variant
        )
      }
      return null
    },

    variantTwo () {
      if (this.order.variant2) {
        return this.$store.state.products.variants.find((variant) => variant.id === this.order.variant2)
      }
      return null
    },

    unitaryPrice () {
      if (this.order.variant2 != null) {
        const partialHeight = this.order.canvas[0].height / 2
        let price = 0
        if (this.order.canvas[0].width > 1 && partialHeight > 1) {
          return parseFloat((this.variant.price * this.order.canvas[0].width * partialHeight) + (this.variantTwo.price * this.order.canvas[0].width * partialHeight))
        } else if (this.order.canvas[0].width > 1) {
          price = parseFloat((this.variant.price * this.order.canvas[0].width) + (this.variantTwo.price * this.order.canvas[0].width))
          return price
        } else if (partialHeight > 1) {
          price = parseFloat((this.variant.price * partialHeight) + (this.variantTwo.price * partialHeight))
          return price
        } else {
          price = parseFloat(this.variant.price) + parseFloat(this.variantTwo.price)
          return price
        }
      } else if (this.order.canvas.length > 0 && this.variant) {
        let price = 0
        for (let index = 0; index < this.order.canvas.length; index++) {
          if (this.order.canvas[index].width > 1 && this.order.canvas[index].height > 1) {
            price += parseFloat(this.variant.price * this.order.canvas[index].width * this.order.canvas[index].height)
          } else if (this.order.canvas[index].width > 1) {
            price += parseFloat(this.variant.price * this.order.canvas[index].width)
          } else if (this.order.canvas[index].height > 1) {
            price += parseFloat(this.variant.price * this.order.canvas[index].height)
          } else {
            price += parseFloat(this.variant.price)
          }
        }
        return price
      } else if (this.variant) {
        return this.variant.price
      } else {
        return 0
      }
    }
  },

  beforeCreate () {
    this.$store.dispatch('getProducts')
    this.$store.dispatch('getLines')
    this.$store.dispatch('getAllVariants')
  }
}
</script>
