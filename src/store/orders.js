const orders = {
  state: {
    orders: []
  },

  getters: {
    totalPrice (state) {
      let prices = 0
      if (state.orders.length > 0) {
        state.orders.map(function (order) {
          let pt = parseFloat(order.price)
          // parseFloat(order.motor.price) +
          // parseFloat(order.motor.flexiballetPrice) +
          // parseFloat(order.motor.galleryPrice) +
          // parseFloat(order.motor.manufacturerPrice) +
          // parseFloat(order.motor.stringPrice)
          pt = prices += pt
          return pt
        })
      }
      return prices
    }
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
