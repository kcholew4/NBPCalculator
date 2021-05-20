import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const socket = new WebSocket(process.env.VUE_APP_API_URL);

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
    WEBSOCKET_CONNECTED(state) {
      state.webSocketConnected = true;
    },
    SET_LOADING(state) {
      state.ready = false;
    },
    SET_READY(state) {
      state.ready = true;
    },
  },
  actions: {
    getAvailableRange({ commit }) {
      commit("SET_LOADING");
      socket.send(
        JSON.stringify({
          method: "get_range",
          id: 1,
        })
      );
    },
    getDisabledDays({ commit }, page) {
      commit("SET_LOADING");
      socket.send(
        JSON.stringify({
          method: "get_disabled_days",
          payload: page,
          id: 2,
        })
      );
    },
    getExchangeRates({ commit }, page) {
      commit("SET_LOADING");
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
        commit("WEBSOCKET_CONNECTED");
      };

      socket.onmessage = ({ data }) => {
        const parsed = JSON.parse(data);

        switch (parsed.id) {
          case 1:
            commit("SET_AVAILABLE_RANGE", parsed.response);
            commit("SET_READY");
            break;
          case 2:
            commit("SET_DISABLED_DAYS", parsed.response);
            commit("SET_READY");
            break;
          case 3:
            commit("SET_EXCHANGE_RATES", parsed.response);
            commit("SET_READY");
            break;
          default:
            break;
        }
      };
    },
  ],
});
