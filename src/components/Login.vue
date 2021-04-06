<template>
  <div id="app">
    <section>
      <div class="box">
        <h1 class="title">Login</h1>

        <b-field label="Email">
          <b-input v-model="email" value="Your email"></b-input>
        </b-field>
        <br />
        <b-field label="Password">
          <b-input
            type="password"
            v-model="password"
            value="Your password"
          ></b-input>
        </b-field>
        <p id="error" v-show="error">{{ error }}</p>
        <p>No account?</p>
        <router-link :to="{ path: '/register' }">Create a new one.</router-link>
        <br />
        <b-button type="is-primary" v-on:click="submit" expanded
          >Login</b-button
        >
      </div>
    </section>
    <!-- <router-link :to="{ path: '/workout/' }" custom v-slot="{ navigate }">
      <button class="widebutton" @click="navigate">Go to Workout</button>
    </router-link> -->
  </div>
</template>

<script>
import firebase from "firebase/app";
import store from "../main.js";
import "firebase/auth";
export default {
  name: "Login",
  store: store,
  data() {
    return {
      email: "",
      password: "",
      error: null,
    };
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    submit() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(async () => {
          await this.sleep(100);
          this.$router.push({ name: "Profile" });
        })
        .catch((err) => {
          this.error = err.message;
        });
    },
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
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
.box {
  margin: 10px;
  box-shadow: 0px 0 9px rgba(173, 173, 173, 0.8);
}
#error {
  color: tomato;
}
</style>
