<template>
    <q-page>
      <q-card flat>
        <q-card-section>
          <div v-if="order.motor_type === 'Manual'">
            Lado del control
          </div>
          <div v-if="order.motor_type === 'Motorizado'">
            Lado del motor
          </div>
          <q-option-group
            dense
            inline
            color="primary"
            v-model="motor.side_control"
            :options="(order.type != 'flexibalet' || order.motor_type != 'Motorizado')?motor_sidecontrol_options:motor_sidecontrol_option"
          ></q-option-group>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section v-if="order.type.includes('aluminio')">
          <q-input
          dense
          rounded
          outlined
          suffix="mts"
          type="number"
          label="ALTURA DE MANDO"
          v-model.number="motor.height_control"
          :rules="[ val => val >= 0.5 && val <= 99 || 'Valor entre 0.5 y 99']">
          </q-input>
        </q-card-section>
        <q-card-section v-if="order.type == 'panel-japones'">
          <q-select
          dense
          rounded
          outlined
          options-dense
          behavior="menu"
          :options="panels"
          class="q-pb-sm"
          v-model="motor.panels"
          label="Número de paneles"
          ></q-select>
          <q-btn
          outline
          rounded
          color="primary"
          class="full-width"
          icon-right="expand_more"
          v-show="motor.panels > 0"
          :label="motor.selected_panel ? `Agrupamiento: ${motor.selected_panel}` : 'Seleccionar Agrupamiento'" >
            <q-menu
            fit
            transition-show="scale"
            transition-hide="scale"
            persistent auto-close>
              <q-list>
                <q-item v-for="(p, index) in filteredPanels"
                :key="index"
                clickable
                v-ripple
                @click="motor.selected_panel = p.value"
                :active="motor.selected_panel === p.value"
                active-class="selected-celular-type">
                  <q-item-section class="q-pa-sm" top thumbnail >
                    <img height="40px" width="40px" :src="p.icon">
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ p.label }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-card-section>
        <q-card-section v-if="order.type === 'flexibalet' || order.type === 'vertical'">
          <q-btn
          outline
          rounded
          color="primary"
          class="full-width"
          icon-right="expand_more"
          :label="motor.selected_panel ? `Agrupamiento: ${motor.selected_panel}` : 'Seleccionar Agrupamiento'" >
            <q-menu
            fit
            transition-show="scale"
            transition-hide="scale"
            persistent auto-close>
              <q-list>
                <q-item v-for="(f, index) in flexballets"
                :key="index"
                clickable
                v-ripple
                @click="motor.selected_panel = f.title"
                :active="motor.selected_panel === f.title"
                active-class="selected-celular-type">
                  <q-item-section class="q-pa-sm" top thumbnail >
                    <img height="40px" width="40px" :src="f.img">
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ f.title }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
          <div class="q-mt-sm">
            Tipo de instalación
          </div>
          <q-option-group
          dense
          inline
          color="primary"
          v-model="motor.instalation_side"
          :options="instalation_side_options"
          ></q-option-group>
          <div class="q-mt-sm">
            Marco
          </div>
          <q-option-group
          dense
          inline
          color="primary"
          @click="addGalery()"
          v-model="motor.frame"
          :options="motor_frame_options"
          ></q-option-group>
          <q-select
          dense
          rounded
          outlined
          class="q-my-sm"
          behavior="menu"
          label="Color de riel"
          v-model="motor.rail_color"
          v-if="order.type != 'vertical'"
          :options="['BLANCO','IVORY']"
          ></q-select>
        </q-card-section>
        <q-card-section v-if="order.type === 'horizontal-madera-2' && order.motor_type === 'Manual'">
          <div class="q-mt-sm">
            Tipo de instalación
          </div>
          <q-option-group
          dense
          inline
          color="primary"
          v-model="motor.instalation_side"
          :options="instalation_side_options"
          ></q-option-group>
          <div class="q-mt-sm">
            Marco
          </div>
          <q-option-group
          dense
          inline
          color="primary"
          @click="addGalery()"
          v-model="motor.frame"
          :options="motor_frame_options"
          ></q-option-group>
        </q-card-section>
        <q-card-section v-if="(order.type === 'horizontal-madera-2' && order.motor_type === 'Motorizado') ||
                (order.type.includes('aluminio') && order.motor_type == 'Manual')">
          <div class="q-mt-sm">
            Marco
          </div>
          <q-option-group
          dense
          inline
          color="primary"
          @click="addGalery()"
          v-model="motor.frame"
          :options="motor_frame_options"
          ></q-option-group>
        </q-card-section>
        <q-card-section
         v-if="(order.motor_type == 'Motorizado') && (order.type === 'enrollable' || order.type === 'romana' || order.type === 'panel-japones' || order.type === 'sheer')">
          <div style="border: 1px solid #e0e0e0; border-radius: 15px;">
            <div class="q-ma-sm">
              Características de motor
            </div>
            <q-option-group
            dense
            inline
            color="primary"
            class="q-pa-sm"
            @click="addGalery()"
            v-model="motor.type"
            :options="order.type === 'panel-japones' || order.type === 'sheer'?motor_type_option:motor_type_options"
            ></q-option-group>
            <q-select
              dense
              rounded
              outlined
              class="q-pa-sm"
              behavior="menu"
              options-dense
              label="Fabricante"
              v-model="motor.manufacturer"
              option-value="manufacturer"
              option-label="manufacturer"
              :options="manufacturers">
            </q-select>
            <q-item-label header v-if="filteredControls.length > 0">SELECCIONE MOTOR</q-item-label>
            <q-item-label header v-else>NO HAY MOTORES DISPONIBLES</q-item-label>
            <q-list  separator style="max-height: 155px;overflow: scroll;">
              <q-item
              clickable
              v-ripple
              active-class="bg-teal-1"
              :active="motor.motor === c.id"
              @click="motor.motor = c.id"
              dense
              v-for="(c, index) in filteredControls"
              :key="index">
                <q-item-section>
                  <q-item-label>{{c.code}}</q-item-label>
                  <q-item-label caption>{{c.system}}</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-badge color="teal" :label="`$${c.price}`"></q-badge>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <q-select
          dense
          outlined
          rounded
          options-dense
          emit-value
          map-options
          clearable
          v-if="motor.motor"
          class="q-mt-sm"
          behavior="menu"
          option-label="description"
          :options="controls"
          v-model="motor.control"
          label="Control remoto">
          </q-select>
        </q-card-section>
        <q-card-section
        v-if="(order.motor_type == 'Manual') && (order.type === 'enrollable' || order.type === 'romana')"
        >
          <div class="q-mt-sm" style="display: inline">
            Marca
          </div>
          <q-chip v-if="addManufacturerPrice > 0"  dense color="deep-orange" outline square>
            Se agregará un cargo extra de &nbsp;<strong> ${{addManufacturerPrice}}</strong>
          </q-chip>
          <q-option-group
          dense
          inline
          color="primary"
          v-model="motor.manufacturer"
          :options="manufacturer_options"
          ></q-option-group>
          <q-select
          dense
          rounded
          outlined
          clearable
          options-dense
          class="q-mt-sm"
          behavior="menu"
          color="primary"
          label="Color de control"
          v-model="motor.control_color"
          :options="control_color_options"
          ></q-select>
           <div class="q-mt-sm" style="display: inline">
            Tipo de cadena
          </div>
          <q-chip v-if="addStringPrice > 0"  dense color="deep-orange" outline square>
            Se agregará un cargo extra de &nbsp;<strong> ${{addStringPrice}}</strong>
          </q-chip>
          <q-option-group
          dense
          inline
          color="primary"
          v-model="motor.string_type"
          :options="string_type_options"
          ></q-option-group>
        </q-card-section>
        <q-card-section v-if="filteredGalleries && (order.motor_type == 'Manual' && (order.type == 'enrollable' || order.type == 'romana' || order.type == 'panel-japones' ))">
          <q-chip v-if="addGalleryPrice > 0"  dense color="deep-orange" outline square>
            Se agregará un cargo extra de &nbsp;<strong> ${{addGalleryPrice}}</strong>
          </q-chip>
          <q-select
          dense
          rounded
          outlined
          clearable
          emit-value
          map-options
          options-dense
          behavior="menu"
          color="primary"
          option-label="model"
          label="Galería/Fascia"
          v-model="motor.gallery"
          :options="filteredGalleries"
          ></q-select>
          <q-select
          dense
          rounded
          outlined
          clearable
          emit-value
          map-options
          options-dense
          class="q-mt-sm"
          behavior="menu"
          color="primary"
          option-label="color"
          label="Color"
          v-model="motor.gallery_color"
          :options="motor.gallery.colors"
          v-if="motor.gallery && (order.type != 'romana' && order.type != 'panel-japones' && order.type != 'sheer' && order.type != 'vertical' && order.type != 'horizontal-madera-2')"
          ></q-select>
        </q-card-section>
        <q-card-section>
          <q-input
          rounded
          outlined
          input-style="max-height: 80px;"
          type="textarea"
          label="Comentarios"
          dense
          v-model="motor.comment"
          ></q-input>
        </q-card-section>
      </q-card>
      <q-footer class="bg-white text-teal">
        <q-separator></q-separator>
        <q-card-actions class="q-mx-sm">
          <q-btn push color="primary" @click="save()" round icon="done"></q-btn>
          <q-space></q-space>
            <div class="text-h5">$</div>
            <div class="text-h4">
                {{ maskPrice()[0] }}
            </div>
            <div class="cents">
                 {{ maskPrice()[1] }}
            </div>
          <q-space></q-space>
          <q-btn push color="red" @click="cancel()" round icon="close"></q-btn>
        </q-card-actions>
      </q-footer>
    </q-page>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      string_type_options: [
        {
          label: 'PLÁSTICO',
          value: 'Plástico'
        },
        {
          label: 'METAL',
          value: 'Metal'
        }
      ],
      control_color_options: ['BLANCO', 'IVORY', 'GRIS', 'CHOCOLATE', 'NEGRO'],
      manufacturer_options: [
        {
          label: 'GENÉRICO',
          value: 'genérico'
        },
        {
          label: 'VTX',
          value: 'vtx'
        }
      ],
      motor_type_options: [
        {
          label: 'Recargable (batería)',
          value: 'RECARGABLE'
        },
        {
          label: 'Eléctrico',
          value: 'ELECTRICO'
        }
      ],
      motor_type_option: [
        {
          label: 'Eléctrico',
          value: 'ELECTRICO'
        }
      ],
      motor_frame_options: [
        {
          label: 'Fuera',
          value: 'fuera'
        },
        {
          label: 'Adentro',
          value: 'adentro'
        }
      ],
      instalation_side_options: [
        {
          label: 'A techo',
          value: 'techo'
        },
        {
          label: 'A pared',
          value: 'pared'
        }
      ],
      motor_sidecontrol_options: [
        {
          label: 'Izquierdo',
          value: 'Izquierdo'
        },
        {
          label: 'Derecho',
          value: 'Derecho'
        }
      ],
      motor_sidecontrol_option: [
        {
          label: 'Izquierdo',
          value: 'Izquierdo'
        }
      ],
      panels: [2, 3, 4, 5, 6, 8, 9],
      panelesj: [
        {
          label: 'Lateral',
          value: 'Lateral',
          icon: 'https://www.rollux.com.mx/img/cotizador/paneles/lateral.png',
          matches: [2, 3, 4, 5]
        },
        {
          label: 'Ambos Lados',
          value: 'Ambos Lados',
          icon: 'https://www.rollux.com.mx/img/cotizador/paneles/ambos-lados.png',
          matches: [4, 5, 6, 8, 9]
        },
        {
          label: 'Opuesto',
          value: 'Opuesto',
          icon: 'https://www.rollux.com.mx/img/cotizador/paneles/opuesto.png',
          matches: [2, 3, 4, 5]
        },
        {
          label: 'Centro',
          value: 'Centro',
          icon: 'https://www.rollux.com.mx/img/cotizador/paneles/centro.png',
          matches: [3, 5]
        }
      ],
      flexballets: [
        { title: 'Inverso', img: 'https://www.rollux.com.mx/img/cotizador/flexballet/izquierda.png' },
        { title: 'Normal', img: 'https://www.rollux.com.mx/img/cotizador/flexballet/derecha.png' },
        { title: 'Central', img: 'https://www.rollux.com.mx/img/cotizador/flexballet/central.png' },
        { title: 'Extremos', img: 'https://www.rollux.com.mx/img/cotizador/flexballet/exterior.png' }
      ],
      motor: {
        height_control: null,
        side_control: null,
        price: 0,
        type: null,
        canvas: 0,
        manufacturer: null,
        control: null,
        motor: 0,
        panels: 0,
        control_color: null,
        selected_panel: null,
        string_type: null,
        gallery: null,
        gallery_color: null,
        comment: null,
        instalation_side: null,
        frame: null,
        rail_color: null,
        drive: null,
        flexiballetPrice: 0,
        galleryPrice: 0,
        manufacturerPrice: 0,
        stringPrice: 0
      },
      defaultMotor: {
        height_control: null,
        side_control: null,
        price: 0,
        type: null,
        canvas: 0,
        manufacturer: null,
        control: null,
        motor: 0,
        panels: 0,
        control_color: null,
        selected_panel: 0,
        string_type: null,
        gallery: null,
        gallery_color: null,
        comment: null,
        instalation_side: null,
        frame: null,
        rail_color: null,
        drive: null,
        flexiballetPrice: 0,
        galleryPrice: 0,
        manufacturerPrice: 0,
        stringPrice: 0
      }
    }
  },
  methods: {
    addGallery () {
      if (this.order.type === 'horizontal-madera-2') {
        if (this.motor.frame === 'fuera') {
          this.motor.gallery = this.galleries.find(g => g.model === 'INTERNA')
        } else if (this.motor.frame === 'adentro') {
          this.motor.gallery = this.galleries.find(g => g.model === 'EXTERNA')
        }
      }
    },

    maskPrice () {
      const total = this.motorizationPrice + this.addGalleryPrice + this.addManufacturerPrice + this.addStringPrice
      return parseFloat(total).toFixed(2).toString().split('.')
    },

    cancel () {
      this.$router.push({ name: 'Quoter', params: { externalStep: this.externalStep } })
    },

    save () {
      this.motor.price = this.motorizationPrice
      this.motor.galleryPrice = this.addGalleryPrice
      this.motor.manufacturerPrice = this.addManufacturerPrice
      this.motor.stringPrice = this.addStringPrice
      this.$store.commit('assignDrive', this.motor)
      this.$router.push({ name: 'Quoter', params: { externalStep: this.externalStep } })
    }
  },
  computed: {
    ...mapState({
      order: (state) => state.orders.order,
      controls: (state) => state.motorization.controls,
      galleries: (state) => state.motorization.galleries,
      motorizations: (state) => state.motorization.motorizations
    }),

    addGalleryPrice () {
      let galleryPrice = 0
      if (this.motor.gallery != null) {
        if (this.motor.gallery.model === 'LAMBREQUIN 20 CM') {
          this.order.canvas.forEach(canvas => {
            galleryPrice += (Math.ceil(canvas.width) * 400)
          })
        }
      }
      return galleryPrice
    },

    addManufacturerPrice () {
      if (this.motor.manufacturer === 'vtx' && (this.order.type === 'enrollable' || this.order.type === 'romana')) {
        return 250
      } else {
        return 0
      }
    },

    addStringPrice () {
      let stringPrice = 0
      if (this.motor.string_type === 'Metal' && (this.order.type === 'enrollable' || this.order.type === 'romana')) {
        this.order.canvas.forEach(canvas => {
          if (canvas.height >= 2) {
            stringPrice += 100
          } else {
            stringPrice += 50
          }
        })
      }
      return stringPrice
    },

    filteredControls () {
      const m = this.motorizations.filter((c) => c.manufacturer === this.motor.manufacturer && c.motorizationType === this.motor.type && c.type === this.order.type.toUpperCase())
      return m
    },

    filteredGalleries () {
      if (this.order.type) {
        return this.galleries.filter((g) => g.type === this.order.type.toUpperCase())
      }
      return []
    },

    filteredPanels () {
      if (this.motor.panels > 1) {
        return this.panelesj.filter((pj) =>
          pj.matches.some((j) => j === this.motor.panels)
        )
      } else {
        return []
      }
    },

    manufacturers () {
      return [...new Set(this.motorizations.map(obj => obj.manufacturer))]
    },

    motorizationPrice () {
      if (this.motor.motor !== 0 && this.motor.control != null && this.motorizations) {
        const p = parseFloat(
          this.motorizations.find((m) => m.id === this.motor.motor).price
        )
        const m = parseFloat(this.motor.control.price)
        return p + m
      } else if (this.motor.motor !== 0 && this.motorizations) {
        return parseFloat(
          this.motorizations.find((m) => m.id === this.motor.motor).price
        )
      } else if (this.motor.gallery != null && this.motor.gallery.model !== 'LAMBREQUIN 20 CM') {
        return parseFloat(this.motor.gallery.price)
      } else {
        return 0
      }
    }
  },
  updated () {
    if (this.order.type === 'flexibalet' && this.order.motor_type === 'Motorizado') {
      this.motor.flexiballetPrice = 25500
    }
  },

  props: {
    externalStep: {
      type: Number,
      required: true
    }
  }
}
</script>
<style>
.selected-celular-type{
  border: 1px solid #47a5ad;
}
.cents{
  padding-bottom: 14px;
}
</style>
