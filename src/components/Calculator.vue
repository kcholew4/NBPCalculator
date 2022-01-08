<template>
  <div class="calculator">
    <div class="calculator__header">
      <template v-if="tableAvailable">
        Tabela nr <strong>{{ table.table }}</strong> z dnia {{ table.date }}
      </template>
      <template v-else>Ładowanie tabeli...</template>
    </div>
    <div class="calculator__wrapper">
      <div class="calendar-container">
        <div class="calendar">
          <v-date-picker
            is-expanded
            :disabled-dates="disabledDates"
            :value="maxDate"
            :min-date="minDate"
            :max-date="maxDate"
            @update:to-page="toPage"
            @dayclick="daySelected"
          />
          <Loading
            v-if="!rangeAvailable"
            :active="true"
            :is-full-page="false"
          />
        </div>
      </div>
      <div class="inputs">
        <CurrencyInput
          class="currency-input"
          v-model="firstInputRate"
          @selectInput="selectInput(0, $event)"
          :selectValue="inputs[0].selected"
        />
        <img
          src="@/assets/compare_arrows.svg"
          width="35"
          height="35"
          class="arrows"
          @click="switchCurrencies"
        />
        <CurrencyInput
          class="currency-input"
          v-model="secondInputRate"
          @selectInput="selectInput(1, $event)"
          :selectValue="inputs[1].selected"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import CurrencyInput from "./CurrencyInput.vue";

export default {
  components: {
    Loading,
    CurrencyInput,
  },
  data() {
    return {
      inputInUse: null,
      inputs: [
        {
          value: "",
          selected: "PLN",
        },
        {
          value: "",
          selected: "EUR",
        },
      ],
    };
  },
  methods: {
    switchCurrencies() {
      const _selected = this.inputs[0].selected;
      this.inputs[0].selected = this.inputs[1].selected;
      this.inputs[1].selected = _selected;
    },
    selectInput(index, selected) {
      this.inputs[index].selected = selected;
    },
    ...mapActions(["getRange", "getDisabledDays", "getTable"]),
    toPage({ year, month }) {
      this.getDisabledDays({ year, month });
    },
    daySelected(day) {
      if (!day.isDisabled) {
        this.getTable(day.id);
      }
    },
    getExchangeRate(value, reverse = false) {
      const first = this.getCurrencyRate(this.inputs[0].selected);
      const second = this.getCurrencyRate(this.inputs[1].selected);

      const result = reverse
        ? (value * second) / first
        : (value * first) / second;

      return result.toFixed(2);
    },
  },
  computed: {
    ...mapState({
      range: (state) => state.rates.range,
      disabledDays: (state) => state.rates.disabledDays,
      table: (state) => state.rates.table,
    }),
    ...mapGetters(["rangeAvailable", "tableAvailable", "getCurrencyRate"]),
    minDate() {
      return this.rangeAvailable ? new Date(this.range.min) : null;
    },
    maxDate() {
      return this.rangeAvailable ? new Date(this.range.max) : null;
    },
    disabledDates() {
      return [{ weekdays: [1, 7] }, ...this.disabledDays];
    },
    firstInputRate: {
      get() {
        if (this.inputInUse === 0) {
          return this.inputs[0].value;
        }

        const rate = this.getExchangeRate(this.inputs[1].value, true);
        this.inputs[0].value = rate;
        return !isNaN(rate) && rate > 0 ? rate : "";
      },
      set(value) {
        this.inputInUse = 0;
        this.inputs[0].value = value;
      },
    },
    secondInputRate: {
      get() {
        if (this.inputInUse === 1) {
          return this.inputs[1].value;
        }

        const rate = this.getExchangeRate(this.inputs[0].value);
        this.inputs[1].value = rate;
        return !isNaN(rate) && rate > 0 ? rate : "";
      },
      set(value) {
        this.inputInUse = 1;
        this.inputs[1].value = value;
      },
    },
  },
  watch: {
    rangeAvailable(available) {
      if (available) {
        this.getTable(this.range.max);
      }
    },
  },
  created() {
    this.getRange();
  },
};
</script>

<style lang="scss" scoped>
.arrows {
  &:hover {
    cursor: pointer;
  }

  margin-top: 15px;
  margin-bottom: 15px;
}

.currency-input {
  width: 300px;
}

.calculator {
  margin: 0 auto 0 auto;
  margin-top: 50px;
  background-color: #eef2f9;
  max-width: 800px;
  padding: 35px;
  border-radius: 13px;

  &__wrapper {
    display: flex;

    @media only screen and (max-width: 800px) {
      flex-direction: column;
    }
  }

  &__header {
    margin-bottom: 20px;
  }
}

.calendar {
  position: relative;
}

.calendar-container {
  display: flex;
  justify-content: center;

  @media only screen and (max-width: 800px) {
    margin-bottom: 30px;
  }
}

.inputs {
  flex: 1 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
