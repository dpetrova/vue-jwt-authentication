import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./vuex/store";
import axios from "axios";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
  created() {
    //restore user fom localstorage to vuex (which disappear when browser refresh)
    const userString = localStorage.getItem("user");
    if (userString) {
      const userData = JSON.parse(userString);
      this.$store.commit("SET_USER_DATA", userData);
    }
    //intercept requests when navigate somewhere that makes an API call for private resources
    axios.interceptors.response.use(
      //if request pass
      (response) => response, //return response
      //if request fail
      (error) => {
        console.log(error.response);
        //force a logout if unauthorized (not proper credentials)
        if (error.response.status === 401) {
          this.$router.push("/");
          this.$store.dispatch("logout");
        }
        return Promise.reject(error); //reject error
      }
    );
  },
}).$mount("#app");
