import _ from "lodash";

export const state = {
  range: {},
  disabledDays: [],
  savedDisabledDays: [],
  table: {},
};

export const mutations = {
  SET_RANGE(state, range) {
    state.range = range;
  },
  SET_DISABLED_DAYS(state, days) {
    state.disabledDays.push(...days);
  },
  SET_SAVED_DISABLED_DAYS(state, key) {
    state.savedDisabledDays.push(key);
  },
  SET_TABLE(state, table) {
    state.table = table;
  },
};

export const actions = {
  getRange({ commit }) {
    this.$socket.emit("table:range", {}, (data) => {
      if (data.ok) {
        commit("SET_RANGE", data.response);
      }
    });
  },
  getDisabledDays({ commit, state }, { year, month }) {
    const key = `${year}/${month}`;

    if (!_.includes(state.savedDisabledDays, key)) {
      this.$socket.emit("table:disabled-days", { year, month }, (data) => {
        if (data.ok) {
          commit("SET_DISABLED_DAYS", data.response);
          commit("SET_SAVED_DISABLED_DAYS", key);
        }
      });
    }
  },
  getTable({ commit }, date) {
    this.$socket.emit("table:get", { date }, (data) => {
      if (data.ok) {
        data.response.rates.push({
          code: "PLN",
          rate: 1,
        });
        commit("SET_TABLE", data.response);
      }
    });
  },
};

export const getters = {
  rangeAvailable(state) {
    return !_.isEmpty(state.range);
  },
  tableAvailable(state) {
    return !_.isEmpty(state.table);
  },
  getCurrencyRate(state, getters) {
    return (code) => {
      if (getters.tableAvailable) {
        const { rate } = state.table.rates.find((el) => el.code === code);
        return rate;
      }
    };
  },
};
