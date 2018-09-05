<template>
  <v-layout row
    justify-center>
    <v-dialog v-model="dialog"
      persistent
      max-width="500px">
      <v-btn slot="activator"
        color="primary"
        dark>Edit Meetup</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">Edit Meetup</span>
          <span>{{meetup.title}}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field label="Title"
                  name="title"
                  type="text"
                  required
                  v-validate="'required'"
                  v-model="editedTitle"></v-text-field>
                <p>
                  <span>{{ errors.first('title') }}</span>
                </p>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Location"
                  name="location"
                  type="text"
                  required
                  v-validate="'required'"
                  v-model="editedLocation"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Description"
                  required
                  name="description"
                  type="text"
                  v-validate="'required'"
                  v-model="editedDescription"></v-text-field>
              </v-flex>
              <v-flex xs6>
                <app-edit-date :meetup="meetup"></app-edit-date>
                <p>{{meetup.date}}</p>
              </v-flex>
              <v-flex xs6>
                <app-edit-time :meetup="meetup"></app-edit-time>
                <p>{{meetup.time}}</p>
              </v-flex>
              <p>{{titleChanged}}</p>
              <p>{{editedTitle}}</p>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1"
            flat
            @click.native="closeDialog">Close</v-btn>
          <v-btn color="blue darken-1"
            flat
            @click.native="saveChanges">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import EditDate from "./EditDate.vue";
import EditTime from "./EditTime.vue";

export default {
  props: ["meetup"],
  components: {
    appEditDate: EditDate,
    appEditTime: EditTime
  },
  data() {
    return {
      dialog: false,
      editedTitle: this.meetup.title,
      editedLocation: this.meetup.location,
      editedDescription: this.meetup.description
    };
  },
  computed: {
    titleChanged() {
      return this.editedTitle !== this.meetup.title;
    },
    locationChanged() {
      return this.editedLocation !== this.meetup.location;
    },
    descriptionChanged() {
      return this.editedDescription !== this.meetup.description;
    }
  },
  methods: {
    saveChanges() {
      this.$validator.validateAll().then(result => {
        if (result) {
          const updatedMeetupData = { id: this.meetup.id };
          if (this.titleChanged) {
            updatedMeetupData.title = this.editedTitle;
          }
          if (this.locationChanged) {
            updatedMeetupData.location = this.editedLocation;
          }
          if (this.locationChanged) {
            updatedMeetupData.description = this.editedDescription;
          }
          this.$store.dispatch("editMeetup", updatedMeetupData);
          this.dialog = false;
        } else {
          alert("Correct them errors!");
        }
      });
    },
    closeDialog() {
      this.dialog = false;
      this.editedTitle = this.meetup.title;
      this.editedLocation = this.meetup.location;
      this.editedDescription = this.meetup.description;
    }
  }
};

// perform some validation on the edited fields
// check if new value matches old value; if different, update database with different value
// provide feedback to user that values have been updated
//  ponder over this idea of application state relationship to database
</script>

