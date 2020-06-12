import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    isNewUser: true,
  },
  mutations: {
    SET_USER_DATA(state, userData) {
      //store a copy of credentials into browser local storage (it accepts a string)
      localStorage.setItem("user", JSON.stringify(userData));
      //add the token into our Axios header
      axios.defaults.headers.common["Authorization"] = `Bearer ${
        userData.token
      }`;
      //store credentials in vuex
      state.user = userData;
    },
    LOGOUT(state) {
      localStorage.removeItem("user"); //remove user from browser local storage
      //state.user = null; //remove user from vuex
      //axios.defaults.headers.common["Authorization"] = null; //take JWT token out of our axios Authorization header

      //using location.reload() to handle clearing out the Vuex State and axios header
      location.reload(); //force refresh page
    },
    IS_NEW_USER(state, isNewUser) {
      state.isNewUser = isNewUser;
    },
  },
  actions: {
    register({ commit }, credentials) {
      return axios
        .post("//localhost:3000/register", credentials)
        .then(({ data }) => {
          //console.log(data);
          commit("SET_USER_DATA", data);
        });
    },
    login({ commit }, credentials) {
      return axios
        .post("//localhost:3000/login", credentials)
        .then(({ data }) => {
          commit("SET_USER_DATA", data);
        });
    },
    logout({ commit }) {
      commit("LOGOUT");
    },
    isNewUser({ commit }, isNewUser) {
      commit("IS_NEW_USER", isNewUser);
    },
  },
  getters: {
    loggedIn(state) {
      return !!state.user;
    },
  },
});
