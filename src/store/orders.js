import { api } from 'boot/axios'
const orders = {
  state: {
    orders: [],
    blinds: [],
    savedOrders: [],
    order: {
      manufacturer: null,
      type: null,
      line: null,
      variant: null,
      variant2: null,
      color: null,
      second_color: null,
      canvas: [
        { width: null, height: null }
      ],
      celular_type: null,
      celular_drive: null,
      price: 0,
      motor_type: null,
      celular_variant: null,
      rotate: false,
      instalation_side: null,
      cloth_holder: false,
      extraEnrollable: 0,
      extraVertical: 0,
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
      }
    }
  },

  getters: {
    totalPrice (state) {
      let prices = 0
      if (state.orders.length > 0) {
        state.orders.map(function (order) {
          let pt = parseFloat(order.price) +
          parseFloat(order.motor.price) +
          parseFloat(order.motor.flexiballetPrice) +
          parseFloat(order.motor.galleryPrice) +
          parseFloat(order.motor.manufacturerPrice) +
          parseFloat(order.motor.stringPrice)
          pt = prices += pt
          return pt
        })
      }
      return prices
    },

    totalOrders (state) {
      return state.orders.length
    },

    totalBlinds (state) {
      return state.blinds.length
    },

    totalSavedorders (state) {
      return state.savedOrders.length
    }

  },

  mutations: {
    setQuotedOrders (state, orders) {
      state.savedOrders = orders
    },
    setQuotingOrders (state, orders) {
      state.blinds = orders
    },

    pushProductToCart (state, item) {
      state.orders.push(item)
      // state.orders.push(item)
    },

    setPartialBlind (state, blind) {
      state.order = blind
    },

    assignDrive (state, motor) {
      state.order.motor = motor
    },

    removeOrder (state, id) {
      const u = state.orders.find(order => order.id === id)
      state.orders.splice(state.orders.indexOf(u), 1)
    },

    assignOrder (state, id) {
      const o = state.orders.find(order => order.id === id)
      state.order = Object.assign({}, o)
    },

    editOrder (state, item) {
      state.orders.map(function (currentOrder) {
        if (currentOrder.id === item.id) {
          Object.assign(currentOrder, item)
        }
        return currentOrder
      })
    },
    deleteOrders (state) {
      state.orders = []
    },
    deleteQuoting (state, deleteOrder) {
      const u = state.blinds.find(order => order.id === deleteOrder.id)
      state.blinds.splice(state.quotingOrders.indexOf(u), 1)
    }
  },

  actions: {
    addToOrder (context, blind) {
      if (blind.id) {
        context.commit('editOrder', blind)
      } else {
        if (context.state.orders.length === 0) {
          blind.id = 1
        } else {
          blind.id = context.state.orders[context.state.orders.length - 1].id + 1
        }
        context.commit('pushProductToCart', blind)
      }
    },

    addPartialBlind (context, blind) {
      context.commit('setPartialBlind', blind)
    },

    removeOrder (context, id) {
      context.commit('removeOrder', id)
    },

    assignOrder (context, id) {
      context.commit('assignOrder', id)
    },

    getQuotingOrders: async function ({ commit, state }) {
      try {
        const response = await api
          .get('/api/quotations')
        commit('setQuotingOrders', response.data.data)
      } catch (error) { }
    },

    getQuotedOrders: async function ({ commit, state }) {
      try {
        const response = await api
          .get('/api/orders')
        commit('setQuotedOrders', response.data.data)
      } catch (error) {}
    },

    deleteOrders: function (context) {
      context.commit('deleteOrders')
    },
    saveQuotations: async function ({ commit, state }) {
      const data = {}
      data.orders = state.orders
      data.is_quotation = true
      try {
        const response = await api
          .post('/api/orders', data)
        commit('setQuotingOrders', response.data.data)
      } catch (error) {}
    },

    saveOrders: async function ({ commit, state }) {
      const data = {}
      data.orders = state.orders
      data.is_quotation = false
      try {
        const response = await api
          .post('/api/orders', data)
        // commit('setQuotedOrders', response.data.data)
        console.log(response)
      } catch (error) {}
    },
    deleteQuoting: async function ({ commit }, id) {
      try {
        const response = await api
          .delete('/api/orders/' + id)
        commit('deleteQuoting', response.data.data)
      } catch (error) {}
    }
  }
}

export default orders
