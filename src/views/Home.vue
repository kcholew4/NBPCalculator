<template>
  <div class="home">
    <h1>Kalkulator walutowy</h1>
    <p>Kalkulator walutowy według średnich kursów publikowanych przez NBP.</p>
    <Calculator />
  </div>
</template>

<script>
import Calculator from "../components/Calculator.vue";

export default {
  components: {
    Calculator,
  },
};
</script>

<style lang="scss" scoped>
h1 {
  font-weight: 400;
  font-size: 32px;
  max-width: 800px;
  margin: 0 auto 0 auto;
  margin-top: 100px;
}

p {
  max-width: 800px;
  margin: 0 auto 0 auto;
  margin-top: 25px;
}
</style>
