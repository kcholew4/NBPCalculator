<template>
  <div class="home">
    <div class="container">
      <v-date-picker
        v-if="webSocketConnected"
        class="calendar"
        :min-date="range.min"
        :max-date="range.max"
        :disabled-dates="disabledDays"
        @update:to-page="movePage"
        @dayclick="clickedDate"
        :value="range.max"
        :model-config="{ type: 'string', mask: 'YYYY-MM-DD' }"
      ></v-date-picker>
      <div class="fields">
        <div v-if="webSocketConnected" class="input-group">
          <input v-model.number="amount" type="number" />
          <select v-model="selectedCurrency" v-if="Object.keys(table).length">
            <option disabled value="">Wybierz walutę</option>
            <option
              v-for="(currency, index) in currencies"
              :key="index"
              :value="currency"
            >
              {{ currency }}
            </option>
          </select>
        </div>
        <div v-else>Ładowanie...</div>
        <div class="result">{{ selectedCurrency ? rate : "0.0000" }} PLN</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      amount: null,
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
      return this.table.rates.map((el) => el.code);
    },
    rate() {
      const currency = this.table.rates.find(
        (el) => el.code === this.selectedCurrency
      );
      const exchange = currency.rate * this.amount;
      return exchange.toFixed(4);
    },
  },
  methods: {
    ...mapActions(["fetchRange", "fetchDisabledDays", "fetchTable"]),
    movePage(page) {
      this.fetchDisabledDays(page);
    },
    clickedDate(date) {
      this.fetchTable(date.id);
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
.container {
  padding: 25px;
  max-width: 720px;
  margin: 120px auto 0 auto;
  display: flex;
  background-color: white;
  border-radius: 0.5rem;
}

.fields {
  flex: 1 1 400px;
  margin-left: 25px;
  //padding: 25px;
}

.input-group {
  display: flex;

  input {
    padding: 15px;
    width: 100%;
    outline: none;
    font-size: inherit;
    margin-right: 10px;
    border: 1px solid #cbd5e0;
    border-radius: 0.5rem;
  }

  select {
    font-size: inherit;
    outline: none;
    border: 1px solid #cbd5e0;
    border-radius: 0.5rem;
  }
}

.result {
  margin-top: 50px;
  font-weight: 700;
  font-size: 24px;
}
</style>
