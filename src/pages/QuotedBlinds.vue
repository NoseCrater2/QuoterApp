<template>
  <q-page class="flex">
    <div style="width: 100%;" v-if="$store.state.orders.orders.length > 0">
      <q-toolbar  class="bg-grey-9 text-white shadow-2">
        <q-tabs mobile-arrows v-model="tab" shrink stretch >
          <q-tab  v-for="o in $store.state.orders.orders" :key="o.id" :name="`tab${o.id}`" :label="`Persiana ${o.id}`">
          </q-tab>
        </q-tabs>
      </q-toolbar>
      <q-tab-panels v-model="tab" animated >
        <q-tab-panel v-for="o in $store.state.orders.orders" :key="o.id" :name="`tab${o.id}`">
          <q-card class="my-card" flat bordered>
            <q-card-actions>
              {{mxCurrencyFormat.format(
                 (o.price +
                  o.motor.price +
                  o.motor.flexiballetPrice +
                  o.motor.galleryPrice +
                  o.motor.manufacturerPrice +
                  o.motor.stringPrice +
                  o.extraEnrollable +
                  o.extraVertical +
                  o.installmentCharge) * ((o.count_same_blinds > 0) ? o.count_same_blinds : 1)
              )}} MXN
              <q-space></q-space>
              <q-btn flat color="teal-3" round icon="edit" @click="openEditDialog(o.id)">
              </q-btn>
              <q-btn flat color="red" round icon="delete_forever" @click="openRemoveDialog(o.id)">
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
                   <q-item-label lines="1" class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
                      <span>
                        ${{o.base_price}} MXN
                      </span>
                    </q-item-label>
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
              <q-item dense v-if="o.cloth_holder != null">
                <q-item-section>CON PORTATELA</q-item-section>
              </q-item>
              <q-item dense>
                <q-item-section>Extra</q-item-section>
                <q-item-label
                lines="1"
                class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
                  <span>${{o.motor.flexiballetPrice + o.extraEnrollable + o.extraVertical}}</span>
                </q-item-label>
              </q-item>
               <q-item dense>
                <q-item-section>Cantidas de persianas de este tipo</q-item-section>
                <q-item-section side>{{o.count_same_blinds}}</q-item-section>
              </q-item>
              <q-item dense>
                <q-item-section>Cargo por instalación</q-item-section>
                <q-item-section class="text-primary" side>${{o.installmentCharge}}</q-item-section>
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
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <div v-else class="absolute-center text-grey-7" style="text-align: center" >
      <p  >No hay persianas cotizadas</p>
      <span >Vaya a la sección del cotizador o haga clic en el botón flotante</span>
      <q-btn
      :to="{name: 'Quoter'}"
      fab
      color="primary"
      icon="add"
      class="absolute"
      style="top: 0; right: -50px; transform: translateY(450%);"
      ></q-btn>
    </div>
    <q-dialog v-model="removeConfirmDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-red text-white" style="width: 300px">
        <q-card-section class="flex justify-center">
          <div class="text-h6">¿Eliminar persiana?</div>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="CANCELAR" v-close-popup />
          <q-space></q-space>
          <q-separator vertical></q-separator>
          <q-space></q-space>
          <q-btn flat label="ACEPTAR" @click="remove()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editConfirmDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-teal-4 text-white" style="width: 300px">
        <q-card-section class="flex justify-center">
          <div class="text-h6">¿Editar persiana?</div>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="CANCELAR" v-close-popup />
          <q-space></q-space>
          <q-separator vertical></q-separator>
          <q-space></q-space>
          <q-btn flat label="ACEPTAR" @click="edit()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="newOrdersDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-teal-4 text-white" style="width: 300px">
        <q-card-section class="flex justify-center">
          <div class="text-h6">¿Nuevo pedido?</div>
          <div class="text-center" >Se eliminarán todas las persianas cotizadas actualmente</div>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="CANCELAR" v-close-popup />
          <q-space></q-space>
          <q-separator vertical></q-separator>
          <q-space></q-space>
          <q-btn flat label="ACEPTAR" @click="newOrder()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="pdfOptionsDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 300px">
        <q-card-section class="flex bg-teal-4 text-white">
           <q-btn v-if="showClientForm" @click="showClientForm = false" round flat color="white" dense style="transform: rotate(180deg)" icon="play_arrow" />
          <div class="text-h6">Opciones de PDF</div>
        </q-card-section>
        <q-card-section v-if="!showClientForm">
          <q-list separator>
            <q-item clickable @click="downloadPDF()">
              <q-item-section avatar>
                <q-icon color="primary" name="person"/>
              </q-item-section>
               <q-item-section>Imprimir como distribuidor</q-item-section>
            </q-item>
            <q-item clickable @click="showClientForm = true">
              <q-item-section avatar>
                <q-icon color="primary" name="group"/>
              </q-item-section>
               <q-item-section>Imprimir para cliente</q-item-section>
            </q-item>
            <q-item clickable @click="downloadBasicPdf()">
              <q-item-section avatar>
                <q-icon color="primary" name="print"/>
              </q-item-section>
               <q-item-section>Imprimir sin distribuidor</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-section v-if="showClientForm">
          <q-item-label header class="text-center">Imprimir para un cliente</q-item-label>
          <q-form ref="clientform">
            <q-input v-model="client.name" dense label="Nombre" :rules="[val => !!val ]" hide-bottom-space>
              <template v-slot:prepend><q-icon name="face" /></template>
            </q-input>
            <q-input v-model="client.last_name" dense label="Apellido(s)" :rules="[val => !!val ]" hide-bottom-space>
              <template v-slot:prepend><q-icon name="person" /></template>
            </q-input>
            <q-input v-model="client.discount_percent" dense label="Descuento" :rules="[val => !!val ]" hide-bottom-space>
              <template v-slot:prepend><q-icon name="local_offer" /></template>
            </q-input>
            <q-input v-model="client.phone" dense label="Teléfono" :rules="[val => !!val ]" hide-bottom-space>
              <template v-slot:prepend><q-icon name="smartphone" /></template>
            </q-input>
            <q-input v-model="client.email" dense label="Email" :rules="[val => !!val ]" hide-bottom-space>
              <template v-slot:prepend><q-icon name="mail" /></template>
            </q-input>
            <q-input v-model="client.rfc" dense label="RFC" >
              <template v-slot:prepend><q-icon name="attribution" /></template>
            </q-input>
            <q-input v-model="client.company" dense label="Nombre de la empresa" >
              <template v-slot:prepend><q-icon name="business" /></template>
            </q-input>
            <q-input v-model="client.ship_address" dense label="Dirección de envío" >
              <template v-slot:prepend><q-icon name="local_shipping" /></template>
            </q-input>
          </q-form>
        </q-card-section>
        <q-separator></q-separator>
         <q-card-actions>
          <q-btn flat label="CANCELAR" color="red" @click="pdfOptionsDialog = false; showClientForm = false" v-close-popup />
          <q-space></q-space>
          <q-btn flat v-if="showClientForm" label="ACEPTAR" @click="validateClient()" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-footer v-if="$store.state.orders.orders.length > 0">
      <q-btn-group spread outline>
        <q-btn color="grey-9"  icon="add" @click="newOrdersDialog = true" />
        <q-btn color="grey-9"  icon="save" @click="saveBlinds()" :loading="loadingBlinds" />
        <q-btn color="grey-9"  icon="add_shopping_cart" @click="saveAsOrder()" :loading="loadingOrders" />
        <q-btn color="grey-9"  icon="picture_as_pdf" @click="pdfOptionsDialog = true" :loading="loadingPDF" /> <!-- @click="downloadPDF()" -->
      </q-btn-group>
    </q-footer>
  </q-page>
</template>
<script>
import { api } from 'boot/axios'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      showClientForm: false,
      client: {
        name: null,
        last_name: null,
        discount_percent: 0,
        phone: null,
        email: null,
        rfc: null,
        company: null,
        ship_address: null
      },
      defaultClient: {
        name: null,
        last_name: null,
        discount_percent: 0,
        phone: null,
        email: null,
        rfc: null,
        company: null,
        ship_address: null
      },
      loadingBlinds: false,
      loadingOrders: false,
      message: null,
      loadingPDF: false,
      newOrdersDialog: false,
      pdfOptionsDialog: false,
      selectedId: 0,
      editConfirmDialog: false,
      removeConfirmDialog: false,
      galleryExpanse: false,
      motorExpanse: false,
      controlExpanse: false,
      mxCurrencyFormat: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
      tab: 'tab1'
    }
  },

  computed: {
    ...mapState({
      user: (state) => state.user.user
    })
  },

  methods: {
    downloadBasicPdf () {
      api.post('/api/order-list-pdf', this.$store.state.orders.orders, { responseType: 'blob' }).then((response) => {
        const blob = new Blob([response.data])
        if (typeof cordova !== 'undefined') {
          const currenDate = new Date()
          const formattedDate = currenDate.getFullYear() + '' + (currenDate.getMonth() + 1) + '' + currenDate.getDate() + '' + currenDate.getHours() + '' + currenDate.getMinutes() + '' + currenDate.getSeconds()
          this.saveBlob2File(`Cotización-${formattedDate}.pdf`, blob)
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
      }).catch(error => {
        console.log(error)
        this.$q.notify({
          type: 'negative',
          message: 'No se pudo descargar el pdf!'
        })
      })
    },
    validateClient () {
      this.$refs.clientform.validate().then(success => {
        if (success) {
          this.client.id = this.user.id
          api.post('/api/auth-order-list-pdf-distributor', { orders: this.$store.state.orders.orders, user: this.client }, { responseType: 'blob' }).then((response) => {
            const blob = new Blob([response.data])
            if (typeof cordova !== 'undefined') {
              const currenDate = new Date()
              const formattedDate = currenDate.getFullYear() + '' + (currenDate.getMonth() + 1) + '' + currenDate.getDate() + '' + currenDate.getHours() + '' + currenDate.getMinutes() + '' + currenDate.getSeconds()
              this.saveBlob2File(`Cotización-${formattedDate}.pdf`, blob)
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
            this.client = Object.assign(this.defaultClient, {})
            this.pdfOptionsDialog = false
            this.showClientForm = false
          }).catch(error => {
            this.client = Object.assign(this.defaultClient, {})
            this.pdfOptionsDialog = false
            this.showClientForm = false
            console.log(error)
            this.$q.notify({
              type: 'negative',
              message: 'No se pudo descargar el pdf!'
            })
          })
        }
      })
    },

    edit () {
      this.$store.dispatch('assignOrder', this.selectedId).then(() => {
        this.$router.push({ name: 'Quoter', params: { isEditing: true } })
      })
    },

    remove () {
      this.$store.dispatch('removeOrder', this.selectedId).then(() => {
        this.removeConfirmDialog = false
      })
    },

    openRemoveDialog (id) {
      this.removeConfirmDialog = true
      this.selectedId = id
    },

    openEditDialog (id) {
      this.editConfirmDialog = true
      this.selectedId = id
    },
    newOrder () {
      this.$store.dispatch('deleteOrders')
      this.newOrdersDialog = false
    },
    saveBlinds () {
      // if (this.$route.params.order_id) {
      //   this.$store.dispatch('updateQuotations', { 'orders': this.orders, 'id': this.$route.params.order_id })
      // } else {
      this.loadingBlinds = true
      this.$store.dispatch('saveQuotations').then(() => {
        this.$store.dispatch('deleteOrders')
        this.loadingBlinds = false
        this.$router.replace({ name: 'Saved' })
      })
      // }
    },
    saveAsOrder () {
      this.loadingOrders = true
      this.$store.dispatch('saveOrders').then(() => {
        this.$store.dispatch('deleteOrders')
        this.loadingOrders = true
        this.$router.replace({ name: 'Orders' })
      })
    },
    async downloadPDF () {
      this.loadingPDF = true
      await api.post('/api/auth-order-list-pdf-distributor', { orders: this.$store.state.orders.orders, user: this.user }, { responseType: 'blob' }).then((response) => {
        const blob = new Blob([response.data])
        if (typeof cordova !== 'undefined') {
          const currenDate = new Date()
          const formattedDate = currenDate.getFullYear() + '' + (currenDate.getMonth() + 1) + '' + currenDate.getDate() + '' + currenDate.getHours() + '' + currenDate.getMinutes() + '' + currenDate.getSeconds()
          this.saveBlob2File(`Cotización-${formattedDate}.pdf`, blob)
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
        this.loadingPDF = false
      }).catch(error => {
        this.loadingPDF = false
        console.log(error)
        this.$q.notify({
          type: 'negative',
          message: 'No se pudo descargar el pdf!'
        })
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
      // return this.$q(function (resolve, reject) {
      fileEntry.createWriter(fileWriter => {
        fileWriter.onwriteend = () => {
          // resolve()
          console.log('Successful file write...')
        }
        fileWriter.onerror = error => {
          // reject()
          this.message = 'Failed file write: ' + error
        }
        fileWriter.write(dataObj)
      })
      // })
    }
  }
}
</script>
