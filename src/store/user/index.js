import * as firebase from "firebase";

export default {
  state: {
    user: null
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    registerUserToMeetup(state, meetupId) {
      state.user.registeredMeetups.push(meetupId);
    },
    unregisterUserFromMeetup(state, meetupId) {
      state.user.registeredMeetups.splice(
        state.user.registeredMeetups.indexOf(meetupId),
        1
      );
    }
  },
  actions: {
    signUserUp({ commit }, payload) {
      // send to the firebase
      commit("setLoading", true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
          commit("setLoading", false);
          console.log(user.user.uid);
          let newUser = {
            id: user.user.uid,
            registeredMeetups: []
          };
          commit("setUser", newUser);
        })
        .catch(error => {
          commit("setLoading", false);
          commit("setError", error);
          console.log(error);
          console.log(error.message);
        });
    },
    signUserIn({ commit }, payload) {
      //Authenticate with Firebase
      commit("setLoading", true);
      firebase
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
          commit("setLoading", false);
          let signedInUser = {
            id: user.user.uid,
            registeredMeetups: []
          };
          // Set User
          commit("setUser", signedInUser);
        })
        .catch(error => {
          commit("setLoading", false);
          commit("setError", error);
        });
    },
    autoSignIn({ commit }, user) {
      commit("setUser", { id: user.uid, registeredMeetups: [] });
    },
    logOut: function({ commit }) {
      firebase.auth().signOut();
      commit("setUser", null);
    }
  },
  getters: {
    user(state) {
      return state.user;
    },
    userRegistered(state) {
      return meetupId => {
        return (
          state.user.registeredMeetups.find(meetup => meetup === meetupId) !==
          undefined
        );
      };
    }
  }
};
