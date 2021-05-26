<template>
  <q-page class="flex flex-start">
    <q-form @submit="onSubmit" @reset="onReset"  style="width: 100%; padding: 30px" >
      <q-select
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
      {{ order.color }}
      <q-img
      v-if="order.color != null"
      :src="`https://test.rollux.com.mx/img/modelos/medium/${order.color.code}.jpg`"
      style="height: 140px; max-width: 150px"
      >
      <template v-slot:error>
        <div class="absolute-full flex flex-center bg-negative text-white">
          Cannot load image
        </div>
      </template>
      </q-img>
    </q-form>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      order: {
        type: null,
        line: null,
        variant: null,
        color: null
      }
    }
  },
  name: 'PageIndex',
  methods: {
    chargeColors () {
      this.$store.dispatch('getRelatedColors', this.order.variant).then(() => {})
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
      colors: (state) => state.products.relatedColors
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
    }
  },

  beforeCreate () {
    this.$store.dispatch('getProducts')
    this.$store.dispatch('getLines')
    this.$store.dispatch('getAllVariants')
  }
}
</script>
