<template>
  <q-page>
    <q-card class="my-card" flat>
      <!-- <q-card-section>
        <q-img></q-img>
      </q-card-section> -->

      <q-tabs dense v-model="tab" class="text-primary">
        <q-tab label="Cuenta" icon="person" name="one"></q-tab>
        <q-tab label="General" name="two" icon="class"></q-tab>
      </q-tabs>

      <q-separator></q-separator>

      <q-tab-panels v-model="tab" animated style="margin: 0; padding: 0;">
        <q-tab-panel name="one" >
          <div>
            <!-- <q-avatar size="110px" class="text-white" color="orange">
              <div style="font-size: 35px">SJ</div>
              <div style="font-size: 15px">Descuento 14%</div>
            </q-avatar> -->
              <q-chip size="30">
                <q-avatar size="30" class="text-white" color="primary">
                  {{user.discount_percent}}%
                </q-avatar>
                Descuento asignado
              </q-chip>
            <q-input class="q-my-sm" label="Nombre(s)" v-model="user.name" rounded outlined color="primary" dense>
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>
            <q-input class="q-my-sm" rounded label="Apellido(s)" v-model="user.last_name" outlined color="primary" dense>
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>
            <q-input class="q-my-sm" rounded outlined label="Email" v-model="user.email" color="primary" dense>
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>
          </div>
        </q-tab-panel>

        <q-tab-panel name="two">
          <q-img height="100px" :src="`https://rollux.com.mx/img/${user.logo}`"></q-img>
          <!-- <q-file
          v-model="filesImages"
          outlined
          dense
          rounded
          label="Tap aquí para agrenar nuevo logo"
          accept=".jpg, image/*"
          @rejected="onRejected">
          </q-file> -->
          <q-input class="q-my-sm" rounded outlined label="Compañía" v-model="user.company" color="primary" dense>
            <template v-slot:prepend>
              <q-icon name="business" />
            </template>
          </q-input>
          <q-input class="q-my-sm" rounded outlined label="Dirección Fisca" v-model="user.address" color="primary" dense>
            <template v-slot:prepend>
              <q-icon name="place" />
            </template>
          </q-input>
          <q-input class="q-my-sm" rounded outlined label="Ciudad" v-model="user.city" color="primary" dense>
            <template v-slot:prepend>
              <q-icon name="corporate_fare" />
            </template>
          </q-input>
          <q-input class="q-my-sm" rounded outlined label="C.P" v-model="user.zip_code" color="primary" dense>
            <template v-slot:prepend>
              <q-icon name="markunread_mailbox" />
            </template>
          </q-input>
          <q-input class="q-my-sm" rounded outlined label="Estado" v-model="user.state" color="primary" dense>
            <template v-slot:prepend>
              <q-icon name="map" />
            </template>
          </q-input>
          <q-input class="q-my-sm" rounded outlined label="Dirección de envío" v-model="user.ship_address" color="primary" dense>
            <template v-slot:prepend>
              <q-icon name="local_shipping" />
            </template>
          </q-input>
          <q-input class="q-my-sm" rounded outlined label="Dirección de envío alterna" v-model="user.second_ship_address" color="primary" dense>
            <template v-slot:prepend>
              <q-icon name="local_shipping" />
            </template>
          </q-input>
          <q-input class="q-my-sm" rounded outlined label="Whatsapp" v-model="user.phone" color="primary" dense>
            <template v-slot:prepend>
              <q-icon name="phone_android" />
            </template>
          </q-input>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
    <q-footer class="bg-white">
      <q-separator></q-separator>
      <q-card-actions>
        <q-space></q-space>
          <q-btn color="primary" rounded class="text-white">
             actualizar información
          </q-btn>
      <q-space></q-space>
      </q-card-actions>
    </q-footer>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      tab: 'one',
      filesImages: null,
      imageurl: 'https://rollux.com.mx/img/logos/rollux.png'
    }
  },

  computed: {
    ...mapState({
      user: (state) => state.user.user
    })
  },

  methods: {
    onRejected (rejectedEntries) {
      this.$q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} file(s) did not pass validation constraints`
      })
    },

    print () {
      const reader = new FileReader()
      reader.readAsDataURL(this.filesImages)
      reader.onload = (e) => {
        this.imageurl = e.target.result
      }
    }
  }
}
</script>
