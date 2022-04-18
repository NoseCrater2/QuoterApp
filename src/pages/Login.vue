<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container >
      <q-page class="bg-primary">
        <q-card class="absolute-center bg-primary text-white"  flat style="width: 95%">
          <q-card-section class="text-center">
            <q-img width="200px"  src="statics/img/white-r.png"></q-img>
          </q-card-section>
          <q-card-section class="text-center">
            Bienvenido al cotizador de Rollux
          </q-card-section>
          <q-card-section>
            <q-input
            rounded
            outlined
            v-model="data.email"
            dense color="black"
            class="q-mb-sm"
            bg-color="white">
             <template v-slot:prepend>
               <q-icon  name="email" />
             </template>
          </q-input>
          <q-input
          rounded
          outlined
          v-model="data.password"
          dense
          :type="isPwd ? 'password' : 'text'"
          color="black"
          class="q-mt-sm"
          bg-color="white">
            <template v-slot:prepend>
              <q-icon  name="vpn_key" />
                </template>
                <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          </q-card-section>
          <q-card-section>
             <q-btn outline rounded color="white" class="full-width q-mt-sm" @click="login" label="iniciar sesión" />
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      isPwd: true,
      data: {
        email: null,
        password: null,
        device_name: this.$q.platform.is.name
      }
    }
  },
  methods: {
    login () {
      this.$store.dispatch('login', this.data).then(() => {
        this.$router.push({ name: 'Home' })
      })
    }
  },

  computed: {
    ...mapState({
      errors: (state) => state.user.errors
    })
  }
}
</script>
