<template>
  <div id="app">
    <section>
      <div class="box">
        <h1 class="title">Register</h1>
        <b-field label="Username">
          <b-input v-model="username" placeholder="Your username"></b-input>
        </b-field>
        <br />
        <b-field label="Email">
          <b-input v-model="email" placeholder="Your email"></b-input>
        </b-field>
        <br />
        <b-field label="Password">
          <b-input
            type="password"
            v-model="password"
            placeholder="Your password"
          ></b-input>
        </b-field>
        <br />
        <b-field label="Confirm Password">
          <b-input
            type="password"
            v-model="confirmPassword"
            placeholder="Retype your password"
          ></b-input>
        </b-field>
        <p v-show="!passwordsMatch">Your passwords don't match!</p>
        <p class="success" v-show="success">Account Created!</p>
        <p v-show="error">{{ error }}</p>
        <b-button expanded v-on:click="submit">Create Account</b-button>
      </div>
    </section>
    <!-- <router-link :to="{ path: '/workout/' }" custom v-slot="{ navigate }">
      <button class="widebutton" @click="navigate">Go to Workout</button>
    </router-link> -->
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
export default {
  name: "Register",
  data() {
    return {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      passwordsMatch: true,
      error: null,
      success: false,
    };
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    submit() {
      let valid = this.password === this.confirmPassword;
      if (valid && this.username.length > 1) {
        this.passwordsMatch = true;
        //create user with firebase
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then((data) => {
            data.user
              .updateProfile({
                displayName: this.username,
              })
              .then(() => {
                this.success = true;
                this.error = null;
              });
          })
          .catch((err) => {
            this.error = err.message;
          });
      } else {
        this.passwordsMatch = false;
      }
    },
  },
};
</script>

<style scoped>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

p {
  color: tomato;
}
.success {
  color: green;
}
.box {
  margin: 10px;
  box-shadow: 0px 0 9px rgba(173, 173, 173, 0.8);
}
</style>
