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
    unregisterUser(state, meetupId) {
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
    },
    registerUserToMeetup({ commit, getters }, meetup) {
      // add {userId} to user node in firebase
      commit("setLoading", true);
      const meetupId = meetup.id;
      const userId = getters.user.id;
      let registerObject = {};
      registerObject[
        // write {meetupId: true} to '/user/userID' in firebase
        "users/" + userId + "/registeredMeetups/" + meetupId
      ] = true;
      registerObject[
        // write {userID: true} to '/meetups/meetupId/registeredUsers' in firebase
        "meetups/" + meetupId + "/registeredUsers/" + userId
      ] = true;
      firebase
        .database()
        .ref()
        .update(registerObject)
        .then(() => {
          // commit a mutation that adds {meetupId} to [registeredMeetups] in app state
          commit("registerUserToMeetup", meetupId);
          commit("setLoading", false);
        })
        .catch(error => {
          console.log(error);
          commit("setLoading", false);
        });
    },
    unregisterUser({ commit, getters }, meetup) {
      // remove entries in firebase
      commit("setLoading", true);
      const meetupId = meetup.id;
      const userId = getters.user.id;
      let unregisterObject = {};
      unregisterObject[
        // write {meetupId: true} to '/user/userID' in firebase
        "users/" + userId + "/registeredMeetups/" + meetupId
      ] = null;
      unregisterObject[
        // write {userID: true} to '/meetups/meetupId/registeredUsers' in firebase
        "meetups/" + meetupId + "/registeredUsers/" + userId
      ] = null;
      firebase
        .database()
        .ref()
        .update(unregisterObject)
        .then(() => {
          // commit a mutation that adds {meetupId} to [registeredMeetups] in app state
          commit("unregisterUser", meetupId);
          commit("setLoading", false);
        })
        .catch(error => {
          console.log(error);
          commit("setLoading", false);
        });
      // {userId} from meetups node
      // {meetupId} from users node
      // remove [meetupId] from [registeredMeetup] user state (commit mutation)
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
