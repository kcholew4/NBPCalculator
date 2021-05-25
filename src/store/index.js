import Vue from "vue";
import Vuex from "vuex";

import * as rates from "./modules/rates";
import createWebSocketPlugin from "./plugins/websocket";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    webSocketConnected: false,
    fetching: [],
  },
  mutations: {
    WEBSOCKET_CONNECTED(state) {
      state.webSocketConnected = true;
    },
    FETCH_DATA(state) {
      state.fetching.push("1");
    },
    STOP_FETCHING(state) {
      state.fetching.shift();
    },
  },
  actions: {},
  getters: {
    isFetching(state) {
      return Boolean(state.fetching.length);
    },
  },
  modules: {
    rates,
  },
  plugins: [createWebSocketPlugin()],
});
