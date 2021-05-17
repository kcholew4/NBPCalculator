/* eslint-disable no-unused-vars */
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const socket = new WebSocket("ws://localhost:8080");

export default new Vuex.Store({
  state: {
    availableRange: null,
    disabledDays: [],
    exchangeRates: [],
    webSocketConnected: false,
    ready: false,
  },
  mutations: {
    SET_AVAILABLE_RANGE(state, { min, max }) {
      state.availableRange = { min, max };
    },
    SET_DISABLED_DAYS(state, disabledDays) {
      state.disabledDays = disabledDays;
    },
    SET_EXCHANGE_RATES(state, rates) {
      state.exchangeRates = rates;
    },
    WEBSOCKET_CONNECTED(state, connected) {
      state.webSocketConnected = connected;
    },
    SET_READY(state, ready) {
      state.ready = ready;
    },
  },
  actions: {
    getAvailableRange({ commit }) {
      commit("SET_READY", false);
      socket.send(
        JSON.stringify({
          method: "get_range",
          id: 1,
        })
      );
    },
    getDisabledDays({ commit }, page) {
      commit("SET_READY", false);
      socket.send(
        JSON.stringify({
          method: "get_disabled_days",
          payload: page,
          id: 2,
        })
      );
    },
    getExchangeRates({ commit }, page) {
      commit("SET_READY", false);
      socket.send(
        JSON.stringify({
          method: "get_rates",
          payload: page,
          id: 3,
        })
      );
    },
  },
  getters: {
    tableByDate(state) {
      return (date) => state.exchangeRates.filter((el) => el.date === date)[0];
    },
    currencyCodes(state, getters) {
      return (date) => {
        const table = getters.tableByDate(date);

        if (table) {
          return table.rates.map((el) => el.code);
        }
      };
    },
    exchangeRate(state, getters) {
      return (date, code) => {
        const table = getters.tableByDate(date);
        if (table) {
          const rates = table.rates.filter((el) => el.code === code)[0];
          if (rates) {
            return rates.rate;
          } else {
            return undefined;
          }
        } else {
          return undefined;
        }
      };
    },
    tableNumber(state, getters) {
      return (date) => {
        const table = getters.tableByDate(date);

        if (table) {
          return table.table;
        } else {
          return undefined;
        }
      };
    },
  },
  modules: {},
  plugins: [
    ({ commit }) => {
      socket.onopen = () => {
        commit("WEBSOCKET_CONNECTED", true);
      };

      socket.onmessage = ({ data }) => {
        const parsed = JSON.parse(data);

        switch (parsed.id) {
          case 1:
            commit("SET_AVAILABLE_RANGE", parsed.response);
            commit("SET_READY", true);
            break;
          case 2:
            commit("SET_DISABLED_DAYS", parsed.response);
            commit("SET_READY", true);
            break;
          case 3:
            commit("SET_EXCHANGE_RATES", parsed.response);
            commit("SET_READY", true);
            break;
          default:
            break;
        }
      };
    },
  ],
});
