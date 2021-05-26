import { api } from 'boot/axios'
const products = {
  state: {
    products: [],
    types: [],
    lines: [],
    variants: [],
    relatedColors: []
  },

  getters: {
    getTypes: (state) => (slug) => {
      return state.products.find((t) => t.slug === slug)
    },
    getLines: (state) => (slug) => {
      return state.lines.filter((line) => line.types.includes(slug))
    },

    getVariant: (state) => (id) => {
      return state.variants.find((t) => t.id === id)
    }
  },

  mutations: {
    setProducts (state, products) {
      state.products = products
    },
    setTypes (state, types) {
      state.types = types
    },

    setLines (state, lines) {
      state.lines = lines
    },

    setVariants (state, variants) {
      state.variants = variants
    },

    setRelatedColors (state, colors) {
      state.relatedColors = colors
    }
  },

  actions: {
    getProducts: async function ({ commit }) {
      try {
        api.get('/api/products').then(response => {
          commit('setProducts', response.data.data)
        })
      } catch (error) { }
    },

    // getTypes: async function ({ commit }, idProduct) {
    //   try {
    //     const response = await api
    //       .get('/api/getTypes/' + idProduct)
    //     commit('setTypes', response.data.data)
    //   } catch (error) {}
    // },

    getLines: async function ({ commit, state }) {
      if (state.products.length === 0) {
        try {
          const response = await api
            .get('/api/lines')
          commit('setLines', response.data.data)
        } catch (error) {}
      }
    },

    getAllVariants: async function ({ commit, state }) {
      if (state.variants.length === 0) {
        try {
          const response = await api
            .get('/api/variants')
          commit('setVariants', response.data.data)
        } catch (error) {}
      }
    },

    getRelatedColors: async function ({ commit }, idVariant) {
      try {
        const response = await api
          .get('/api/getColors/' + idVariant)
        commit('setRelatedColors', response.data.data)
      } catch (error) {}
    }
  }
}

export default products
