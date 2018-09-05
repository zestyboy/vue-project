<template>
  <v-dialog v-model="dialog"
    width="500">
    <v-btn slot="activator"
      color="red lighten-2"
      dark>
      Edit Time
    </v-btn>

    <v-card>
      <v-card-title class="headline grey lighten-2"
        primary-title>
        Edit Time
      </v-card-title>

      <v-time-picker v-model="editedTime"
        v-validate="'required'"></v-time-picker>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary"
          flat
          @click="onChange">
          Change
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["meetup"],
  data() {
    return {
      dialog: false,
      editedTime: this.meetup.time
    };
  },
  computed: {
    timeChanged() {
      return this.editedTime !== this.meetup.time;
    }
  },
  methods: {
    onChange() {
      this.$validator.validateAll().then(result => {
        if (result) {
          if (this.timeChanged) {
            const updatedMeetupData = { id: this.meetup.id };
            updatedMeetupData.time = this.editedTime;
            this.$store.dispatch("editMeetup", updatedMeetupData);
          }
        } else {
          alert("Correct them errors!");
        }
        this.dialog = false;
      });
    }
  }
};
</script>
