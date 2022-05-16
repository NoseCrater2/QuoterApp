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
      <q-item-label header class="text-center q-py-sm">
        Seleccione una lista para descargarla en pdf
        {{errors}}
      </q-item-label>
      <q-separator ></q-separator>
    <q-pull-to-refresh  @refresh="refresh" :style="`max-height:${maxHeight}px; overflow: scroll`">
      <q-card class="q-ma-sm" flat bordered v-for="item in filteredPrices" :key="item.id">
        <q-item @click="download(item.id, item.title)" active clickable>
          <q-item-section avatar>
            <q-avatar square>
              <img :src="`https://rollux.com.mx/img/${item.thumbnail}`">
              <q-badge  floating color="teal">pdf</q-badge>
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
      errors: null,
      selected: 0,
      loading: true,
      prices: [],
      search: null,
      current: 1
    }
  },

  created () {
    this.loadData()
    // this.download(1, 'pdfs/archivos/0UIiYwLS0VeOFjjptOU4hVG8w8ucoAXOy5NHT4WJ.pdf')
  },
  methods: {
    refresh (done) {
      this.loadData()
      done()
    },

    download (id, title) {
      this.selected = id
      axios.get('https://rollux.com.mx/api/download-catalogs/' + id, { responseType: 'blob' }).then((response) => {
        const blob = new Blob([response.data])
        if (typeof cordova !== 'undefined') {
          this.saveBlob2File(title + '.pdf', blob)
          this.$q.notify({
            type: 'positive',
            message: 'Pdf guardado en descargas!'
          })
        } else {
          this.$q.notify({
            type: 'warning',
            message: 'Debes iniciar sesión desde un celular.'
          })
        }
        this.selected = 0
      }).catch(error => {
        this.errors = error
        // console.log(error)
        this.$q.notify({
          type: 'negative',
          message: error
        })
        this.selected = 0
      })
    },
    saveBlob2File (fileName, blob) {
      const folder = cordova.file.externalRootDirectory + 'Download'
      window.resolveLocalFileSystemURL(folder, dirEntry => {
        this.createFile(dirEntry, fileName, blob)
      }, error => {
        this.message = 'saveBlob2File ' + error
      })
    },
    loadData () {
      this.$api.get('/api/catalogs').then(response => {
        this.prices = response.data
        this.loading = false
      }).catch(error => {
        this.loading = false
        console.log(error)
      })
    },
    createFile (dirEntry, fileName, blob) {
      dirEntry.getFile(fileName, { create: true, exclusive: false }, fileEntry => {
        this.writeFile(fileEntry, blob)
      }, error => {
        console.log(error)
      })
    },

    writeFile (fileEntry, dataObj) {
      fileEntry.createWriter(fileWriter => {
        fileWriter.onwriteend = () => {
        }
        fileWriter.onerror = error => {
          console.log(error)
        }
        fileWriter.write(dataObj)
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
      return (this.$q.screen.height - 157)
    }
  }
}
</script>
