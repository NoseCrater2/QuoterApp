<template>
  <q-page class="bg-grey-3 q-pa-sm">
      <q-input outlined v-model="search" dense placeholder="Buscar lista" class="bg-white q-mx-sm">
       <template v-slot:prepend>
          <q-icon name="search" />
        </template>
        <template v-slot:append>
          <q-icon name="clear" v-show="search != null" @click="search = null" />
        </template>
     </q-input>
     <q-separator class="q-my-sm"></q-separator>
    <q-pull-to-refresh  @refresh="refresh" :style="`max-height:${maxHeight}px; overflow: scroll`">
      <q-card class="q-ma-sm" flat bordered v-for="item in filteredPrices" :key="item.id">
        <q-item @click="download(item.id)" active clickable>
          <q-item-section avatar>
            <q-avatar square>
              <img :src="`https://rollux.com.mx/img/${item.thumbnail}`">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label caption>
              {{item.title}}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-inner-loading :showing="selected == item.id">
           <q-spinner-puff
          color="primary"
          size="2em"
          />
        </q-inner-loading>
      </q-card>
    </q-pull-to-refresh>
     <q-inner-loading
        :showing="loading"
        color="teal"
    />
  </q-page>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      selected: 0,
      loading: true,
      prices: [],
      search: null,
      current: 1
    }
  },

  created () {
    this.loadData()
  },
  methods: {
    refresh (done) {
      this.loadData()
      done()
    },

    download (id) {
      this.selected = id
      setTimeout(() => {
        this.$q.notify({
          type: 'positive',
          message: 'Pdf guardado en descargas!'
        })
        this.selected = 0
      }, 2000)
    },

    loadData () {
      axios.get('https://rollux.com.mx/api/catalogs').then(response => {
        this.prices = response.data
        this.loading = false
      }).catch(error => {
        this.loading = false
        console.log(error)
      })
    }
  },

  computed: {
    filteredPrices () {
      if (this.search != null) {
        return this.prices.filter(p => p.title.toLowerCase().includes(this.search.toLowerCase()))
      }
      return this.prices
    },
    maxHeight () {
      return (this.$q.screen.height - 125)
    }
  }
}
</script>
