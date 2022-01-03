<template>
  <q-page class="flex">
    <div style="width: 100%;" v-if="loaded">
      <q-toolbar class="bg-grey-9 text-white shadow-2">
        <q-tabs mobile-arrows v-model="tab" shrink stretch >
          <q-tab v-for="(o, index) in quotedOrder.blinds" :key="o.id" :name="`tab${(index+1)}`" :label="`Persiana ${(index + 1)}`">
          </q-tab>
        </q-tabs>
      </q-toolbar>
      <q-tab-panels v-model="tab" animated >
        <q-tab-panel v-for="(o, index) in quotedOrder.blinds" :key="o.id" :name="`tab${(index+1)}`">
          <q-card class="my-card" flat bordered>
            <q-card-actions>
              <q-btn flat color="red" round icon="delete_forever" @click="openRemoveOneBlindDialog(o.id)" :disable="(quotedOrder.blinds.length < 2) == true ? true : false">
              </q-btn>
              <q-space></q-space>
              <q-btn flat color="teal-3" round icon="edit" @click="openEditDialog(o.id)">
              </q-btn>
            </q-card-actions>
            <q-separator></q-separator>
            <q-card-section v-if="o.celular_variant != null" class="flex justify-center">
              <div class="text-overline">{{o.celular_variant.title}}</div>
            </q-card-section>
            <q-card-section v-else class="flex justify-center" >
               <div class="text-overline">{{$store.getters.getVariant(o.variant, o.type).name}}</div>
            </q-card-section>
            <q-card-section horizontal>
              <q-card-section class="q-pt-xs" >
                <div class="text-caption" style="font-size: 10px !important">
                  <div>TIPO: {{ o.type.toUpperCase() }}</div>
                  <div>FABRICANTE: {{ $store.getters.getVariant(o.variant, o.type).line.slug }}</div>
                  <div v-if="o.line != null">LINEA: {{ o.line.toUpperCase() }}</div>
                  <div v-if="o.celular_variant != null">COLOR DIA: {{ o.color.color }} </div>
                  <div v-else>COLOR: {{ o.color.color }} </div>
                  <div>SKU: {{ o.color.code }} </div>
                  <div v-if="o.second_color != null">COLOR NOCHE: {{ o.second_color.color }} </div>
                  <div v-if="o.second_color != null">SKU: {{ o.second_color.code }} </div>
                  <div>PRECIO BASE: {{mxCurrencyFormat.format(o.base_price)}} MXN</div>
                  <div>DESCUENTO: {{quotedOrder.user.discount_percent}} %</div>
                  <div>PRECIO NETO CON DESCTO: {{mxCurrencyFormat.format(o.discount_price)}} MXN</div>
                   <!-- <q-item-label lines="1" class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
                      <span>
                        PRECIO BASE: ${{$store.getters.getVariant(o.variant, o.type).price}} MXN
                      </span>
                    </q-item-label> -->
                </div>
              </q-card-section>

              <q-card-section class="col-4 flex flex-center" v-if="o.variant2 === null">
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
              <q-card-section class="col-4 flex flex-center" v-else>
                <q-img
                  class="rounded-borders q-pa-sm"
                  width="80px"
                  height="65px"
                  :src="`https://rollux.com.mx/img/modelos/medium/${o.type}/${o.manufacturer}/${o.color.code}.jpg`"
                >
                  <template v-slot:error>
                    <q-img
                    src="https://rollux.com.mx/img/modelos/medium-unavailable.jpg"
                    class="rounded-borders"
                    width="80px"
                    height="65px"
                    ></q-img>
                  </template>
                </q-img>
                <q-img
                  class="rounded-borders q-pa-sm"
                  width="80px"
                  height="65px"
                  :src="`https://rollux.com.mx/img/modelos/medium/${o.type}/${o.manufacturer}/${o.second_color.code}.jpg`"
                >
                  <template v-slot:error>
                    <q-img
                    src="https://rollux.com.mx/img/modelos/medium-unavailable.jpg"
                    class="rounded-borders"
                    width="80px"
                    height="65px"
                    ></q-img>
                  </template>
                </q-img>
              </q-card-section>
            </q-card-section>
            <q-item-label style="padding-left: 15px">MEDIDAS</q-item-label>
            <q-chip dense v-for="(c, index) in o.canvas" :key="index">
              <q-avatar color="black" text-color="white"> {{index + 1}} </q-avatar>
              Alto: {{c.height}}m
              <q-separator class="q-mx-sm" vertical></q-separator>
              Ancho: {{c.width}}m
            </q-chip>
            <!-- <q-list dense >
              <q-item >
              <q-item-section >
                <q-item-label caption>
                  <div class="text-bold"  style="display: inline">LIENZO {{ index + 1 }}</div>
                  <div style="display: inline">ALTO: {{ c.height }}m</div>
                  <div style="display: inline">ANCHO: {{ c.width }}m</div>
                </q-item-label>
              </q-item-section>
              </q-item>
            </q-list> -->
            <q-card-section >
              <div class="text-overline">{{o.motor.drive}}</div>
              <div class="text-overline">{{o.motor_type}}</div>
              <div class="text-overline" v-if="o.celular_type">{{o.celular_type}} - {{o.celular_drive}}</div>
              <q-item dense v-if="o.motor.side_control != null">
                <q-item-section>Lado del mando o motor</q-item-section>
                <q-item-section side>{{o.motor.side_control.toUpperCase()}}</q-item-section>
              </q-item>
              <q-item dense v-if="o.instalation_side != null">
                <q-item-section>Tipo de instalación</q-item-section>
                <q-item-section side>{{o.instalation_side.toUpperCase()}}</q-item-section>
              </q-item>
              <q-item dense v-if="o.motor.instalation_side != null">
                <q-item-section>Tipo de instalación</q-item-section>
                <q-item-section side>{{o.motor.instalation_side.toUpperCase()}}</q-item-section>
              </q-item>
              <q-item dense v-if="o.motor.rail_color != null">
                <q-item-section>Riel</q-item-section>
                <q-item-section side>{{o.motor.rail_color}}</q-item-section>
              </q-item>
              <q-item dense v-if="o.motor.height_control != null">
                <q-item-section>Alto de mando</q-item-section>
                <q-item-section side>{{o.motor.height_control}}</q-item-section>
              </q-item>
              <q-item dense v-if="o.motor.panels > 0">
                <q-item-section>Paneles</q-item-section>
                <q-item-section side>{{o.motor.panels}}</q-item-section>
              </q-item>
              <q-item dense v-if="o.motor.selected_panel != null && o.motor.selected_panel != 0">
                <q-item-section>Orientación</q-item-section>
                <q-item-section side>{{o.motor.selected_panel}}</q-item-section>
              </q-item>
              <q-item dense v-if="o.motor.frame != null">
                <q-item-section>Marco</q-item-section>
                <q-item-section side>{{o.motor.frame.toUpperCase()}}</q-item-section>
              </q-item>
              <q-item dense v-if="o.motor.manufacturer != null">
                <q-item-section>Fabricante</q-item-section>
                <q-item-section >{{o.motor.manufacturer.toUpperCase()}}</q-item-section>
                <q-item-label
                v-if="o.motor.manufacturerPrice > 0"
                lines="1"
                class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
                    <span>${{o.motor.manufacturerPrice}}</span>
                  </q-item-label>
              </q-item>
              <q-item dense v-if="o.motor.control_color != null && o.motor.control_color != 0">
                <q-item-section>Color</q-item-section>
                <q-item-section side>{{o.motor.control_color}}</q-item-section>
              </q-item>
              <q-item dense v-if="o.motor.string_type != null">
                <q-item-section>Cadena</q-item-section>
                <q-item-section >{{o.motor.string_type}}</q-item-section>
                <q-item-label
                v-if="o.motor.stringPrice > 0"
                lines="1"
                class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
                  <span>${{o.motor.stringPrice}}</span>
                </q-item-label>
              </q-item>
              <q-item dense>
                <q-item-section>Extra</q-item-section>
                <q-item-label
                lines="1"
                class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
                  <span>${{o.motor.flexiballetPrice + o.extraEnrollable + o.extraVertical}}</span>
                </q-item-label>
              </q-item>
              <q-item dense v-if="o.cloth_holder != null">
                <q-item-section>CON PORTATELA</q-item-section>
              </q-item>
            </q-card-section>
            <q-card-section v-if="o.motor.motor != null && o.motor.motor > 0">
              <q-item tag="label" >
                <q-item-section side>
                  <q-icon name="settings_suggest" color="primary"></q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label>MOTORIZACION</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-btn
                  style="display: inline"
                  color="grey"
                  round
                  flat
                  dense
                  :icon="motorExpanse ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                  @click="motorExpanse = !motorExpanse"
                  ></q-btn>
                </q-item-section>
              </q-item>
              <q-slide-transition>
                <q-item dense v-show="motorExpanse">
                <q-item-section top>
                  <q-item-label lines="1">
                    <span class="text-weight-medium"></span>
                    <span class="text-grey-8"> {{$store.getters.getMotor(o.motor.motor).manufacturer}}-{{$store.getters.getMotor(o.motor.motor).motorizationType}}</span>
                  </q-item-label>
                  <q-item-label caption lines="1">
                   {{$store.getters.getMotor(o.motor.motor).system}}
                  </q-item-label>
                  <q-item-label lines="1" class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
                    <span>{{$store.getters.getMotor(o.motor.motor).price}}</span>
                  </q-item-label>
                </q-item-section>
              </q-item>
              </q-slide-transition>
            </q-card-section>
            <q-separator></q-separator>
            <q-card-section v-if="o.motor.control != null">
              <q-item tag="label" >
                <q-item-section side>
                  <q-icon name="settings_remote" color="primary"></q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label>CONTROL</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-btn
                  style="display: inline"
                  color="grey"
                  round
                  flat
                  dense
                  :icon="controlExpanse ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                  @click="controlExpanse = !controlExpanse"
                  ></q-btn>
                </q-item-section>
              </q-item>
              <q-slide-transition>
                <q-item dense v-show="controlExpanse">
                  <q-item-section top>
                    <q-item-label lines="1">
                      <span class="text-weight-medium"></span>
                      <span class="text-grey-8"> {{o.motor.control.manufacturer}}</span>
                    </q-item-label>
                    <q-item-label caption lines="1">
                    {{o.motor.control.description}}
                    </q-item-label>
                    <q-item-label lines="1" class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
                      <span>{{o.motor.control.price}}</span>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-slide-transition>
            </q-card-section>
            <q-separator></q-separator>
            <q-card-section v-if="o.motor.gallery != null">
              <q-item tag="label" >
                <q-item-section side>
                  <q-icon name="imagesearch_roller" color="primary"></q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label>GALERIA</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-btn
                  style="display: inline"
                  color="grey"
                  round
                  flat
                  dense
                  :icon="galleryExpanse ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                  @click="galleryExpanse = !galleryExpanse"
                  ></q-btn>
                </q-item-section>
              </q-item>
              <q-slide-transition>
                <q-item dense v-show="galleryExpanse">
                  <q-item-section top>
                    <q-item-label lines="1">
                      <span class="text-weight-medium"></span>
                      <span class="text-grey-8"> {{o.motor.gallery.type}}</span>
                    </q-item-label>
                    <q-item-label caption lines="1">
                    {{o.motor.gallery.model}}
                    </q-item-label>
                    <q-item-label
                    v-if="o.motor.galleryPrice > 0"
                    lines="1"
                    class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
                      <span>${{o.motor.galleryPrice}}</span>
                    </q-item-label>
                    <q-item-label
                    v-else
                    lines="1"
                    class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
                      <span>${{o.motor.gallery.price}}</span>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-slide-transition>
            </q-card-section>
            <q-card-section v-if="message != null">
              {{message}}
            </q-card-section>
            <q-card-actions class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
              TOTAL:
              <q-space></q-space>
              {{mxCurrencyFormat.format(
                o.discount_price +
                o.motor.price +
                o.motor.flexiballetPrice +
                o.motor.galleryPrice +
                o.motor.manufacturerPrice +
                o.motor.stringPrice
              )}} MXN
            </q-card-actions>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <q-dialog v-model="removeConfirmDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-red text-white" style="width: 300px">
        <q-card-section class="flex justify-center">
          <div class="text-h6">¿Eliminar orden?</div>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="CANCELAR" @click="closeRemoveDialog()" :disable="isRemovingQuoted" v-close-popup />
          <q-space></q-space>
          <q-separator vertical></q-separator>
          <q-space></q-space>
          <q-btn flat label="ACEPTAR" @click="remove()" :loading="isRemovingQuoted" :disable="isRemovingQuoted" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="removeOneBlindConfirmDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-red text-white" style="width: 300px">
        <q-card-section class="flex justify-center">
          <div class="text-h6">¿Desea eliminar esta persiana?</div>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="CANCELAR" @click="closeRemoveOneBlindDialog()" :disable="isRemovingOneBlind" v-close-popup />
          <q-space></q-space>
          <q-separator vertical></q-separator>
          <q-space></q-space>
          <q-btn flat label="ACEPTAR" @click="removeOneBlind()" :loading="isRemovingOneBlind" :disable="isRemovingOneBlind" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="makeToQuotingConfirmDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-teal-4 text-white" style="width: 300px">
        <q-card-section class="flex justify-center">
          <div class="text-h6">¿Regresar orden al menú de cotizaciones?</div>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="CANCELAR" @click="closeMakeToQuoting()" :disable="isMakingQuoting" v-close-popup />
          <q-space></q-space>
          <q-separator vertical></q-separator>
          <q-space></q-space>
          <q-btn flat label="ACEPTAR" @click="makeToQuoting()" :loading="isMakingQuoting" :disable="isMakingQuoting" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-footer v-if="loaded">
      <q-btn-group spread outline>
        <q-btn color="grey-9"  icon="picture_as_pdf" @click="downloadPDF()" :loading="loadingPDF" :disable="loadingPDF" />
        <q-btn color="grey-9"  icon="delete" @click="openRemoveDialog(item.id)" :loading="isRemovingQuoted" :disable="isRemovingQuoted" />
        <q-btn color="grey-9"  icon="history" @click="openMakeToQuoting(item.id)" :loading="isMakingQuoting" :disable="isMakingQuoting" />
        <q-btn color="grey-9"  icon="credit_card" />
      </q-btn-group>
    </q-footer>
  </q-page>
</template>

<script>
import { api } from 'boot/axios'
import { mapState } from 'vuex'
export default {
  created () {
    this.loadCurrentQuoted()
  },
  data () {
    return {
      loaded: false,
      message: null,
      loadingPDF: false,
      selectedId: -1,
      selectedBlindId: -1,
      makeToQuotingConfirmDialog: false,
      removeConfirmDialog: false,
      removeOneBlindConfirmDialog: false,
      galleryExpanse: false,
      motorExpanse: false,
      controlExpanse: false,
      mxCurrencyFormat: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
      tab: 'tab1',
      isRemovingQuoted: false,
      isRemovingOneBlind: false,
      isMakingQuoting: false,
      isSavingAsOrder: false
    }
  },

  computed: {
    ...mapState({
      user: (state) => state.user.user,
      quotedOrder: (state) => state.orders.quotedOrder
    })
  },

  methods: {
    loadCurrentQuoted () {
      this.$store.dispatch('getQuotedOrder', this.item.id).then(() => {
        this.loaded = true
      })
    },

    makeToQuoting () {
      if (this.selectedId > -1) {
        this.isMakingQuoting = true
        this.$store.dispatch('removeOrderMarketcar', this.selectedId).then(async () => {
          await this.$store.dispatch('getQuotedOrders')
          await this.$store.dispatch('getQuotingOrders')
          this.closeMakeToQuoting()
          this.$router.push({ name: 'Marketcar' })
        })
      }
    },

    remove () {
      if (this.selectedId > -1) {
        this.isRemovingQuoted = true
        this.$store.dispatch('deleteQuoted', this.selectedId).then(() => {
          this.closeRemoveDialog()
          this.$router.push({ name: 'Marketcar' })
        })
      }
    },

    removeOneBlind () {
      if (this.selectedBlindId > -1) {
        this.isRemovingOneBlind = true
        this.$store.dispatch('deleteBlindFromOrder', this.selectedBlindId).then(async () => {
          const idQuoted = this.item.id
          await this.$store.dispatch('getQuotedOrders')
          await this.$store.dispatch('getQuotedOrder', idQuoted)
          this.tab = 'tab1'
          this.closeRemoveOneBlindDialog()
        })
      }
    },

    openRemoveDialog (id) {
      this.removeConfirmDialog = true
      this.selectedId = id
    },

    openRemoveOneBlindDialog (id) {
      this.removeOneBlindConfirmDialog = true
      this.selectedBlindId = id
    },

    closeRemoveOneBlindDialog () {
      this.isRemovingOneBlind = false
      this.removeOneBlindConfirmDialog = false
      this.selectedBlindId = -1
    },

    closeRemoveDialog () {
      this.isRemovingQuoted = false
      this.removeConfirmDialog = false
      this.selectedId = -1
    },

    openMakeToQuoting (id) {
      this.makeToQuotingConfirmDialog = true
      this.selectedId = id
    },

    closeMakeToQuoting () {
      this.isMakingQuoting = false
      this.makeToQuotingConfirmDialog = false
      this.selectedId = -1
    },

    async downloadPDF () {
      this.loadingPDF = true
      console.log(this.quotedOrder)
      console.log(this.user)
      await api.post('/api/auth-order-list-pdf-distributor', { orders: this.quotedOrder.blinds, user: this.user }, { responseType: 'blob' }).then((response) => {
        const blob = new Blob([response.data])
        if (typeof cordova !== 'undefined') {
          this.saveBlob2File('modelos.pdf', blob)
        }
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
    createFile (dirEntry, fileName, blob) {
      dirEntry.getFile(fileName, { create: true, exclusive: false }, fileEntry => {
        this.writeFile(fileEntry, blob)
      }, error => {
        this.message = error
      })
    },

    writeFile (fileEntry, dataObj) {
      fileEntry.createWriter(fileWriter => {
        fileWriter.onwriteend = () => {
          console.log('Successful file write...')
        }
        fileWriter.onerror = error => {
          this.message = 'Failed file write: ' + error
        }
        this.loadingPDF = false
        fileWriter.write(dataObj)
      })
    }
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>
