import Vuex from 'vuex'

export default Vuex.createStore({
  state: {
    token:''
  },
  mutations: {
    setToken(state, value) {
      state.token = value
    }
  },
  actions: {
  },
  modules: {
  }
});
