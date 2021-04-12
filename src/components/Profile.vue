<template>
  <div>
    <div id="profile">
      <div>
        <h2 class="title">{{ username }}'s Profile</h2>
      </div>

      <b-collapse class="card" animation="slide" aria-id="contentIdForA11y3">
        <template #trigger="props">
          <div
            class="card-header"
            role="button"
            aria-controls="contentIdForA11y3"
          >
            <p class="card-header-title">Your goal</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"> </b-icon>
            </a>
          </div>
        </template>
        <div class="card-content">
          <b-field>
            <b-select placeholder="Select your goal" v-model="goal">
              <option>Weight loss</option>
              <option>Maintenance training</option>
              <option>Other option</option>
            </b-select>
          </b-field>
        </div>
      </b-collapse>
      <br />
      <b-collapse class="card" animation="slide" aria-id="contentIdForA11y3">
        <template #trigger="props">
          <div
            class="card-header"
            role="button"
            aria-controls="contentIdForA11y3"
          >
            <p class="card-header-title">General Info</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"> </b-icon>
            </a>
          </div>
        </template>
        <div class="card-content">
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
        </div>
      </b-collapse>
      <br />
      <b-collapse class="card" animation="slide" aria-id="contentIdForA11y3">
        <template #trigger="props">
          <div
            class="card-header"
            role="button"
            aria-controls="contentIdForA11y3"
          >
            <p class="card-header-title">Measurements</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"> </b-icon>
            </a>
          </div>
        </template>
        <div class="card-content">
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
        </div>
      </b-collapse>
      <br />
      <b-collapse class="card" animation="slide" aria-id="contentIdForA11y3">
        <template #trigger="props">
          <div
            class="card-header"
            role="button"
            aria-controls="contentIdForA11y3"
          >
            <p class="card-header-title">Other</p>
            <a class="card-header-icon">
              <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"> </b-icon>
            </a>
          </div>
        </template>
        <div class="card-content">
          <br />
          <b-field label="Additional Info">
            <b-input
              v-model="extraInfo"
              maxlength="200"
              type="textarea"
            ></b-input>
          </b-field>
        </div>
      </b-collapse>
    </div>
    <div class="footer">
      <div>
        <b-button type="is-primary" v-on:click="sendData" expanded
          >Apply Changes</b-button
        >
      </div>
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
.footer {
  border: 1px solid rgba(95, 95, 95, 0.8);
  box-shadow: 0px 0 9px rgba(173, 173, 173, 0.8);
  -webkit-position: sticky;
  z-index: 100;
  position: sticky;
  background: white;
  bottom: 0;
  height: 70px;
  width: 100%;
  padding: 15px;
}

.box {
  margin: 10px;
  box-shadow: 0px 0 9px rgba(173, 173, 173, 0.8);
}
.card {
  box-shadow: 0px 0 9px rgba(119, 119, 119, 0.8);
}
.card-content {
  padding: 5px;
}
.header {
  font-weight: bold;
}
.title {
  margin: 15px;
  font-weight: bold;
}
#profile {
  margin: 15px;
}
</style>
