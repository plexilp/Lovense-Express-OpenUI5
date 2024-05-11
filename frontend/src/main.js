const Vue = require("vue");
const App = require("./App.vue");
const router = require("./router");

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
