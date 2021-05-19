<template>
  <div class="home">
    <div>
      <h1 style="margin-bottom: 10px">Kalkulator walutowy</h1>
      <p style="margin-bottom: 50px">
        Przelicznik walut według średnich kursów publikowanych przez NBP.
      </p>
      <div class="container">
        <div class="table-info">
          Tabela:
          <template v-if="date">
            <a
              v-if="ready"
              :href="getTableUrl"
              target="_blank"
              class="table-link"
              >{{ tableNumber(date) }}</a
            >
          </template>
          <template v-else>
            <span style="color: rgb(142 142 142)">Wybierz datę</span>
          </template>
        </div>
        <div class="calculator">
          <div style="min-width: 250px; height: 266px">
            <v-date-picker
              class="calendar"
              v-if="availableRange && webSocketConnected"
              :min-date="new Date(availableRange.min)"
              :max-date="new Date(availableRange.max)"
              :disabled-dates="disabledDays"
              @update:to-page="movePage"
              @dayclick="clickedDate"
              v-model="date"
              :model-config="{ type: 'string', mask: 'YYYY-MM-DD' }"
            ></v-date-picker>
            <div
              v-else
              style="
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
              "
            >
              Ładowanie...
            </div>
          </div>
          <div class="fields">
            <div class="input-group">
              <input
                type="number"
                class="rate-input"
                v-model.number="amount"
                placeholder="Wpisz kwotę"
              />
              <select
                name="currency"
                class="select-currency"
                v-model="currency"
              >
                <option :value="null">-</option>
                <option
                  v-for="(code, index) in currencyCodes(date)"
                  :key="index"
                  :value="code"
                >
                  {{ code }}
                </option>
              </select>
            </div>
            <div class="result">
              <strong>{{ result }}</strong>
              PLN
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      date: null,
      day: null,
      currency: null,
      amount: null,
    };
  },
  computed: {
    ...mapState([
      "availableRange",
      "disabledDays",
      "webSocketConnected",
      "ready",
    ]),
    ...mapGetters(["currencyCodes", "exchangeRate", "tableNumber"]),
    getTableUrl() {
      const number = this.tableNumber(this.date).split("/")[0].padStart(3, "0");
      const year = new Date(this.day).getFullYear().toString().slice(-2);
      const month = this.day.split("-")[1];
      const day = this.day.split("-")[2];

      return `https://www.nbp.pl/home.aspx?navid=archa&c=/ascx/tabarch.ascx&n=a${number}z${year}${month}${day}`;
    },
    result() {
      const rate = this.exchangeRate(this.date, this.currency);

      if (rate) {
        return (rate * this.amount).toFixed(4);
      } else {
        return "0.0000";
      }
    },
  },
  methods: {
    ...mapActions(["getAvailableRange", "getDisabledDays", "getExchangeRates"]),
    waitForWebSocket(callback) {
      if (!this.webSocketConnected) {
        const unwatch = this.$store.watch(
          (state) => state.webSocketConnected,
          (newValue) => {
            if (newValue) {
              callback();
              unwatch();
            }
          }
        );
      } else {
        callback();
      }
    },
    movePage(page) {
      this.waitForWebSocket(() => this.getDisabledDays(page));
    },
    clickedDate(day) {
      if (!day.isDisabled) {
        const date = new Date(day.id);
        const key = {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
        };

        this.day = day.id;
        this.waitForWebSocket(() => this.getExchangeRates(key));
      }
    },
  },
  created() {
    this.waitForWebSocket(() => this.getAvailableRange());
  },
};
</script>

<style lang="scss" scoped>
.container {
  background-color: white;
  padding: 35px;
  border-radius: 1rem;
}

.table-link {
  text-decoration: underline;
  color: #3182ce;
}

.table-info {
  margin-bottom: 15px;
  font-size: 22px;
}

.home {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.calculator {
  display: flex;
}

.fields {
  width: 420px;
  margin-left: 20px;
}

.result {
  margin-top: 50px;
  font-size: 24px;
}

.rate-input {
  border: 1px solid #cbd5e0;
  width: 100%;
  font-size: 18px;
  padding: 15px;
  margin-right: 5px;
  outline: none;
  border-radius: 0.5rem;
}

.input-group {
  display: flex;
}

.select-currency {
  border-radius: 0.5rem;
  width: 120px;
  font-size: 18px;
  border: 1px solid #cbd5e0;
  outline: none;
}
</style>
