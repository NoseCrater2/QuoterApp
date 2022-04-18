<template>
  <q-page>
      <q-tabs
        v-model="tab"
        align="justify"
        class="bg-grey-9 text-white shadow-2 rounded"
        :breakpoint="0"
      >
        <q-tab name="mails" label="actuales">
          <q-badge rounded color="red" floating>2</q-badge>
        </q-tab>
        <q-tab name="alarms" label="anteriores">
          <q-badge rounded color="red" floating>3</q-badge>
        </q-tab>
      </q-tabs>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      tab: 'mails'
    }
  }
}
</script>

<style scoped>
.rounded{
  border-radius: 0 0 25px 25px
}
</style>
