<template>
  <div class="currency-input">
    <input
      type="text"
      class="currency-input__input"
      size="10"
      :value="value"
      @input="$emit('input', $event.target.value)"
      :disabled="!tableAvailable"
    />
    <v-select
      :options="currencyList"
      class="currency-input__select"
      append-to-body
      :calculate-position="withPopper"
      :clearable="false"
      :disabled="!tableAvailable"
      :value="selectValue"
      @input="$emit('selectInput', $event)"
    />
  </div>
</template>

<script>
import { createPopper } from "@popperjs/core";
import { mapGetters, mapState } from "vuex";
import _ from "lodash";

export default {
  props: {
    value: [Number, String],
    selectValue: String,
  },
  computed: {
    ...mapGetters(["tableAvailable"]),
    ...mapState({
      table: (state) => state.rates.table,
    }),
    currencyList() {
      if (!_.isEmpty(this.table)) {
        return this.table.rates.map((el) => el.code);
      }
      return [];
    },
  },
  methods: {
    withPopper(dropdownList, component, { width }) {
      dropdownList.style.width = width;

      const popper = createPopper(component.$refs.toggle, dropdownList, {
        placement: "bottom-end",
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, -1],
            },
          },
        ],
      });

      return () => popper.destroy();
    },
  },
};
</script>

<style lang="scss">
.currency-input {
  display: flex;

  &__input {
    flex: 1 1;
    outline: none;
    border: 1px solid #b6b6b6;
    border-radius: 6px 0 0 6px;
    font-family: inherit;
    padding: 10px;
    font-size: 1rem;

    &:disabled {
      background-color: #f8f8f8;
    }
  }

  &__select {
    //display: flex;
    flex: 0 0 120px;
    background-color: white;

    .vs__dropdown-toggle {
      height: 100%;
      border: 1px solid #b6b6b6;
      border-left: none;
      border-radius: 0 6px 6px 0;
    }

    .vs__selected-options {
      align-items: center;
    }
  }
}
</style>
