<template>
  <q-page class="bg-grey-2">
    <q-card bordered style="border-radius: 10px" v-for="(item ,index) in blinds" :key="index">
      <itemQuotation :item="item"></itemQuotation>
    </q-card>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import itemQuotation from '../components/ItemQuotation.vue'
export default {
  data () {
    return {
    }
  },

  computed: {
    ...mapState({
      blinds: (state) => state.orders.blinds
    })
  },

  components: {
    itemQuotation
  }
}
</script>
