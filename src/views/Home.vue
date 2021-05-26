<template>
  <div class="home">
    <div class="container">
      <loading :active="!webSocketConnected" :is-full-page="true"></loading>
      <div class="table-url">
        Tabela: <a :href="tableUrl" target="_blank">{{ table.table }}</a>
      </div>
      <div style="display: flex">
        <v-date-picker
          class="calendar"
          :min-date="range.min"
          :max-date="range.max"
          :disabled-dates="disabledDays"
          @update:to-page="movePage"
          @dayclick="clickedDate"
          :value="range.max"
        ></v-date-picker>
        <div class="fields">
          <div class="input">
            <input
              v-model.number="amount"
              type="number"
              placeholder="Wpisz kwotę"
            />
          </div>
          <v-select
            :options="currencies"
            placeholder="Wybierz walutę"
            v-model="selectedCurrency"
            class="select"
          ></v-select>
          <div class="result">{{ selectedCurrency ? rate : "0.0000" }} PLN</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import _ from "lodash";

import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  components: {
    Loading,
  },
  data() {
    return {
      amount: 1,
      selectedCurrency: "",
    };
  },
  computed: {
    ...mapState({
      range: (state) => state.rates.range,
      disabledDays: (state) => state.rates.disabledDays,
      table: (state) => state.rates.table,
      webSocketConnected: (state) => state.webSocketConnected,
    }),
    currencies() {
      return _.isEmpty(this.table) ? [] : this.table.rates.map((el) => el.code);
    },
    rate() {
      const currency = this.table.rates.find(
        (el) => el.code === this.selectedCurrency
      );
      const exchange = currency.rate * this.amount;
      return exchange.toFixed(4);
    },
    tableUrl() {
      if (_.isEmpty(this.table)) {
        return "#";
      }

      const number = this.table.table.split("/")[0].padStart(3, "0");
      const date = this.table.date.split("-");
      const id = `a${number}z${date[0].slice(-2)}${date[1]}${date[2]}`;

      return `https://www.nbp.pl/home.aspx?navid=archa&c=/ascx/tabarch.ascx&n=${id}`;
    },
  },
  methods: {
    ...mapActions(["fetchRange", "fetchDisabledDays", "fetchTable"]),
    movePage(page) {
      this.fetchDisabledDays(page);
    },
    clickedDate(date) {
      if (!date.isDisabled) {
        this.fetchTable(date.id);
      }
    },
  },
  created() {
    this.fetchRange();
  },
  mounted() {
    this.fetchTable(this.range.max.toISOString().split("T")[0]);
  },
};
</script>

<style lang="scss" scoped>
.table-url {
  margin-bottom: 15px;

  a {
    text-decoration: none;
    color: #3182ce;

    &:hover {
      text-decoration: underline;
    }
  }
}

.container {
  padding: 25px;
  max-width: 720px;
  margin: 120px auto 0 auto;
  background-color: white;
  border-radius: 0.5rem;
  position: relative;
}

.fields {
  flex: 1 1 400px;
  margin-left: 25px;
  //padding: 25px;
}

.input {
  display: flex;

  input {
    outline: none;
    width: 100%;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid rgba(60, 60, 60, 0.26);
    margin-bottom: 10px;
    font-size: 18px;
  }
}

.result {
  margin-top: 50px;
  font-weight: 700;
  font-size: 24px;
}
</style>
