export default {
  state: {
    loading: false,
    error: null
  },
  mutations: {
    setLoading(state, payload) {
      state.loading = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
    clearError(state) {
      state.error = null;
    }
  },
  actions: {
    setError({ commit }, payload) {
      commit("setError", payload);
    },
    clearError({ commit }) {
      commit("clearError");
    },
    setLoading({ commit }, payload) {
      commit("setLoading", payload);
    }
  },
  getters: {
    error(state) {
      return state.error;
    },
    loading(state) {
      return state.loading;
    }
  }
};
