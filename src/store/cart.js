import { api } from 'boot/axios'
const cart = {
  state: {
    order: null,
    details: null,
    paymentTypes: [],
    selectedType: null
  },
  getters: {
    getSelectedOrderId (state) {
      if (state.order) {
        return state.order.id
      }
      return 0
    }
  },

  mutations: {
    setPaymentOrder (state, order) {
      state.order = order
    },
    removePaymentOrder (state) {
      state.order = null
    },
    removeSelectedType (state) {
      state.selectedType = null
    },
    setDetails (state, details) {
      state.details = details
    },
    setPaymentTypes (state, types) {
      state.paymentTypes = types
    },
    setSelectedType (state, id) {
      state.selectedType = state.paymentTypes.find(pt => pt.id === id)
    }
  },

  actions: {
    setPaymentOrder: function ({ commit }, order) {
      commit('setPaymentOrder', order)
    },

    removePaymentOrder: function ({ commit }) {
      commit('removePaymentOrder')
    },
    removeSelectedType: function ({ commit }) {
      commit('removeSelectedType')
    },
    getOrderDetails: async function ({ commit }, id) {
      try {
        const response = await api
          .get('/api/orders/' + id)
        commit('setDetails', response.data.data)
      } catch (error) {}
    },
    getPaymentTypes: async function ({ commit }, id) {
      try {
        const response = await api
          .get('/api/user-payment-types/' + id)
        commit('setPaymentTypes', response.data)
      } catch (error) {}
    },
    setPaymentType: function ({ commit }, id) {
      commit('setSelectedType', id)
    }

  }
}

export default cart
