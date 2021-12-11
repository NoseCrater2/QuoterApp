<template>
    <q-slide-item @click="seeDetails()" style="height: 80px" @left="onLeft" @right="onRight" top-color="yellow" left-color="red" right-color="orange" >
      <div style="display: flex; justify-content: space-around;height: 80px">
        <q-item-section >
          <q-avatar  rounded size="48px">
            <img src="/img/blinds.svg" />
            <q-badge style="margin-top: 13px;margin-right: 18px;" floating rounded color="teal">{{item.blinds}}</q-badge>
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label style="color: #009688">{{item.order}}</q-item-label>
          <q-item-label >{{mxCurrencyFormat.format(item.total)}} MXN</q-item-label>
        </q-item-section>
        <q-item-section side>
            <q-badge v-if="item.state == 'No Pagada'" color="black" :label="item.state" />
            <q-badge v-if="item.state == 'En Verificación'" color="yellow" :label="item.state" />
            <q-badge v-if="item.state == 'Recibida'" color="gray" :label="item.state" />
            <q-badge v-if="item.state == 'En produccion'" color="orange" :label="item.state" />
            <q-badge v-if="item.state == 'Paqueteria'" color="blue" :label="item.state" />
            <q-badge v-if="item.state == 'Entregada'" color="green" :label="item.state" />
            <q-badge v-if="item.state == 'Cancelada'" color="red" :label="item.state" />
           <q-badge color="transparent" style="color: gray">
            {{item.created_at}}<q-icon name="add" color="gray" class="q-ml-xs" />
            </q-badge>
            <q-badge color="transparent" style="color: gray">
            {{item.updated_at}}<q-icon name="edit" color="gray" class="q-ml-xs" />
            </q-badge>
            <q-badge color="transparent" style="color: gray">
            {{item.validity}}<q-icon name="schedule" color="gray" class="q-ml-xs" />
            </q-badge>
        </q-item-section>
      </div>
      <template v-slot:left>
        <div class="row items-center"  @click="deleteQuotation(item.id)">
          <q-icon left name="clear" />Eliminar
        </div>
      </template>
      <template v-slot:right>
        <div class="row items-center">
          Editar<q-icon right name="edit" />
        </div>
      </template>
      <!-- <template v-slot:top>
          <div class="row items-center"  @click="deleteQuotation()">
            <q-icon left name="edit" />Editar
          </div>
      </template> -->
    </q-slide-item>
</template>

<script>
export default {
  data () {
    return {
      tab: 'current',
      mxCurrencyFormat: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
    }
  },

  methods: {
    finalize (reset) {
      setTimeout(() => {
        reset()
      }, 1000)
    },
    onLeft ({ reset }) {
      this.finalize(reset)
    },

    onRight ({ reset }) {
      this.finalize(reset)
    },
    deleteQuotation (id) {
      this.$store.dispatch('deleteQuoting', id).then(response => {
        console.log(response)
      })
    },
    seeDetails () {
      console.log('Intento de ver detalles')
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
