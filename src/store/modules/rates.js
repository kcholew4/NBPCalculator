export const state = {
  range: {
    min: new Date(),
    max: new Date(),
  },
  disabledDays: [],
  table: {},
};

export const mutations = {
  SET_RANGE(state, { min, max }) {
    state.range = {
      min: new Date(min),
      max: new Date(max),
    };
  },
  SET_DISABLED_DAYS(state, disabledDays) {
    state.disabledDays = disabledDays;
  },
  SET_TABLE(state, table) {
    state.table = table;
  },
};

export const actions = {
  fetchRange({ commit }) {
    commit("FETCH_DATA", {
      id: 1,
      method: "get_range",
    });
  },
  fetchDisabledDays({ commit }, page) {
    commit("FETCH_DATA", {
      id: 2,
      method: "get_disabled_days",
      payload: page,
    });
  },
  fetchTable({ commit }, date) {
    commit("FETCH_DATA", {
      id: 3,
      method: "get_table",
      payload: date,
    });
  },
};
