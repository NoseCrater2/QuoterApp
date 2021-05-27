<template>
  <q-page class="flex flex-start">
    <q-form @submit="onSubmit" @reset="onReset" ref="form" style="width: 100%; padding: 30px" >
      <q-select
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
      style="width: 100%; padding: 10px 0px"
      label="Seleccione tipo de persiana"
      lazy-rules
      ></q-select>
      <q-select
      :dense="true"
      :options-dense="true"
      v-if="getType && getType.lines > 0"
      :rules="[(v) => !!v || 'Requerido']"
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
      style="width: 100%; padding: 10px 0px"
      label="Seleccione material"
      lazy-rules
      ></q-select>
      <q-select
      :rules="[(v) => !!v || 'Requerido']"
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
      style="width: 100%; padding: 10px 0px"
      label="Seleccione modelo"
      lazy-rules
      ></q-select>
      <q-select
      :rules="[(v) => !!v || 'Requerido']"
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
      style="width: 100%; padding: 10px 0px"
      label="Seleccione color"
      lazy-rules
      ></q-select>
      <div class="row items-center justify-center">
        <div class="col">
          <q-img
          v-if="order.color != null"
          :src="`https://test.rollux.com.mx/img/modelos/medium/${order.color.code}.jpg`"
          style="height: 140px; max-width: 150px"
          >
          <template v-slot:error>
            <q-img
            :src="`https://test.rollux.com.mx/img/modelos/medium/unavailable.jpg`"
            style="height: 140px; max-width: 150px"
            ></q-img>
          </template>
          </q-img>
        </div>
        <div class="col">
          <span style="font-size: 1em">3.Seleccione las medidas (El mínimo a cobrar es 1.0 x 1.0)</span>
          <q-input
          type="number"
          :dense="true"
          :disable="disabledSelectSize"
          :hint="widthMargins"
          v-model="order.canvas[0].width"
          :rules="[
            buttonCanvasRules(maxwidth, 0),
            ...widthCanvasRules(getType ? getType.min_width : 0, maxwidth,0)
          ]"
          rounded
          outlined
          label="Ancho">
          </q-input>
          <q-input
          type="number"
          :dense="true"
          :disable="disabledSelectSize"
          :hint="heightMargins"
          v-model="order.canvas[0].height"
          :rules="[
            ...heightCanvasRules(getType ? getType.min_height : 0, maxheight,0)
          ]"
          rounded
          outlined
          label="Alto">
          </q-input>
        </div>
      </div>
      <q-btn color="black" class="full-width" label="TERMINAR PERSIANA" @click="addBlind()">
      </q-btn>
    </q-form>
    <q-footer>
      <q-tabs v-model="tab" class="text-white">
        <div>
          PERSIANA
          <div v-if="order.type == 'horizontal-madera-2'" style="color: white; font-size: 1.5em !important;line-height: normal;">
              ddd
          </div>
          <div v-else style="font-size: 1.5em !important;line-height: normal;" >
              {{ mxCurrencyFormat.format(unitaryPrice) }} MXN
          </div>
        </div>
      </q-tabs>
    </q-footer>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      tab: null,
      editable: false,
      showButtonDialog: false,
      disabledSelectColor: true,
      disabledSelectSize: true,
      loadingColors: false,
      mxCurrencyFormat: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
      disabledFrameRadio: true,
      order: {
        type: null,
        line: null,
        variant: null,
        variant2: null,
        color: null,
        canvas: [
          { width: null, height: null }
        ],
        motor_type: null,
        rotate: false
      },
      defaultOrder: {
        variant2: null,
        motor_type: null,
        rotate: false
      },
      widthMargins: null,
      heightMargins: null
    }
  },
  name: 'PageIndex',
  methods: {
    chargeColors () {
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
      if (this.$refs.form.validate()) {
        this.$store.dispatch('addToOrder', this.order).then(() => {
          console.log(this.orders)
          this.order = Object.assign({}, this.defaultOrder)
          this.order.canvas = [{ width: null, height: null }]
          this.$refs.form.resetValidation()
        })
      }
    },

    calculateHeightMargins (w) {
      this.heightMargins = this.getType.min_height + ' a ' + w
    },

    calculateWidthMargins (w) {
      this.widthMargins = this.getType.min_width + ' a ' + w
    },

    widthCanvasRules (min, max, index) {
      const n = parseFloat(this.order.canvas[index].width)
      return ((!isNaN(n) && n >= min && n <= max) || 'Requerido')
    },

    heightCanvasRules (min, max, index) {
      const n = parseFloat(this.order.canvas[index].height)
      return ((!isNaN(n) && n >= min && n <= max) || 'Requerido')
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

    },

    onSubmit () {
      console.log('submit')
    },

    onReset () {
      console.log('reset')
    }
  },

  computed: {
    ...mapState({
      colors: (state) => state.products.relatedColors,
      orders: (state) => state.orders.orders
    }),

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
          // this.heightMargins = this.getType.min_height + ' a ' + w
          this.calculateHeightMargins(this.variant.width - 2)
          return (this.variant.width - 0.2)
        }
        if (this.getType.max_height <= 0) {
          this.calculateHeightMargins(this.maxwidth)
          // this.heightMargins = this.getType.min_height + ' a ' + w
          return this.maxwidth
        } else {
          this.calculateHeightMargins(this.getType.max_height)
          // this.heightMargins = this.getType.min_height + ' a ' + w
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
          // this.widthMargins = this.getType.min_width + ' a ' + w
          return (this.getType.max_width_rot)
        }
        if (this.getType.max_width <= 0) {
          this.calculateWidthMargins(parseFloat(this.variant.width - this.getType.profit_margin).toFixed(2))
          // w = parseFloat(this.variant.width - this.getType.profit_margin).toFixed(2)
          // this.widthMargins = this.getType.min_width + ' a ' + w
          return (parseFloat(this.variant.width - this.getType.profit_margin).toFixed(2))
        } else {
          this.calculateWidthMargins(this.getType.max_width)
          // this.widthMargins = this.getType.min_width + ' a ' + w
          return parseFloat(this.getType.max_width).toFixed(2)
        }
      } else {
        return 0
      }
    },

    variants () {
      if (this.order.type && this.order.line) {
        return this.$store.state.products.variants.filter(
          (variant) =>
            variant.type === this.order.type && variant.line === this.order.line
        )
      } else if (this.order.type) {
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
