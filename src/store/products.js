import { api } from 'boot/axios'
const products = {
  state: {
    products: [],
    types: [],
    lines: [],
    variants: [],
    relatedColors: [],
    relatedColors2: []
  },

  getters: {
    getTypes: (state) => (slug) => {
      return state.products.find((t) => t.slug === slug)
    },
    getLines: (state) => (slug) => {
      return state.lines.filter((line) => line.types.includes(slug))
    },

    getVariant: (state) => (slug, type) => {
      return state.variants.find((t) => t.slug === slug && t.type.slug === type)
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
    },

    setRelatedColors2 (state, colors) {
      state.relatedColors2 = colors
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

    getRelatedColors: async function ({ commit }, data) {
      try {
        const response = await api
          .get('/api/getColors/' + data.slug + '/' + data.type)
        commit('setRelatedColors', response.data.data)
      } catch (error) {}
    },

    getRelatedColors2: async function ({ commit }, data) {
      try {
        const response = await api
          .get('/api/getColors/' + data.slug + '/' + data.type)
        commit('setRelatedColors2', response.data.data)
      } catch (error) {
      }
    }
  }
}

export default products
