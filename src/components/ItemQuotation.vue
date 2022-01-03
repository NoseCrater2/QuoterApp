<template>
    <!-- @left="onLeft" @right="onRight" top-color="yellow" left-color="red" right-color="orange" draggable="false" -->
    <q-slide-item style="height: 80px" >
      <q-item clickable @click="seeDetails(item)" style="display: flex; justify-content: space-around;height: 80px">
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
      </q-item>
      <!-- <template v-slot:left>
        <div class="row items-center" style="width: 95vw; height: 70px" @click="openDeleteQuotation(item.id)">
          <q-icon left name="clear" />Eliminar
        </div>
      </template>
      <template v-slot:right>
        <div class="row items-center justify-end" style="width: 95vw; height: 70px">
          Editar<q-icon right name="edit" />
        </div>
      </template> -->
      <!-- <template v-slot:top>
          <div class="row items-center"  @click="deleteQuotation()">
            <q-icon left name="edit" />Editar
          </div>
      </template> -->
      <q-dialog v-model="removeConfirmDialog" persistent transition-show="scale" transition-hide="scale">
        <q-card class="bg-red text-white" style="width: 300px">
          <q-card-section class="flex justify-center">
            <div class="text-h6">¿Eliminar cotización?</div>
          </q-card-section>
          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn flat label="CANCELAR" v-close-popup :disable="isDeletingQuotation" @click="closeDeleteQuotation()"/>
            <q-space></q-space>
            <q-separator vertical></q-separator>
            <q-space></q-space>
            <q-btn flat label="ACEPTAR" :disable="isDeletingQuotation" :loading="isDeletingQuotation" @click="deleteQuotation()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-slide-item>
</template>

<script>
export default {
  data () {
    return {
      tab: 'current',
      mxCurrencyFormat: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
      removeConfirmDialog: false,
      isDeletingQuotation: false,
      selectedId: -1
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
    openDeleteQuotation (id) {
      this.removeConfirmDialog = true
      this.selectedId = id
    },
    closeDeleteQuotation () {
      this.removeConfirmDialog = false
      this.isDeletingQuotation = false
      this.selectedId = 0
    },
    deleteQuotation () {
      if (this.selectedId > -1) {
        this.isDeletingQuotation = true
        this.$store.dispatch('deleteQuoting', this.selectedId).then(response => {
          this.$store.dispatch('getQuotingOrders')
          this.closeDeleteQuotation()
        }).catch(() => {
          this.$store.dispatch('getQuotingOrders')
          this.closeDeleteQuotation()
        })
      }
    },
    seeDetails (item) {
      this.$router.push({ name: 'DetailsSavedBlinds', params: { item: item } })
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
