import { api } from 'boot/axios'
const orders = {
  state: {
    orders: [],
    blinds: [],
    savedOrders: [],
    quotingOrder: {},
    quotedOrder: {},
    matrix: [],
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
      installmentCharge: 0,
      base_price: 0,
      discount_price: 0,
      count_same_blinds: 1,
      comment: null,
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
          parseFloat(order.motor.stringPrice) +
          parseFloat(order.extraEnrollable) +
          parseFloat(order.extraVertical) +
          parseFloat(order.installmentCharge)
          pt = prices += ((order.count_same_blinds > 0 ? order.count_same_blinds : 1) * pt)
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
      return state.savedOrders.filter(order => order.state !== 'No Pagada').length
    },

    totalMarketcarOrders (state) {
      return state.savedOrders.filter(order => order.state === 'No Pagada').length
    },

    getterVigentQuotings (state) {
      return state.blinds.filter(itemOrder => itemOrder.state === true)
    },

    getterNoVigentQuotings (state) {
      return state.blinds.filter(itemOrder => itemOrder.state === false)
    }

  },

  mutations: {
    setQuotedOrders (state, orders) {
      state.savedOrders = orders
    },
    setQuotedOrder (state, order) {
      state.quotedOrder = order
    },
    setQuotingOrders (state, orders) {
      state.blinds = orders
    },
    setQuotingOrder (state, order) {
      state.quotingOrder = order
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
      state.blinds.splice(state.blinds.indexOf(u), 1)
      state.quotingOrder = JSON.parse(JSON.stringify(Object.assign(state.quotingOrder, {})))
    },

    deleteQuoted (state, deleteOrder) {
      const u = state.savedOrders.find(order => order.id === deleteOrder.id)
      state.savedOrders.splice(state.savedOrders.indexOf(u), 1)
      state.quotedOrder = JSON.parse(JSON.stringify(Object.assign(state.quotedOrder, {})))
    },

    setMatrix (state, matrix) {
      state.matrix = matrix
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

    getQuotingOrder: async function ({ commit, state }, id) {
      try {
        const response = await api
          .get('/api/orders/' + id)
        commit('setQuotingOrder', response.data.data)
      } catch (error) { }
    },

    getQuotedOrders: async function ({ commit, state }) {
      try {
        const response = await api
          .get('/api/orders')
        commit('setQuotedOrders', response.data.data)
      } catch (error) {}
    },

    getQuotedOrder: async function ({ commit, state }, id) {
      try {
        const response = await api
          .get('/api/orders/' + id)
        commit('setQuotedOrder', response.data.data)
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
        await api
          .post('/api/orders', data)
        // commit('setQuotingOrders', response.data.data)
      } catch (error) {}
    },

    saveOrders: async function ({ commit, state }) {
      const data = {}
      data.orders = state.orders
      data.is_quotation = false
      try {
        await api
          .post('/api/orders', data)
        // commit('setQuotedOrders', response.data.data)
      } catch (error) {}
    },

    // ACTUALIZA LA COTIZACION CON LA FECHA Y PRECIO ACTUAL
    revalidateItemQuotation: async function ({ commit, state }, objUpdate) {
      try {
        await api
          .post('/api/revalidate-item-quotation/' + objUpdate.localItemQuotationId, objUpdate.localNewPrice)
      } catch (error) {}
    },

    // CAMBIA DE COTIZACION A ORDEN (USADA EN DETAILSSAVEDBLINDS.vue)
    changeToOrder: async function ({ commit }, id) {
      try {
        const response = await api
          .get('/api/changequoting/' + id)
        commit('deleteQuoting', response.data.data)
      } catch (error) {}
    },

    // ACCIÓN UTILIZADA EN MENU MARKETCAR PARA REGRESAR UNA ORDEN A COTIZACION
    removeOrderMarketcar: async function ({ commit }, id) {
      try {
        await api
          .get('/api/remove-order-marketcar/' + id)
      } catch (error) {}
    },

    // ACCIÓN UTILIZADA EN LA VISTA MARKETCAR PARA ELIMINAR UNA PERSIANA DE LA ORDEN
    deleteBlindFromOrder: async function ({ commit }, id) {
      try {
        await api
          .delete('/api/blinds/' + id)
      } catch (error) {}
    },

    deleteQuoting: async function ({ commit }, id) {
      try {
        const response = await api
          .delete('/api/orders/' + id)
        commit('deleteQuoting', response.data.data)
      } catch (error) {}
    },

    deleteQuoted: async function ({ commit }, id) {
      try {
        const response = await api
          .delete('/api/orders/' + id)
        commit('deleteQuoted', response.data.data)
      } catch (error) {}
    },

    getMatrix: async function ({ commit }, file) {
      try {
        const response = await api.get('/api/' + file)
        commit('setMatrix', response.data)
      } catch (error) {

      }
    }
  }
}

export default orders
