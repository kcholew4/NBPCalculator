import Vue from "vue";
import Vuex from "vuex";
import * as rates from "./modules/rates";
import createSocketPlugin from "./plugins/io.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    connected: false,
  },
  mutations: {
    SOCKET_IO_CONNECTED(state) {
      state.connected = true;
    },
    SOCKET_IO_DISCONNECTED(state) {
      state.connected = false;
    },
  },
  actions: {},
  getters: {},
  modules: {
    rates,
  },
  plugins: [createSocketPlugin()],
});
