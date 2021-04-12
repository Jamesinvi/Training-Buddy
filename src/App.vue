<template>
  <div id="app">
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@mdi/font@5.8.55/css/materialdesignicons.min.css"
    />
    <link href="http://fonts.cdnfonts.com/css/aller" rel="stylesheet" />
    <div class="topnav">
      <b-sidebar
        type="is-light"
        :fullheight="fullheight"
        :fullwidth="fullwidth"
        :overlay="overlay"
        :right="right"
        v-model="open"
      >
        <div class="p-1">
          <b-menu class="p-1">
            <b-menu-list label="Pages">
              <!-- <b-menu-item
              tag="router-link"
              :to="{ path: '/' }"
              icon="information"
              label="Info"
            ></b-menu-item> -->
              <b-menu-item
                tag="router-link"
                :to="{ path: '/workout' }"
                icon="dumbbell"
                label="Workouts"
              >
              </b-menu-item>
              <b-menu-item
                tag="router-link"
                :to="{ path: '/history' }"
                icon="folder-account"
                label="Workout History"
              >
              </b-menu-item>
              <b-menu-item
                tag="router-link"
                :to="{ path: '/profile' }"
                icon="account"
                label="My Profile"
              >
              </b-menu-item>
            </b-menu-list>
            <b-menu-list label="Actions">
              <b-menu-item
                tag="router-link"
                :to="{ path: '/login' }"
                icon="login"
                label="Login"
              ></b-menu-item>
              <b-menu-item
                icon="logout"
                label="Logout"
                v-on:click="logout"
              ></b-menu-item>
            </b-menu-list>
          </b-menu>
        </div>
      </b-sidebar>
      <div class="level is-mobile">
        <b-button
          class="button is-white"
          icon-left="arrow-left"
          @click="goBack"
        ></b-button>
        <h1 class="title-app">Training Buddy</h1>
        <b-button
          class="button is-white"
          icon-right="dots-horizontal"
          @click="open = true"
        ></b-button>
      </div>
    </div>
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";

export default {
  name: "home",
  components: {},
  data() {
    return {
      open: false,
      overlay: true,
      fullheight: true,
      fullwidth: false,
      right: true,
    };
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push({ name: "Login" });
        });
    },
  },
};
</script>

<style>
.main-content {
  font-family: "Aller", sans-serif;
  width: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0px;
  max-width: 800px;
  display: inline-block;
}
body {
  text-align: center;
}
.box {
  margin: 10px;
  box-shadow: 0px 0 9px rgba(173, 173, 173, 0.8);
}
.level {
  box-shadow: 0px 0 9px rgba(119, 119, 119, 0.8);
}
.topnav {
  min-width: 100%;
  position: -webkit-sticky; /* Safari */
  background: white;
  position: sticky;
  z-index: 35;
  top: 0;
}
.topnav .icon {
  font-size: 1.8em;
}
.title-app {
  margin: 15px;
  font-size: 1.4em;
}
</style>
