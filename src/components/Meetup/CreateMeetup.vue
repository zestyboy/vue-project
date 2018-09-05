<template>
  <v-container>
    <v-layoyt row>
      <v-flex xs12
        sm6
        offset-sm3>
        <form>
          <v-text-field v-model="title"
            name="title"
            type="text"
            label="Title"
            v-validate="'required'"></v-text-field>
          <p>
            <span>{{ errors.first('title') }}</span>
          </p>
          <v-text-field v-model="location"
            name="location"
            type="text"
            label="Location"
            v-validate="'required'"></v-text-field>
          <v-btn raised
            class="primary"
            @click="onPickFile">Upload Image</v-btn>
          <input type="file"
            style="display: none"
            ref="fileInput"
            accept="image/*"
            @change="onFilePicked">
          <v-textarea v-model="description"
            name="description"
            type="text"
            label="Descriptions"
            v-validate="'required'"></v-textarea>
          <v-date-picker v-model="date"></v-date-picker>
          <p>{{date}}</p>
          <v-time-picker v-model="time"></v-time-picker>
          <p>{{time}}</p>
          <v-btn @click.prevent="submit"
            type="submit">
            Submit
          </v-btn>
          <p>{{submittableDateTime}}</p>
        </form>
      </v-flex>
    </v-layoyt>
  </v-container>

</template>

<script>
export default {
  data() {
    return {
      title: "",
      location: "",
      imageUrl: "",
      description: "",
      date: null,
      time: new Date(),
      image: null
    };
  },
  computed: {
    submittableDateTime() {
      const date = new Date(this.date);
      if (typeof this.time === "string") {
        let hours = this.time.match(/^(\d+)/)[1];
        let minutes = this.time.match(/:(\d+)/)[1];
        date.setHours(hours);
        date.setMinutes(minutes);
      } else {
        date.setHours(this.time.getHours());
        date.setMinutes(this.time.getMinutes());
      }
      return date;
    }
  },
  methods: {
    submit: function() {
      if (!this.image) {
        return;
      }
      this.$validator.validateAll().then(result => {
        if (result) {
          const meetupData = {
            title: this.title,
            location: this.location,
            image: this.image,
            description: this.description,
            date: this.date,
            time: this.time
          };
          this.$store.dispatch("createMeetup", meetupData);
          this.$router.push("/meetups");
          alert("Form Submitted!");
          console.log(meetupData);
          return;
        }
        alert("Correct them errors!");
      });
    },
    onPickFile() {
      this.$refs.fileInput.click();
    },
    onFilePicked(event) {
      // check if it's a valid file
      const files = event.target.files;
      let uploadedImage = files[0];
      let fileName = uploadedImage.name;
      if (fileName.lastIndexOf(".") <= 0) {
        return alert("Please add a valid file!");
      }
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.imageUrl = fileReader.result;
      });
      fileReader.readAsDataURL(uploadedImage);
      this.image = uploadedImage;
      console.dir(files);
      console.dir(uploadedImage);
      console.dir(fileName);
      // have some indication that a file is there
      // show a preview

      // Convert it to a string for image preview
    }
  }
};
</script>
