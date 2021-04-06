<template>
  <!-- eslint-disable-next-line vue/max-attributes-per-line -->

  <div id="app">
    <div class="box">
      <h2 class="subtitle">{{ username }}'s Profile</h2>
    </div>
    <section class="box">
      <label>Your Goal</label>
      <b-field position="is-right">
        <b-select placeholder="Select your goal" v-model="goal">
          <option>Weight loss</option>
          <option>Maintenance training</option>
          <option>Other option</option>
        </b-select>
      </b-field>
    </section>
    <section class="box">
      <label for="dateSelector">Date of Birth</label>
      <b-field id="dateSelector">
        <input type="date" v-model="dateOfBirth" />
      </b-field>
      <br />
      <b-field label="Weight (in kg)">
        <b-numberinput v-model="weight" placeholder="75"></b-numberinput>
      </b-field>
      <b-field label="Height (in cm)">
        <b-numberinput v-model="height" placeholder="175"></b-numberinput>
      </b-field>
    </section>
    <section class="box">
      <b-field label="Shoulders (in cm)">
        <b-numberinput
          v-model="shouldersMeasurement"
          placeholder="175"
        ></b-numberinput>
      </b-field>
      <b-field label="Chest (in cm)">
        <b-numberinput
          v-model="chestMeasurement"
          placeholder="175"
        ></b-numberinput>
      </b-field>
      <b-field label="Bicep (in cm)">
        <b-numberinput
          v-model="bicepMeasurement"
          placeholder="175"
        ></b-numberinput>
      </b-field>
      <b-field label="Waist (in cm)">
        <b-numberinput
          v-model="waistMeasurement"
          placeholder="175"
        ></b-numberinput>
      </b-field>
      <b-field label="Thigh (in cm)">
        <b-numberinput
          v-model="thighMeasurement"
          placeholder="175"
        ></b-numberinput>
      </b-field>
    </section>
    <section class="box">
      <b-field label="Additional Info">
        <b-input v-model="extraInfo" maxlength="200" type="textarea"></b-input>
      </b-field>
    </section>
    <div class="buttons">
      <b-button type="is-primary" v-on:click="sendData" expanded
        >Apply Changes</b-button
      >
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/firestore";
import store from "../main.js";
export default {
  name: "Profile",
  store: store,
  // data() {
  //   return {
  //     userProfileInfo: {
  //       goal: null,
  //       height: this.$store.state.b.user.profileInfo.height,
  //       dateOfBirth: this.$store.state.b.user.profileInfo.dateOfBirth,
  //       weight: this.$store.state.b.user.profileInfo.weight,
  //       shouldersMeasurement: this.$store.state.b.user.profileInfo
  //         .shouldersMeasurement,
  //       bicepMeasurement: this.$store.state.b.user.profileInfo.bicepMeasurement,
  //       chestMeasurement: this.$store.state.b.user.profileInfo.chestMeasurement,
  //       waistMeasurement: this.$store.state.b.user.profileInfo.waistMeasurement,
  //       thighMeasurement: this.$store.state.b.user.profileInfo.thighMeasurement,
  //       extraInfo: this.$store.state.b.user.profileInfo.extraInfo,
  //     },
  //   };
  // },
  computed: {
    username() {
      if (this.$store.state.b.user.data.displayName) {
        return this.capitalizeFirstLetter(
          this.$store.state.b.user.data.displayName
        );
      } else {
        return "Your ";
      }
    },
    goal: {
      get() {
        return this.$store.state.b.user.profileInfo.goal;
      },
      set(value) {
        this.$store.commit("b/updateGoal", value);
      },
    },
    dateOfBirth: {
      get() {
        return this.$store.state.b.user.profileInfo.dateOfBirth;
      },
      set(value) {
        this.$store.commit("b/updateDateOfBirth", value);
      },
    },
    weight: {
      get() {
        return this.$store.state.b.user.profileInfo.weight;
      },
      set(value) {
        this.$store.commit("b/updateWeight", value);
      },
    },
    height: {
      get() {
        return this.$store.state.b.user.profileInfo.height;
      },
      set(value) {
        this.$store.commit("b/updateHeight", value);
      },
    },
    shouldersMeasurement: {
      get() {
        return this.$store.state.b.user.profileInfo.shouldersMeasurement;
      },
      set(value) {
        this.$store.commit("b/updateShouldersMeasurement", value);
      },
    },
    bicepMeasurement: {
      get() {
        return this.$store.state.b.user.profileInfo.bicepMeasurement;
      },
      set(value) {
        this.$store.commit("b/updateBicepMeasurement", value);
      },
    },
    chestMeasurement: {
      get() {
        return this.$store.state.b.user.profileInfo.chestMeasurement;
      },
      set(value) {
        this.$store.commit("b/updateChestMeasurement", value);
      },
    },
    waistMeasurement: {
      get() {
        return this.$store.state.b.user.profileInfo.waistMeasurement;
      },
      set(value) {
        this.$store.commit("b/updateWaistMeasurement", value);
      },
    },
    thighMeasurement: {
      get() {
        return this.$store.state.b.user.profileInfo.thighMeasurement;
      },
      set(value) {
        this.$store.commit("b/updateThighMeasurement", value);
      },
    },
    extraInfo: {
      get() {
        return this.$store.state.b.user.profileInfo.extraInfo;
      },
      set(value) {
        this.$store.commit("b/updateExtraInfo", value);
      },
    },
  },
  watch: {
    // userProfileInfo: {
    //   handler() {
    //     console.log("profile data changed");
    //     this.$store.dispatch("b/setUserProfileData", this.userProfileInfo, {
    //       root: true,
    //     });
    //   },
    //   deep: true,
    // },
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    capitalizeFirstLetter(myString) {
      return myString.charAt(0).toUpperCase() + myString.slice(1);
    },
    sendData() {
      firebase
        .firestore()
        .collection("users")
        .doc(this.$store.state.b.user.data.uID)
        .set({
          userProfileInfo: this.$store.state.b.user.profileInfo,
        });
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

.buttons {
  width: 100%;
  padding: 8px;
  z-index: 50;
  background-color: white;
  position: -webkit-sticky; /* Safari */
  position: sticky;
  bottom: 0;
}
.box {
  margin: 10px;
  box-shadow: 0px 0 9px rgba(173, 173, 173, 0.8);
}
</style>
