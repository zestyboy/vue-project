import * as firebase from "firebase";

export default {
  state: {
    loadedMeetups: []
  },
  mutations: {
    createMeetup(state, payload) {
      state.loadedMeetups.push(payload);
    },
    setLoadedMeetups(state, payload) {
      state.loadedMeetups = payload;
    },
    editMeetup(state, payload) {
      const meetupToEdit = state.loadedMeetups.find(meetup => {
        return meetup.id === payload.id;
      });
      if (payload.title) {
        meetupToEdit.title = payload.title;
      }
      if (payload.location) {
        meetupToEdit.location = payload.location;
      }
      if (payload.description) {
        meetupToEdit.description = payload.description;
      }
      if (payload.date) {
        meetupToEdit.date = payload.date;
      }
      if (payload.date) {
        meetupToEdit.date = payload.date;
      }
      if (payload.time) {
        meetupToEdit.time = payload.time;
      }
      // edit a specific meetup
      // update only the values that have changed
      // ie, lookup meetup, modify appropriate property with corresponding editd value
    }
    // registerUsertToMeetup(state, payload) {
    //   const meetupToEdit = state.loadedMeetups.find(meetup => {
    //     return meetup.id === payload.id;
    //   });
    //   meetupToEdit.registeredUsers.push(payload);
    //   // this mutation probably isn't necessary
    // }
  },
  actions: {
    createMeetup({ commit, getters }, payload) {
      const meetup = {
        ...payload,
        creatorId: getters.user.id
        // id: Math.floor(Math.random() * 500).toString()
      };
      let meetupId;
      let imageUrl;
      firebase
        .database()
        .ref("meetups")
        .push(meetup)
        .then(data => {
          meetupId = data.key;
          return meetupId;
        })
        .then(key => {
          console.log(key);
          console.log(payload.image);
          const filename = payload.image.name;
          const ext = filename.slice(filename.lastIndexOf("."));
          return firebase
            .storage()
            .ref("meetups/" + key + "." + ext)
            .put(payload.image);
        })
        .then(fileData => {
          return fileData.ref.getDownloadURL();
        })
        .then(downloadURL => {
          imageUrl = downloadURL;
          return firebase
            .database()
            .ref("meetups")
            .child(meetupId)
            .update({ imageUrl: imageUrl });
        })
        .then(() => {
          commit("createMeetup", {
            ...meetup,
            imageUrl,
            id: meetupId
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    // send the image to storage
    // get an id from storage
    // add image storage id to meetup stored in database - x
    loadMeetups({ commit }) {
      commit("setLoading", true);
      firebase
        .database()
        .ref("meetups")
        .once("value")
        .then(data => {
          commit("setLoading", true);
          const databaseReturn = data.val();
          const meetups = [];
          for (let key in databaseReturn) {
            meetups.push({
              id: key,
              imageUrl: databaseReturn[key].imageUrl,
              title: databaseReturn[key].title,
              date: databaseReturn[key].date,
              location: databaseReturn[key].location,
              creatorId: databaseReturn[key].creatorId,
              description: databaseReturn[key].description,
              time: databaseReturn[key].time
            });
          }
          console.dir(meetups);
          commit("setLoadedMeetups", meetups);
          commit("setLoading", false);
        })
        .catch(error => {
          console.log(error);
          commit("setLoading", false);
        });
    },
    editMeetup({ commit }, payload) {
      commit("setLoading", true);
      const updatedValues = {};
      if (payload.title) {
        updatedValues.title = payload.title;
      }
      if (payload.location) {
        updatedValues.location = payload.location;
      }
      if (payload.description) {
        updatedValues.description = payload.description;
      }
      if (payload.time) {
        updatedValues.time = payload.time;
      }
      if (payload.date) {
        updatedValues.date = payload.date;
      }
      firebase
        .database()
        .ref("meetups")
        .child(payload.id)
        .update(updatedValues)
        .then(() => {
          commit("editMeetup", payload);
          commit("setLoading", false);
        })
        .catch(error => {
          console.log(error);
          commit("setLoading", false);
        });
    }
    // registerUser({ commit, getters }, meetup) {
    //   // send user id to FB meetup id
    //   // add meetup id to user registered meetup array
    //   firebase
    //     .database()
    //     .ref("meetups")
    //     .child(meetup.id + "/registeredUsers")
    //     .push(getters.user.id) // this keeps adding user id even if it's there already!
    //     .then(() => {
    //       commit("registerUserToMeetup", meetup.id);
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // },
  },
  getters: {
    loadedMeetups(state) {
      return state.loadedMeetups.sort((meetupA, meetupB) => {
        return meetupA.date > meetupB.date;
      });
    },
    featuredMeetups(state, getters) {
      return getters.loadedMeetups.slice(0, 5);
    },
    loadedMeetup(state) {
      return meetupId => {
        console.log(meetupId);
        return state.loadedMeetups.find(meetup => {
          return meetup.id === meetupId;
        });
      };
    }
  }
};
