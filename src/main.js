import "@mdi/font/css/materialdesignicons.css";
import Vue from "vue";
import App from "./App";
import router from "./router";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import { store } from "./store";
import VeeValidate from "vee-validate";
import DateFilter from "./filters/date";
import UpperCase from "./filters/upper";
import * as firebase from "firebase";
import AlertCmp from "./Shared/Alert.vue";

Vue.use(Vuetify);
Vue.use(VeeValidate);

Vue.filter("date", DateFilter);
Vue.filter("upper", UpperCase);

Vue.component("app-alert", AlertCmp);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App),
  created() {
    firebase.initializeApp({
      apiKey: "AIzaSyBuTBeU5C5y2CZW7i2MWZysdLZgAMPxSmk",
      authDomain: "devmeetup-6ad5a.firebaseapp.com",
      databaseURL: "https://devmeetup-6ad5a.firebaseio.com",
      projectId: "devmeetup-6ad5a",
      storageBucket: "gs://devmeetup-6ad5a.appspot.com"
    });
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch("autoSignIn", user);
      }
    });
    this.$store.dispatch("loadMeetups");
  }
});
