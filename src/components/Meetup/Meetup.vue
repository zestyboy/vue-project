<template>
  <v-container>
    <v-layout row
      wrap>
      <v-flex>
        <v-card>
          <v-card-title>
            <h6 class="primary--text">{{meetup.title | upper}}</h6>
            <span>
              <v-spacer></v-spacer>
              <app-edit-meetup :meetup="meetup"
                v-if="creatorLoggedIn"></app-edit-meetup>
            </span>
          </v-card-title>
          <v-card-media :src="meetup.imageUrl"
            height="400px">
          </v-card-media>
          <v-card-text>
            <div class="info--text">
              {{meetup.date | date}} - {{meetup.location}} - {{meetup.time}}
            </div>
            <div>
              {{meetup.description}}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="!userRegistered"
              class="primary"
              @click="register">
              Register
            </v-btn>
            <v-btn v-if="userRegistered"
              class="primary"
              @click="unregister">
              Unregister
            </v-btn>
            <p>{{userRegistered}}</p>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import EditMeetup from "./Edit/EditMeetup.vue";

export default {
  props: ["id"],
  computed: {
    meetup() {
      return this.$store.getters.loadedMeetup(this.id);
    },
    userAuthenticated() {
      return (
        this.$store.getters.user !== null &&
        this.$store.getters.user !== undefined
      );
    },
    creatorLoggedIn() {
      if (!this.userAuthenticated) {
        return false;
      }
      return this.$store.getters.user.id === this.meetup.creatorId;
    },
    userRegistered() {
      // returns true if user is registered
      // check [registeredMeetups] in user object
      return this.$store.getters.userRegistered(this.meetup.id);
    }
  },
  methods: {
    register() {
      // see if user is signed in?
      // send id of meetup to registeredMeetups array in user store
      // or
      // dispatch action in meetup store to (1) add user id to meetup in FB (2) update user state
      this.$store.dispatch("registerUser", this.meetup);
    },
    unregister() {
      this.$store.dispatch("unregisterUser", this.meetup);
    }
  },
  components: {
    appEditMeetup: EditMeetup
  }
};
</script>
