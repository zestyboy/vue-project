<template>
  <v-dialog v-model="dialog"
    width="500">
    <v-btn slot="activator"
      color="red lighten-2"
      dark>
      Edit Date
    </v-btn>

    <v-card>
      <v-card-title class="headline grey lighten-2"
        primary-title>
        Edit Date
      </v-card-title>

      <v-date-picker v-model="editedDate"
        v-validate="'required'"></v-date-picker>

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
      editedDate: this.meetup.date
    };
  },
  computed: {
    dateChanged() {
      return this.editedDate !== this.meetup.date;
    }
  },
  methods: {
    onChange() {
      this.$validator.validateAll().then(result => {
        if (result) {
          if (this.dateChanged) {
            const updatedMeetupData = { id: this.meetup.id };
            updatedMeetupData.date = this.editedDate;
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
