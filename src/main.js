import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import VCalendar from "v-calendar";

import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

Vue.use(VCalendar);
Vue.component("v-select", vSelect);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
