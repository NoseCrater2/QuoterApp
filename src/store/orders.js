const orders = {
  state: {
    orders: []
  },

  getters: {

  },

  mutations: {
    pushProductToCart (state, item) {
      state.orders.push(item)
      // state.orders.push(item)
    }
  },

  actions: {
    addToOrder (context, blind) {
      if (context.state.orders.length === 0) {
        blind.id = 1
      } else {
        blind.id = context.state.orders[context.state.orders.length - 1].id + 1
      }
      context.commit('pushProductToCart', blind)
    }
  }
}

export default orders
