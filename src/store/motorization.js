import { api } from 'boot/axios'
const motorizations = {
  state: {
    motorizations: [],
    controls: [],
    galleries: []
  },
  getters: {
    getMotor: (state) => (id) => {
      return state.motorizations.find((m) => m.id === id)
    }
  },

  mutations: {
    setMotorizations  (state, motorizations) {
      state.motorizations = motorizations
    },

    setControls (state, controls) {
      state.controls = controls
    },

    setGalleries (state, galleries) {
      state.galleries = galleries
    }
  },

  actions: {
    getMotorizations: async function ({ commit, state }) {
      if (state.motorizations.length === 0) {
        try {
          const response = await api
            .get('/api/motorizations')
          commit('setMotorizations', response.data.data)
        } catch (error) {}
      }
    },
    getControls: async function ({ commit, state }) {
      if (state.controls.length === 0) {
        try {
          const response = await api
            .get('/api/controls')
          commit('setControls', response.data.data)
        } catch (error) {}
      }
    },
    getGalleries: async function ({ commit, state }) {
      if (state.galleries.length === 0) {
        try {
          const response = await api
            .get('/api/galleries')
          commit('setGalleries', response.data.data)
        } catch (error) {}
      }
    }
  }
}

export default motorizations
