const Vue = require("vue");
const App = require("./App.vue");
const router = require("./router");

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

// import axios from "axios";

// const result = await axios.post(
//   "https://api.lovense-api.com/api/basicApi/getToken",
//   {
//     token: "{Lovense developer token}",
//     uid: "{user ID on your application}",
//     uname: "{user nickname on your application}",
//   }
// );

// console.log(result);
