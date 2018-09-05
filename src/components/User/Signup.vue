<template>
  <v-container fill-height>
    <v-layout row>
      <v-flex xs12
        sm6
        offset-sm3>
        <app-alert v-if="error"
          @dismissed="onDismissed">{{error.message}}
        </app-alert>
        <v-card>
          <v-card-text>
            <v-container>
              <form @submit.prevent="submit">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field name="email"
                      label="Email"
                      v-model="email"
                      type="email"
                      v-validate="'email|required'">
                    </v-text-field>
                    <p>{{ errors.first('email') }}</p>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field name="password"
                      ref="password"
                      label="Password"
                      v-model="password"
                      type="password"
                      v-validate="'required'">
                    </v-text-field>
                    <p>{{password}}</p>
                    <p>{{ errors.first('password') }}</p>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      v-model='confirmPassword'
                      v-validate="'required|confirmed:password'"
                      data-vv-as="password">
                    </v-text-field>
                    <p>{{confirmPassword}}</p>
                    <p>{{ errors.first('confirmPassword') }}</p>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex>
                    <v-btn type="submit"
                      :loading="loading"
                      :disabled="loading"
                      color="info">
                      Sign Up
                      <span slot="loader"
                        class="custom-loader">
                        <v-icon light>cached</v-icon>
                      </span>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: ""
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    error() {
      return this.$store.getters.error;
    },
    loading() {
      return this.$store.getters.loading;
    }
  },
  watch: {
    user(value) {
      if (value !== null && value !== undefined) {
        this.$router.push("/");
      }
    }
  },
  methods: {
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          let user = {
            email: this.email,
            password: this.password
          };
          this.$store.dispatch("signUserUp", user);
        } else {
          alert("Correct them errors!");
        }
      });
    },
    onDismissed() {
      //clear the error
      this.$store.dispatch("clearError");
    }
  }
};
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>


// Validate fields x
// Submit form x
// Put together a user object x
// Send it to the store (dispatch action) x
// 
